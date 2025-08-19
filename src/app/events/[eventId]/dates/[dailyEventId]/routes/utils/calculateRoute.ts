import dayjs from 'dayjs';
import { getEstimatedRouteFuturePath } from '@/services/kakaomoblility.service';
import {
  roundDownToNearestFiveMinutes,
  roundUpToNearestFiveMinutes,
} from './roundNearestFiveMinutes.util';
import { UseFormSetValue } from 'react-hook-form';
import { MultiRouteFormValues } from '../new/form.type';

/**
 * 경로 계산을 위한 허브 데이터 타입
 */
export interface RouteHubData {
  regionId: string | null;
  regionHubId: string | null;
  latitude: number | null;
  longitude: number | null;
  arrivalTime: string;
}

/**
 * calculateRouteTimes 는 출발 시간 기준으로 경유지 별 arrivalTime을 계산합니다.
 *
 * @param type 경로 계산 방향
 * @param hubsArray 경유지 배열
 * @return 계산된 경유지 배열
 */
export const calculateRouteTimes = async (
  type: 'toDestination' | 'fromDestination',
  hubsArray: RouteHubData[],
): Promise<RouteHubData[]> => {
  // 필수 데이터 유효성 검사
  const isInvalid = hubsArray.some((hub) => !hub.regionId || !hub.regionHubId);

  if (isInvalid || hubsArray.length < 2 || !hubsArray[0].arrivalTime) {
    throw new Error(
      '모든 경유지의 지역, 정류장, 첫 정류장의 시간이 입력되어야 합니다.',
    );
  }

  const origin = `${hubsArray[0].longitude},${hubsArray[0].latitude}`;
  const destination = `${hubsArray[hubsArray.length - 1].longitude},${hubsArray[hubsArray.length - 1].latitude}`;
  const waypoints = hubsArray
    .slice(1, -1)
    .map((hub) => `${hub.longitude},${hub.latitude}`)
    .join('|');
  const departureTime = dayjs(hubsArray[0].arrivalTime)
    .tz('Asia/Seoul')
    .format('YYYYMMDDHHmm'); // kakaomobility api 는 한국시간을 기준으로 받기에 한국시간으로 변환

  const res = await getEstimatedRouteFuturePath({
    origin,
    destination,
    waypoints,
    departureTime,
  });

  if (res.routes[0].result_code !== 0) {
    throw new Error(res.routes[0].result_msg);
  }

  const result = res.routes.map((route) => ({
    distance: route.summary.distance,
    duration: route.summary.duration,
    sections: route.sections.map((section) => ({
      distance: section.distance,
      duration: section.duration,
    })),
  }));

  let currentTime = dayjs(hubsArray[0].arrivalTime);
  const calculatedHubsArray = hubsArray.map((_, index) => {
    if (index === 0)
      return {
        ...hubsArray[index],
        arrivalTime: currentTime.toISOString(),
      };

    // 시간 추가 후 바로 5분 단위로 올림 처리
    currentTime = roundUpToNearestFiveMinutes(
      currentTime.add(result[0].sections[index - 1].duration, 'seconds'),
    );

    return {
      ...hubsArray[index],
      arrivalTime: currentTime.toISOString(),
    };
  });

  return calculatedHubsArray;
};

/**
 * calculateRouteBackwardTimes 는 도착 시간을 기준으로 경유지 별 arrivalTime을 계산합니다.
 * api 에서 도착시간을 기준으로 계산해주지 않아, 호출자의 현재 시각을 기준으로 총 소요시간을 계산한뒤,
 * 도착시간에서 총 소요시간을 빼서 실제 출발 시간을 계산합니다.
 *
 * @param type 경로 계산 방향
 * @param hubsArray 경유지 배열
 * @return 출발 시간
 */
export const calculateRouteBackwardTimes = async (
  type: 'toDestination' | 'fromDestination',
  hubsArray: RouteHubData[],
): Promise<RouteHubData[]> => {
  // 필수 데이터 유효성 검사
  const isInvalid = hubsArray.some((hub) => !hub.regionId || !hub.regionHubId);

  // 마지막 정류장(도착지)의 시간이 필요
  const lastIndex = hubsArray.length - 1;
  if (isInvalid || hubsArray.length < 2 || !hubsArray[lastIndex].arrivalTime) {
    throw new Error(
      '모든 경유지의 지역, 정류장, 도착지의 시간이 입력되어야 합니다.',
    );
  }

  // 1. 임의의 출발 시간으로 API 호출하여 소요 시간 정보 확보
  const origin = `${hubsArray[0].longitude},${hubsArray[0].latitude}`;
  const destination = `${hubsArray[lastIndex].longitude},${hubsArray[lastIndex].latitude}`;
  const waypoints = hubsArray
    .slice(1, -1)
    .map((hub) => `${hub.longitude},${hub.latitude}`)
    .join('|');

  // 임의의 출발 시간
  const tempDepartureTime = dayjs().format('YYYYMMDDHHmm'); // kakaomobility api 는 한국시간을 기준으로 받기에 한국시간으로 변환

  const res = await getEstimatedRouteFuturePath({
    origin,
    destination,
    waypoints,
    departureTime: tempDepartureTime,
  });

  if (res.routes[0].result_code !== 0) {
    throw new Error(res.routes[0].result_msg);
  }

  const result = res.routes[0];
  const totalDuration = result.summary.duration; // 총 소요 시간(초)

  // 2. 도착 시간에서 총 소요 시간을 빼서 실제 출발 시간 계산
  const lastHubArrivalTime = dayjs(hubsArray[lastIndex].arrivalTime).tz(
    'Asia/Seoul',
  );
  const actualDepartureTime = lastHubArrivalTime.subtract(
    totalDuration,
    'second',
  );

  const roundedActualDepartureTime =
    roundDownToNearestFiveMinutes(actualDepartureTime);

  // 4. 각 경유지 시간 계산
  let currentTime = actualDepartureTime;
  const calculatedHubsArray = hubsArray.map((_, index) => {
    if (index === 0)
      return {
        ...hubsArray[index],
        arrivalTime: roundedActualDepartureTime.toISOString(),
      };

    if (index < result.sections.length) {
      // 시간 추가 후 바로 5분 단위로 올림 처리
      currentTime = roundUpToNearestFiveMinutes(
        currentTime.add(result.sections[index - 1].duration, 'second'),
      );

      return {
        ...hubsArray[index],
        arrivalTime: currentTime.toISOString(),
      };
    }

    return {
      ...hubsArray[index],
      arrivalTime:
        roundUpToNearestFiveMinutes(lastHubArrivalTime).toISOString(),
    };
  });

  return calculatedHubsArray;
};

/**
 * calculateUnionTimes 는 출발시간과 도착시간을 모두 고려하여 경로를 계산합니다.
 * calculateRouteBackwardTimes와 calculateRouteTimes를 순차적으로 호출하여 경로 소요시간을 계산합니다.
 * 설정한 도착시간과 10분이상 차이나게되면 출발시간을 시간 차 만큼 보상하여 경로를 재계산합니다.
 *
 * @param hubsArray 경유지 배열
 * @return 계산된 시간 배열
 */
export const calculateUnionTimes = async (
  hubsArray: RouteHubData[],
): Promise<RouteHubData[]> => {
  const plannedArrivalTime = hubsArray[hubsArray.length - 1].arrivalTime;

  try {
    // 1. 도착 시간 기준으로 출발 시간 계산
    const resultOfCalculateRouteBackwardTimes =
      await calculateRouteBackwardTimes('toDestination', hubsArray);

    if (!resultOfCalculateRouteBackwardTimes) {
      throw new Error('경로 계산 중 오류가 발생했습니다.');
    }

    // 2. 출발 시간 기준으로 도착 시간 계산
    const resultOfCalculateRouteTimes = await calculateRouteTimes(
      'toDestination',
      resultOfCalculateRouteBackwardTimes,
    );

    if (!resultOfCalculateRouteTimes) {
      throw new Error('경로 계산 중 오류가 발생했습니다.');
    }

    const arrivalTimeDifference = dayjs(plannedArrivalTime).diff(
      resultOfCalculateRouteTimes[hubsArray.length - 1].arrivalTime,
      'minute',
    );

    if (Math.abs(arrivalTimeDifference) >= 10) {
      let newDepartureTime;
      if (arrivalTimeDifference > 0) {
        newDepartureTime = dayjs(
          resultOfCalculateRouteBackwardTimes[0].arrivalTime,
        ).add(arrivalTimeDifference, 'minute');
      } else {
        newDepartureTime = dayjs(
          resultOfCalculateRouteBackwardTimes[0].arrivalTime,
        ).subtract(Math.abs(arrivalTimeDifference), 'minute');
      }

      const newHubsArray = [...hubsArray];
      newHubsArray[0].arrivalTime =
        roundDownToNearestFiveMinutes(newDepartureTime).toISOString();

      const newEstimatedDestinationArrivalTimeResult =
        await calculateRouteTimes('toDestination', newHubsArray);

      return newEstimatedDestinationArrivalTimeResult;
    }

    return resultOfCalculateRouteTimes;
  } catch (error) {
    throw new Error(
      `경로 계산 통합 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    );
  }
};

/**
 * updateRouteFormValues 는 계산된 시간 정보로 폼 값을 업데이트합니다.
 *
 * @param type 경로 계산 방향
 * @param calculatedTimes 계산된 시간 배열
 * @param setValue
 */
export const updateRouteFormValues = (
  type: 'toDestination' | 'fromDestination',
  calculatedTimes: RouteHubData[],
  setValue: UseFormSetValue<MultiRouteFormValues>,
  currentRouteIndex: number,
) => {
  calculatedTimes.forEach((hub, index) => {
    setValue(
      type === 'toDestination'
        ? `shuttleRoutes.${currentRouteIndex}.toDestinationArrivalTimes.${index}.time`
        : `shuttleRoutes.${currentRouteIndex}.fromDestinationArrivalTimes.${index}.time`,
      hub.arrivalTime,
    );
  });
};
