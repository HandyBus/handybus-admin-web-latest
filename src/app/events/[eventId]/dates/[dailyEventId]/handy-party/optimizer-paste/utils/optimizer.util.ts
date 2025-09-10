import { getEstimatedRoute } from '@/services/kakaomoblility.service';
import {
  AddressData,
  ClusteredRouteResult,
  CalculatedData,
  SingleSideTripType,
} from '../types/optimizer.type';
import { RegionHubsViewEntity } from '@/types/hub.type';

/**
 * calculateOptimalPath 함수는 주소 데이터를 기반으로 최적 경로를 계산하는 함수입니다.
 * 5k+1 순서 (1, 6, 11, 16, ...)는 콘서트장에서 API 기준 최소시간으로 선택하고
 * 나머지 순서는 현재 위치에서 거리 기준 최단거리로 선택합니다.
 */
interface Props {
  addressData: AddressData[];
  eventPlace: RegionHubsViewEntity;
  tripType: SingleSideTripType;
}
export const calculateOptimalPath = async ({
  addressData,
  eventPlace,
  tripType,
}: Props): Promise<CalculatedData[]> => {
  const eventCoordinates = `${eventPlace.longitude},${eventPlace.latitude}`;

  // 1. 콘서트장 -> n 개의 허브까지의 소요시간 확인
  const travelTimesByKakaoMapApi = await Promise.all(
    addressData.map(async (hub) => {
      try {
        const destination = `${hub.longitude},${hub.latitude}`;
        const route = await getEstimatedRoute({
          origin:
            tripType === 'FROM_DESTINATION' ? eventCoordinates : destination,
          destination:
            tripType === 'FROM_DESTINATION' ? destination : eventCoordinates,
        });

        const duration = route.routes?.[0]?.summary?.duration || 0;
        const distance = route.routes?.[0]?.summary?.distance || 0;

        return {
          index: addressData.indexOf(hub),
          duration,
          distance,
          hub,
        };
      } catch (error) {
        console.error(`travelTimesByKakaoMapApi error: ${hub.address}:`, error);
        return {
          index: addressData.indexOf(hub),
          duration: Infinity,
          distance: Infinity,
          hub,
        };
      }
    }),
  );

  return calculateRoute(travelTimesByKakaoMapApi, addressData, tripType);
};

const calculateRoute = (
  travelTimesByKakaoMapApi: {
    index: number;
    duration: number;
    distance: number;
    hub: AddressData;
  }[],
  addressData: AddressData[],
  tripType: SingleSideTripType,
): CalculatedData[] => {
  const calculatedData: CalculatedData[] = [];
  const remainingHubs = [...addressData];
  const remainingTravelTimes = [...travelTimesByKakaoMapApi];

  let currentHub: AddressData | null = null;
  let order = 1;

  while (remainingHubs.length > 0) {
    const isApiBasedSelection = (order - 1) % 5 === 0;

    if (isApiBasedSelection) {
      /* NOTE: 행사장행 : 5k+1 순서는 API 기준으로 콘서트장에서 가장 먼 정류장 선택
       * NOTE: 귀가행 : 5k+1 순서는 API 기준으로 콘서트장에서 가장 가까운 정류장 선택 */
      const sortedByTime = remainingTravelTimes.sort((a, b) =>
        tripType === 'TO_DESTINATION'
          ? b.duration - a.duration
          : a.duration - b.duration,
      );
      const selectedTimeData = sortedByTime[0];
      const selectedHub = selectedTimeData.hub;

      calculatedData.push({
        order: order,
        longitude: selectedHub.longitude,
        latitude: selectedHub.latitude,
        address: selectedHub.address,
        tripType: tripType,
      });

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
      // 직선 거리 기준으로 현재 위치에서 가장 가까운 정류장 선택
      if (!currentHub) {
        throw new Error('Current hub is not set');
      }

      let nearestHubIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remainingHubs.length; i++) {
        const distance = calculateDistance(
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
      calculatedData.push({
        order: order,
        longitude: nextHub.longitude,
        latitude: nextHub.latitude,
        address: nextHub.address,
        tripType: tripType,
      });

      remainingHubs.splice(nearestHubIndex, 1);

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

  return calculatedData;
};

/**
 * calculateDistance
 * 함수 설명 : 함수는 두 좌표 사이의 거리를 계산하는 함수입니다.
 * 정확하게 두 좌표 사이의 거리를 계산하기 위해선, 지구라는 구면에서 두 좌표 사이의 거리를 구한다고
 * 생각해야합니다. 일반적으로 널리 쓰이는 하버사인 공식을 적용할 수 있습니다.
 * 그러나 저희는 서울 강남구, 경기 수원시 안에 아주 근접한 좌표 사이의 거리를
 * 구하는 것이기 때문에 직선거리라고 가정해도 무방합니다.
 * 참고 : 위도 1도 ≈ 111km, 경도 1도 ≈ 88.8km (서울 위도 기준)
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const latDiff = (lat2 - lat1) * 111;
  const lonDiff = (lon2 - lon1) * 88.8;
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
};

interface createMapDisplayDataProps {
  calculatedData: CalculatedData[];
  toleranceKm?: number;
}

export const createMapDisplayData = ({
  calculatedData,
  toleranceKm = 0.1,
}: createMapDisplayDataProps): ClusteredRouteResult[] => {
  const clusters: ClusteredRouteResult[] = [];
  const processed = new Set<number>();

  calculatedData.forEach((result, index) => {
    if (processed.has(index)) return;

    // 같은 위치의 다른 정류장들 찾기
    const sameLocationResults: CalculatedData[] = [result];
    const sameLocationIndexes: number[] = [index];

    calculatedData.forEach((otherResult, otherIndex) => {
      if (otherIndex === index || processed.has(otherIndex)) return;

      // 거리 계산
      const distance = calculateDistance(
        result.latitude,
        result.longitude,
        otherResult.latitude,
        otherResult.longitude,
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
      latitude: result.latitude,
      longitude: result.longitude,
      orders: orders,
      addresses: sortedResults.map((r) => r.address),
      tripType: result.tripType,
      isCluster: sortedResults.length > 1,
      displayText:
        sortedResults.length > 1 ? orders.join(',') : orders[0].toString(),
    };

    clusters.push(cluster);
  });

  return clusters.sort((a, b) => Math.min(...a.orders) - Math.min(...b.orders));
};
