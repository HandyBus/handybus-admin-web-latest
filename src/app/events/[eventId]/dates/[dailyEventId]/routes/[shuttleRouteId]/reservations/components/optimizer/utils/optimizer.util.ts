import { getEstimatedRoute } from '@/services/kakaomoblility.service';
import {
  ClusteredRouteResult,
  CalculatedData,
  BusAndReservation,
  TripTypeWithRoundTrip,
} from '../types/optimizer.type';
import { RegionHubsViewEntity } from '@/types/hub.type';
import { ReservationViewEntity } from '@/types/reservation.type';
import { ShuttleBusesViewEntity } from '@/types/shuttleBus.type';

/**
 * calculateOptimalPath 함수는 주소 데이터를 기반으로 최적 경로를 계산하는 함수입니다.
 * 5k+1 순서 (1, 6, 11, 16, ...)는 콘서트장에서 API 기준 최소시간으로 선택하고
 * 나머지 순서는 현재 위치에서 거리 기준 최단거리로 선택합니다.
 */
interface Props {
  rawCalculatedData: CalculatedData[];
  eventPlace: RegionHubsViewEntity;
  tripType: TripTypeWithRoundTrip;
}
export const calculateOptimalPath = async ({
  rawCalculatedData,
  eventPlace,
  tripType,
}: Props): Promise<CalculatedData[]> => {
  const eventCoordinates = `${eventPlace.longitude},${eventPlace.latitude}`;

  // 1. 콘서트장 -> n 개의 허브까지의 소요시간 확인
  const travelTimesByKakaoMapApi = await Promise.all(
    rawCalculatedData.map(async (item) => {
      try {
        const destination = `${item.reservation.metadata?.desiredHubLongitude},${item.reservation.metadata?.desiredHubLatitude}`;
        const route = await getEstimatedRoute({
          origin:
            tripType === 'FROM_DESTINATION' ? eventCoordinates : destination,
          destination:
            tripType === 'FROM_DESTINATION' ? destination : eventCoordinates,
        });

        const duration = route.routes?.[0]?.summary?.duration || 0;
        const distance = route.routes?.[0]?.summary?.distance || 0;

        return {
          index: rawCalculatedData.indexOf(item),
          duration,
          distance,
          // bus: item.bus,
          reservation: item.reservation,
        };
      } catch (error) {
        console.error(
          `travelTimesByKakaoMapApi error: ${item.reservation.metadata?.desiredHubAddress}:`,
          error,
        );
        return {
          index: rawCalculatedData.indexOf(item),
          duration: Infinity,
          distance: Infinity,
          // bus: item.bus,
          reservation: item.reservation,
        };
      }
    }),
  );

  return calculateRoute(travelTimesByKakaoMapApi, rawCalculatedData, tripType);
};

const calculateRoute = (
  travelTimesByKakaoMapApi: {
    index: number;
    duration: number;
    distance: number;
    bus?: ShuttleBusesViewEntity;
    reservation: ReservationViewEntity;
  }[],
  rawCalculatedData: CalculatedData[],
  tripType: TripTypeWithRoundTrip,
): CalculatedData[] => {
  const calculatedData: CalculatedData[] = [];
  const remainingItems = [...rawCalculatedData];
  const remainingTravelTimes = [...travelTimesByKakaoMapApi];

  let currentHub: ReservationViewEntity['metadata'] | null = null;
  let order = 1;

  while (remainingItems.length > 0) {
    const isApiBasedSelection = (order - 1) % 5 === 0;

    if (isApiBasedSelection) {
      /* NOTE: 가는편 : 5k+1 순서는 API 기준으로 콘서트장에서 가장 먼 정류장 선택
       * NOTE: 오는편 : 5k+1 순서는 API 기준으로 콘서트장에서 가장 가까운 정류장 선택 */
      const sortedByTime = remainingTravelTimes.sort((a, b) =>
        tripType === 'TO_DESTINATION'
          ? b.duration - a.duration
          : a.duration - b.duration,
      );
      const selectedTimeData = sortedByTime[0];
      const selectedHub = selectedTimeData.reservation.metadata;

      calculatedData.push({
        order: order,
        reservation: selectedTimeData.reservation,
        // bus: selectedTimeData.bus,
      });

      const targetHubIndex = remainingItems.findIndex(
        (hub) =>
          hub.reservation.metadata?.desiredHubAddress ===
          selectedHub?.desiredHubAddress,
      );
      const targetTravelTimeIndex = remainingTravelTimes.findIndex(
        (time) =>
          time.reservation.metadata?.desiredHubAddress ===
          selectedHub?.desiredHubAddress,
      );

      remainingItems.splice(targetHubIndex, 1);
      remainingTravelTimes.splice(targetTravelTimeIndex, 1);

      currentHub = selectedHub;
    } else {
      // 직선 거리 기준으로 현재 위치에서 가장 가까운 정류장 선택
      if (
        !currentHub ||
        !currentHub.desiredHubLatitude ||
        !currentHub.desiredHubLongitude
      ) {
        throw new Error('Current hub is not set');
      }

      let nearestHubIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remainingItems.length; i++) {
        const metadata = remainingItems[i].reservation.metadata;

        if (
          !metadata ||
          !metadata.desiredHubLatitude ||
          !metadata.desiredHubLongitude
        ) {
          throw new Error(
            `Remaining ${i} hub is not set: ${metadata?.desiredHubAddress}`,
          );
        }

        const distance = calculateDistance(
          currentHub.desiredHubLatitude,
          currentHub.desiredHubLongitude,
          metadata.desiredHubLatitude,
          metadata.desiredHubLongitude,
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestHubIndex = i;
        }
      }

      const nextHub = remainingItems[nearestHubIndex];
      calculatedData.push({
        order: order,
        reservation: nextHub.reservation,
        // bus: nextHub.bus,
      });

      remainingItems.splice(nearestHubIndex, 1);

      const targetTravelTimeIndex = remainingTravelTimes.findIndex(
        (time) =>
          time.reservation.metadata?.desiredHubAddress ===
          nextHub.reservation.metadata?.desiredHubAddress,
      );
      if (targetTravelTimeIndex !== -1) {
        remainingTravelTimes.splice(targetTravelTimeIndex, 1);
      }

      currentHub = nextHub.reservation.metadata;
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

      const metadata = otherResult.reservation.metadata;

      if (
        !metadata ||
        !metadata.desiredHubLatitude ||
        !metadata.desiredHubLongitude ||
        !result.reservation.metadata?.desiredHubLatitude ||
        !result.reservation.metadata?.desiredHubLongitude
      ) {
        throw new Error(
          `Remaining ${otherIndex} hub is not set: ${metadata?.desiredHubAddress}`,
        );
      }

      // 거리 계산
      const distance = calculateDistance(
        result.reservation.metadata?.desiredHubLatitude,
        result.reservation.metadata?.desiredHubLongitude,
        metadata.desiredHubLatitude,
        metadata.desiredHubLongitude,
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

    const metadata = result.reservation.metadata;

    if (
      !metadata ||
      !metadata.desiredHubLatitude ||
      !metadata.desiredHubLongitude
    ) {
      throw new Error('Metadata is not set');
    }

    // 클러스터 데이터 생성
    const cluster: ClusteredRouteResult = {
      latitude: metadata.desiredHubLatitude,
      longitude: metadata.desiredHubLongitude,
      orders: orders,
      addresses: sortedResults.map(
        (r) => r.reservation.metadata?.desiredHubAddress ?? '',
      ),
      tripType: result.reservation.type,
      isCluster: sortedResults.length > 1,
      displayText:
        sortedResults.length > 1 ? orders.join(',') : orders[0].toString(),
    };

    clusters.push(cluster);
  });

  return clusters.sort((a, b) => Math.min(...a.orders) - Math.min(...b.orders));
};
