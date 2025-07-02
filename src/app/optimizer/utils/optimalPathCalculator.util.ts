import { getEstimatedRoute } from '@/services/kakaomoblility.service';

export interface AddressData {
  longitude: number;
  latitude: number;
  address: string;
  region?: string;
  tripType: 'fromDestination' | 'toDestination';
}

export interface RouteResult {
  order: number;
  address: string;
  region: string;
  travelTime?: number;
  distance?: number;
  tripType: 'fromDestination' | 'toDestination';
}

const OptimalPathCalculator = async (
  addressData: AddressData[],
  concertHall: { longitude: number; latitude: number },
  departureTime: string = '202507052200',
  tripType: 'fromDestination' | 'toDestination' = 'fromDestination',
): Promise<RouteResult[]> => {
  const concertOrigin = `${concertHall.longitude},${concertHall.latitude}`;

  // tripType에 따라 해당하는 허브들만 필터링
  const filteredHubs = addressData.filter((hub) => hub.tripType === tripType);

  // 1. 콘서트장 -> n 개의 허브까지의 소요시간 확인
  const travelTimesFromConcert = await Promise.all(
    filteredHubs.map(async (hub) => {
      try {
        const destination = `${hub.longitude},${hub.latitude}`;
        const route = await getEstimatedRoute({
          departureTime,
          origin: concertOrigin,
          destination,
        });

        const duration = route.routes?.[0]?.summary?.duration || 0;
        const distance = route.routes?.[0]?.summary?.distance || 0;

        return {
          index: filteredHubs.indexOf(hub),
          duration,
          distance,
          hub,
        };
      } catch (error) {
        console.error(`Error calculating route to ${hub.address}:`, error);
        return {
          index: filteredHubs.indexOf(hub),
          duration: Infinity,
          distance: Infinity,
          hub,
        };
      }
    }),
  );

  console.log('travelTimesFromConcert', travelTimesFromConcert);

  if (tripType === 'toDestination') {
    // 오는편: 새로운 로직 (5k+1 순서는 API 기준, 나머지는 거리 기준)
    return calculateToDestinationRoute(travelTimesFromConcert, filteredHubs);
  } else {
    // 가는편: 새로운 로직 (5k+1 순서는 API 기준, 나머지는 거리 기준)
    return calculateFromDestinationRoute(travelTimesFromConcert, filteredHubs);
  }
};

// 가는편 경로 계산 (새로운 로직)
// 5k+1 순서 (1, 6, 11, 16, ...)는 콘서트장에서 API 기준 최소시간으로 선택
// 나머지 순서는 현재 위치에서 거리 기준 최단거리로 선택
const calculateFromDestinationRoute = (
  travelTimesFromConcert: {
    index: number;
    duration: number;
    distance: number;
    hub: AddressData;
  }[],
  filteredHubs: AddressData[],
): RouteResult[] => {
  const optimalRoute: RouteResult[] = [];
  const remainingHubs = [...filteredHubs];
  const remainingTravelTimes = [...travelTimesFromConcert];

  let currentHub: AddressData | null = null;
  let order = 1;

  while (remainingHubs.length > 0) {
    // 5k+1 순서 (1, 6, 11, 16, ...)인지 확인
    const isApiBasedSelection = (order - 1) % 5 === 0;

    if (isApiBasedSelection) {
      // API 기준으로 콘서트장에서 가장 가까운 정류장 선택
      const sortedByTime = remainingTravelTimes.sort(
        (a, b) => a.duration - b.duration,
      );
      const selectedTimeData = sortedByTime[0];
      const selectedHub = selectedTimeData.hub;

      optimalRoute.push({
        order: order,
        address: selectedHub.address,
        region: extractRegion(selectedHub.address),
        travelTime: selectedTimeData.duration,
        distance: selectedTimeData.distance,
        tripType: 'fromDestination',
      });

      // 선택된 허브를 남은 목록에서 제거
      const hubIndex = remainingHubs.findIndex(
        (hub) => hub.address === selectedHub.address,
      );
      const timeIndex = remainingTravelTimes.findIndex(
        (time) => time.hub.address === selectedHub.address,
      );

      remainingHubs.splice(hubIndex, 1);
      remainingTravelTimes.splice(timeIndex, 1);

      currentHub = selectedHub;
    } else {
      // 거리 기준으로 현재 위치에서 가장 가까운 정류장 선택
      if (!currentHub) {
        throw new Error('Current hub is not set');
      }

      let nearestHubIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remainingHubs.length; i++) {
        const distance = calculateEuclideanDistance(
          currentHub.latitude,
          currentHub.longitude,
          remainingHubs[i].latitude,
          remainingHubs[i].longitude,
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestHubIndex = i;
        }
      }

      const nextHub = remainingHubs[nearestHubIndex];
      optimalRoute.push({
        order: order,
        address: nextHub.address,
        region: extractRegion(nextHub.address),
        distance: minDistance,
        tripType: 'fromDestination',
      });

      // 선택된 허브를 남은 목록에서 제거
      remainingHubs.splice(nearestHubIndex, 1);

      // 해당하는 travelTime 데이터도 제거
      const timeIndex = remainingTravelTimes.findIndex(
        (time) => time.hub.address === nextHub.address,
      );
      if (timeIndex !== -1) {
        remainingTravelTimes.splice(timeIndex, 1);
      }

      currentHub = nextHub;
    }

    order++;
  }

  return optimalRoute;
};

// 오는편 경로 계산 (새로운 로직)
// 5k+1 순서 (1, 6, 11, 16, ...)는 콘서트장에서 API 기준 최소시간으로 선택
// 나머지 순서는 현재 위치에서 거리 기준 최단거리로 선택
const calculateToDestinationRoute = (
  travelTimesFromConcert: {
    index: number;
    duration: number;
    distance: number;
    hub: AddressData;
  }[],
  filteredHubs: AddressData[],
): RouteResult[] => {
  const optimalRoute: RouteResult[] = [];
  const remainingHubs = [...filteredHubs];
  const remainingTravelTimes = [...travelTimesFromConcert];

  let currentHub: AddressData | null = null;
  let order = 1;

  while (remainingHubs.length > 0) {
    // 5k+1 순서 (1, 6, 11, 16, ...)인지 확인
    const isApiBasedSelection = (order - 1) % 5 === 0;

    if (isApiBasedSelection) {
      // API 기준으로 콘서트장에서 가장 가까운 정류장 선택
      const sortedByTime = remainingTravelTimes.sort(
        (a, b) => a.duration - b.duration,
      );
      const selectedTimeData = sortedByTime[0];
      const selectedHub = selectedTimeData.hub;

      optimalRoute.push({
        order: order,
        address: selectedHub.address,
        region: extractRegion(selectedHub.address),
        travelTime: selectedTimeData.duration,
        distance: selectedTimeData.distance,
        tripType: 'toDestination',
      });

      // 선택된 허브를 남은 목록에서 제거
      const hubIndex = remainingHubs.findIndex(
        (hub) => hub.address === selectedHub.address,
      );
      const timeIndex = remainingTravelTimes.findIndex(
        (time) => time.hub.address === selectedHub.address,
      );

      remainingHubs.splice(hubIndex, 1);
      remainingTravelTimes.splice(timeIndex, 1);

      currentHub = selectedHub;
    } else {
      // 거리 기준으로 현재 위치에서 가장 가까운 정류장 선택
      if (!currentHub) {
        throw new Error('Current hub is not set');
      }

      let nearestHubIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remainingHubs.length; i++) {
        const distance = calculateEuclideanDistance(
          currentHub.latitude,
          currentHub.longitude,
          remainingHubs[i].latitude,
          remainingHubs[i].longitude,
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestHubIndex = i;
        }
      }

      const nextHub = remainingHubs[nearestHubIndex];
      optimalRoute.push({
        order: order,
        address: nextHub.address,
        region: extractRegion(nextHub.address),
        distance: minDistance,
        tripType: 'toDestination',
      });

      // 선택된 허브를 남은 목록에서 제거
      remainingHubs.splice(nearestHubIndex, 1);

      // 해당하는 travelTime 데이터도 제거
      const timeIndex = remainingTravelTimes.findIndex(
        (time) => time.hub.address === nextHub.address,
      );
      if (timeIndex !== -1) {
        remainingTravelTimes.splice(timeIndex, 1);
      }

      currentHub = nextHub;
    }

    order++;
  }

  return optimalRoute;
};

// 단순 유클리드 거리 계산 (좌표 기반)
const calculateEuclideanDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  // 위도 1도 ≈ 111km, 경도 1도 ≈ 88.8km (서울 위도 기준)
  const latDiff = (lat2 - lat1) * 111;
  const lonDiff = (lon2 - lon1) * 88.8; // 서울 위도(37.5도) 기준
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
};

// 주소에서 권역 추출
const extractRegion = (address: string): string => {
  if (address.includes('송파')) {
    return '송파';
  }
  if (address.includes('서초')) {
    return '서초';
  }
  if (address.includes('강남')) {
    return '강남';
  }

  // 구 이름 추출
  const guMatch = address.match(/([가-힣]+구)/);
  if (guMatch) {
    return guMatch[1];
  }

  return '기타';
};

// 지도 표시용 클러스터링된 데이터 타입
export interface ClusteredRouteResult {
  latitude: number;
  longitude: number;
  orders: number[];
  addresses: string[];
  regions: string[];
  travelTimes?: number[];
  distances?: number[];
  tripType: 'fromDestination' | 'toDestination';
  isCluster: boolean;
  displayText: string;
  popupContent: Array<{
    order: number;
    address: string;
    region: string;
    travelTime?: number;
    distance?: number;
  }>;
}

// 같은 위치의 정류장들을 클러스터링하는 함수
export const clusterRouteResults = (
  routeResults: RouteResult[],
  addressData: AddressData[],
  toleranceKm: number = 0.1, // 100m 이내는 같은 위치로 간주
): ClusteredRouteResult[] => {
  const clusters: ClusteredRouteResult[] = [];
  const processed = new Set<number>();

  routeResults.forEach((result, index) => {
    if (processed.has(index)) return;

    // 현재 결과의 좌표 찾기
    const currentAddress = addressData.find(
      (addr) => addr.address === result.address,
    );
    if (!currentAddress) return;

    // 같은 위치의 다른 정류장들 찾기
    const sameLocationResults: RouteResult[] = [result];
    const sameLocationIndexes: number[] = [index];

    routeResults.forEach((otherResult, otherIndex) => {
      if (otherIndex === index || processed.has(otherIndex)) return;

      const otherAddress = addressData.find(
        (addr) => addr.address === otherResult.address,
      );
      if (!otherAddress) return;

      // 거리 계산
      const distance = calculateEuclideanDistance(
        currentAddress.latitude,
        currentAddress.longitude,
        otherAddress.latitude,
        otherAddress.longitude,
      );

      // 허용 거리 내에 있으면 같은 클러스터로 묶기
      if (distance <= toleranceKm) {
        sameLocationResults.push(otherResult);
        sameLocationIndexes.push(otherIndex);
      }
    });

    // 처리된 인덱스들 마킹
    sameLocationIndexes.forEach((idx) => processed.add(idx));

    // 순서대로 정렬
    const sortedResults = sameLocationResults.sort((a, b) => a.order - b.order);
    const orders = sortedResults.map((r) => r.order);

    // 클러스터 데이터 생성
    const cluster: ClusteredRouteResult = {
      latitude: currentAddress.latitude,
      longitude: currentAddress.longitude,
      orders: orders,
      addresses: sortedResults.map((r) => r.address),
      regions: sortedResults.map((r) => r.region),
      travelTimes: sortedResults
        .map((r) => r.travelTime)
        .filter((t) => t !== undefined),
      distances: sortedResults
        .map((r) => r.distance)
        .filter((d) => d !== undefined),
      tripType: result.tripType,
      isCluster: sortedResults.length > 1,
      displayText:
        sortedResults.length > 1 ? orders.join(',') : orders[0].toString(),
      popupContent: sortedResults.map((r) => ({
        order: r.order,
        address: r.address,
        region: r.region,
        travelTime: r.travelTime,
        distance: r.distance,
      })),
    };

    clusters.push(cluster);
  });

  return clusters.sort((a, b) => Math.min(...a.orders) - Math.min(...b.orders));
};

// 지도 표시용 데이터 생성 (클러스터링 + 팝업 데이터)
export const createMapDisplayData = (
  routeResults: RouteResult[],
  addressData: AddressData[],
  toleranceKm: number = 0.1,
): ClusteredRouteResult[] => {
  return clusterRouteResults(routeResults, addressData, toleranceKm);
};

// 6. 엑셀 파일 추출을 위한 데이터 변환 함수
export const convertToExcelData = (routeResults: RouteResult[]) => {
  return routeResults.map((result) => ({
    순서: result.order,
    세부주소: result.address,
    권역: result.region,
    여정타입: result.tripType === 'fromDestination' ? '가는편' : '오는편',
    '소요시간(초)': result.travelTime || '',
    '거리(km)': result.distance ? (result.distance / 1000).toFixed(2) : '',
  }));
};

export default OptimalPathCalculator;

// 사용 예시 함수
export const calculateOptimalRouteExample = async (
  addressData: AddressData[],
  tripType: 'fromDestination' | 'toDestination' = 'fromDestination',
) => {
  // 콘서트장 좌표 (예: 고양 종합운동장)
  const concertHall = {
    longitude: 126.8223,
    latitude: 37.6483,
  };

  try {
    // 새로운 로직: 5k+1 순서는 콘서트장에서 API 기준 최소시간으로 선택
    // 나머지 순서는 현재 위치에서 위도/경도 기준 최단거리로 선택
    const optimalRoute = await OptimalPathCalculator(
      addressData,
      concertHall,
      '202507052200',
      tripType,
    );
    const excelData = convertToExcelData(optimalRoute);

    // 지도 표시용 클러스터링 데이터 생성
    const clusteredData = createMapDisplayData(optimalRoute, addressData);

    console.log('최적 경로 결과:', optimalRoute);
    console.log('엑셀 데이터:', excelData);
    console.log('클러스터링 데이터:', clusteredData);

    return {
      optimalRoute,
      excelData,
      clusteredData,
    };
  } catch (error) {
    console.error('최적 경로 계산 중 오류 발생:', error);
    throw error;
  }
};
