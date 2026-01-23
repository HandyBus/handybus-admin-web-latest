import { BulkRouteItem, SeasonType } from '../form.type';
import { RegionHubsViewEntity } from '@/types/hub.type';
import { DEFAULT_HUBS } from '../constants/default-hubs.const';
import { ROUTE_PRICE_BY_REGION } from '../constants/route-price-by-big-region.const';
import { DESTINATION_TRIP_TIME_BY_DEFAULT_HUB } from '../constants/trip-time-by-default-hub.const';
import { MAX_PASSENGER_COUNT_BY_BIG_REGION } from '../constants/max-passenger-count-by-big-region.const';
import { BIG_REGIONS_TO_SHORT_NAME, ID_TO_REGION } from '@/constants/regions';
import dayjs from 'dayjs';

/**
 * default-hubs를 기반으로 노선을 생성합니다.
 * 각 default-hub를 경유지로 하고, destinationHub를 도착지로 하는 노선을 생성합니다.
 */
export const createRoutesFromDefaultHubs = (
  destinationHub: RegionHubsViewEntity,
  baseDate: string, // daily event date
  toDestinationArrivalTime: string | undefined,
  fromDestinationDepartureTime: string | undefined,
  season: SeasonType = '성수기',
  defaultHubMap: Map<string, RegionHubsViewEntity> = new Map(),
): BulkRouteItem[] => {
  const destinationName = destinationHub.name;

  // destinationHub의 regionId로부터 big region과 small region 가져오기
  const destinationRegionInfo = ID_TO_REGION[destinationHub.regionId];
  if (!destinationRegionInfo) {
    return [];
  }
  const destinationBigRegion = destinationRegionInfo.bigRegion;
  const destinationSmallRegion = destinationRegionInfo.smallRegion;

  // trip-time 테이블에서 도착지에 대한 정보 가져오기
  const tripTimeData = DESTINATION_TRIP_TIME_BY_DEFAULT_HUB[destinationName];

  if (!tripTimeData) {
    return [];
  }

  // 각 default-hub에 대해 노선 생성
  const routes = DEFAULT_HUBS.map((defaultHub) => {
    const hubName = defaultHub.name;
    const bigRegionName = defaultHub.bigRegionName;

    // default-hub 이름으로 실제 hub 정보 찾기
    const matchedHub = defaultHubMap.get(hubName);

    // trip-time 정보 가져오기
    const tripTime = tripTimeData[hubName];
    if (!tripTime) {
      return null;
    }

    // 가격 정보 가져오기
    // 경유지의 big region, season, 도착지의 big region, 도착지의 small region 순서로 조회
    // small region이 없으면 '전체'로 조회
    const priceBySmallRegion =
      ROUTE_PRICE_BY_REGION[bigRegionName]?.[season]?.[destinationBigRegion]?.[
        destinationSmallRegion
      ];
    const priceByAll =
      ROUTE_PRICE_BY_REGION[bigRegionName]?.[season]?.[destinationBigRegion]?.[
        '전체'
      ];
    const priceData = priceBySmallRegion || priceByAll;

    if (!priceData) {
      return null;
    }

    // 경유지 hub 정보
    // default-hub의 실제 hub 정보가 있으면 사용, 없으면 null
    const toDestinationHubs = [
      matchedHub
        ? {
            regionId: matchedHub.regionId,
            regionHubId: matchedHub.regionHubId,
            latitude: matchedHub.latitude,
            longitude: matchedHub.longitude,
          }
        : {
            regionId: null,
            regionHubId: null,
            latitude: null,
            longitude: null,
          },
      {
        regionId: destinationHub.regionId,
        regionHubId: destinationHub.regionHubId,
        latitude: destinationHub.latitude,
        longitude: destinationHub.longitude,
      },
    ];

    // 행사장행 도착 시간 계산
    const toDestinationArrivalTimes: Array<{ time: string }> = [];

    if (toDestinationArrivalTime) {
      // HH:mm 형식의 시간을 파싱
      const [hours, minutes] = toDestinationArrivalTime.split(':').map(Number);
      // baseDate에 toDestinationArrivalTime의 시간 부분 적용
      const destinationArrivalTimeOnBaseDate = dayjs(baseDate)
        .set('hour', hours)
        .set('minute', minutes)
        .set('second', 0)
        .set('millisecond', 0);

      // 경유지 도착 시간 = 도착지 도착 시간 - (경유지에서 도착지까지 소요시간)
      const hubArrivalTime = destinationArrivalTimeOnBaseDate
        .subtract(tripTime.eventTripTime, 'minute')
        .subtract(tripTime.cushionTime, 'minute')
        .toISOString();

      toDestinationArrivalTimes.push({ time: hubArrivalTime });
      toDestinationArrivalTimes.push({
        time: destinationArrivalTimeOnBaseDate.toISOString(),
      });
    } else {
      toDestinationArrivalTimes.push({ time: baseDate });
      toDestinationArrivalTimes.push({ time: baseDate });
    }

    // 귀가행 출발 시간 계산
    const fromDestinationArrivalTimes: Array<{ time: string }> = [];

    if (fromDestinationDepartureTime) {
      // HH:mm 형식의 시간을 파싱
      const [hours, minutes] = fromDestinationDepartureTime
        .split(':')
        .map(Number);
      // baseDate에 fromDestinationDepartureTime의 시간 부분 적용
      const destinationDepartureTimeOnBaseDate = dayjs(baseDate)
        .set('hour', hours)
        .set('minute', minutes)
        .set('second', 0)
        .set('millisecond', 0);

      // 도착지 출발 시간 추가
      fromDestinationArrivalTimes.push({
        time: destinationDepartureTimeOnBaseDate.toISOString(),
      });

      // 경유지 도착 시간 = 도착지 출발 시간 + (도착지에서 경유지까지 소요시간)
      const hubArrivalTime = destinationDepartureTimeOnBaseDate
        .add(tripTime.returnTripTime, 'minute')
        .add(tripTime.cushionTime, 'minute')
        .toISOString();

      fromDestinationArrivalTimes.push({ time: hubArrivalTime });
    } else {
      fromDestinationArrivalTimes.push({ time: baseDate });
      fromDestinationArrivalTimes.push({ time: baseDate });
    }

    // 노선 이름
    const hubBigRegionShortName = BIG_REGIONS_TO_SHORT_NAME[bigRegionName];
    const shortHubName = hubName.startsWith('대전')
      ? hubName.split(' ')[1]
      : hubName.split(' ')[0];
    const routeName = `${hubBigRegionShortName}_${shortHubName}`;

    // 최대 승객 수는 bigRegionName을 기반으로 자동 설정
    const maxPassengerCount =
      MAX_PASSENGER_COUNT_BY_BIG_REGION[bigRegionName] ?? 28;

    return {
      name: routeName,
      maxPassengerCount,
      isEnabled: true,
      hasEarlybird: false,
      earlybirdPrice: {
        toDestination: 0,
        fromDestination: 0,
        roundTrip: 0,
      },
      regularPrice: {
        toDestination: priceData.행사장행,
        fromDestination: priceData.귀가행,
        roundTrip: priceData.왕복,
      },
      toDestinationHubs:
        toDestinationHubs as BulkRouteItem['toDestinationHubs'],
      toDestinationArrivalTimes,
      fromDestinationArrivalTimes,
    };
  }).filter((route): route is BulkRouteItem => route !== null);

  return routes;
};
