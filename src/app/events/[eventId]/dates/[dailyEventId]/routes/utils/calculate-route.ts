import dayjs from 'dayjs';
import { getEstimatedRoute } from '@/services/kakaomoblility.service';
import {
  roundDownToNearestFiveMinutes,
  roundUpToNearestFiveMinutes,
} from './round-nearest-five-minutes.util';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { CreateShuttleRouteFormValues } from '../new/form.type';

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
 * calculateRoute 는 출발 시간 기준으로 경로를 계산하고 도착 시간을 설정합니다.
 *
 * @param type 경로 계산 방향
 * @param hubsArray 경유지 배열
 * @param setValue
 * @param getValues
 * @return 도착 시간
 */
export const calculateRoute = async (
  type: 'toDestination' | 'fromDestination',
  hubsArray: RouteHubData[],
  setValue: UseFormSetValue<CreateShuttleRouteFormValues>,
  getValues: UseFormGetValues<CreateShuttleRouteFormValues>,
): Promise<string | undefined> => {
  // 필수 데이터 유효성 검사
  const isInvalid = hubsArray.some((hub) => !hub.regionId || !hub.regionHubId);

  if (isInvalid || hubsArray.length < 2 || !hubsArray[0].arrivalTime) {
    alert('모든 경유지의 지역, 정류장, 첫 정류장의 시간이 입력되어야 합니다.');
    return;
  }

  try {
    const origin = `${hubsArray[0].longitude},${hubsArray[0].latitude}`;
    const destination = `${hubsArray[hubsArray.length - 1].longitude},${hubsArray[hubsArray.length - 1].latitude}`;
    const waypoints = hubsArray
      .slice(1, -1)
      .map((hub) => `${hub.longitude},${hub.latitude}`)
      .join('|');
    const departureTime = dayjs(hubsArray[0].arrivalTime)
      .tz('Asia/Seoul')
      .format('YYYYMMDDHHmm'); // kakaomobility api 는 한국시간을 기준으로 받기에 한국시간으로 변환

    const res = await getEstimatedRoute({
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
    hubsArray.forEach((_, index) => {
      if (index === 0) return;

      // 시간 추가 후 바로 5분 단위로 올림 처리
      currentTime = roundUpToNearestFiveMinutes(
        currentTime.add(result[0].sections[index - 1].duration, 'seconds'),
      );

      setValue(
        type === 'toDestination'
          ? `shuttleRouteHubsToDestination.${index}.arrivalTime`
          : `shuttleRouteHubsFromDestination.${index}.arrivalTime`,
        currentTime.toISOString(),
      );
    });

    const destinationArrivalTime = getValues(
      type === 'toDestination'
        ? 'shuttleRouteHubsToDestination'
        : 'shuttleRouteHubsFromDestination',
    );
    return destinationArrivalTime[hubsArray.length - 1].arrivalTime;
  } catch (error) {
    console.error('경로 계산 중 오류 발생:', error);
    alert(
      '경로 계산 중 오류가 발생했습니다.' +
        (error instanceof Error && error.message),
    );
    return;
  }
};

/**
 * calculateRouteBackward 는 도착 시간 기준으로 경로를 계산하고 출발 시간을 설정합니다.
 * api 에서 도착시간을 기준으로 계산해주지 않아, 호출자의 현재 시각을 기준으로 총 소요시간을 계산한뒤,
 * 도착시간에서 총 소요시간을 빼서 실제 출발 시간을 계산합니다.
 *
 * @param type 경로 계산 방향
 * @param hubsArray 경유지 배열
 * @param setValue
 * @return 출발 시간
 */
export const calculateRouteBackward = async (
  type: 'toDestination' | 'fromDestination',
  hubsArray: RouteHubData[],
  setValue: UseFormSetValue<CreateShuttleRouteFormValues>,
): Promise<string | undefined> => {
  // 필수 데이터 유효성 검사
  const isInvalid = hubsArray.some((hub) => !hub.regionId || !hub.regionHubId);

  // 마지막 정류장(도착지)의 시간이 필요
  const lastIndex = hubsArray.length - 1;
  if (isInvalid || hubsArray.length < 2 || !hubsArray[lastIndex].arrivalTime) {
    alert('모든 경유지의 지역, 정류장, 도착지의 시간이 입력되어야 합니다.');
    return;
  }

  try {
    // 1. 임의의 출발 시간으로 API 호출하여 소요 시간 정보 확보
    const origin = `${hubsArray[0].longitude},${hubsArray[0].latitude}`;
    const destination = `${hubsArray[lastIndex].longitude},${hubsArray[lastIndex].latitude}`;
    const waypoints = hubsArray
      .slice(1, -1)
      .map((hub) => `${hub.longitude},${hub.latitude}`)
      .join('|');

    // 임의의 출발 시간
    const tempDepartureTime = dayjs().format('YYYYMMDDHHmm'); // kakaomobility api 는 한국시간을 기준으로 받기에 한국시간으로 변환

    const res = await getEstimatedRoute({
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
    const arrivalTime = dayjs(hubsArray[lastIndex].arrivalTime).tz(
      'Asia/Seoul',
    );
    const actualDepartureTime = arrivalTime.subtract(totalDuration, 'second');

    const roundedActualDepartureTime =
      roundDownToNearestFiveMinutes(actualDepartureTime);

    // 3. 출발 시간 설정
    setValue(
      type === 'toDestination'
        ? `shuttleRouteHubsToDestination.0.arrivalTime`
        : `shuttleRouteHubsFromDestination.0.arrivalTime`,
      roundedActualDepartureTime.toISOString(),
    );

    // 4. 각 경유지 시간 계산
    let currentTime = actualDepartureTime;
    for (let i = 1; i < hubsArray.length; i++) {
      if (i < result.sections.length) {
        // 시간 추가 후 바로 5분 단위로 올림 처리
        currentTime = roundUpToNearestFiveMinutes(
          currentTime.add(result.sections[i - 1].duration, 'second'),
        );

        // 중간 경유지 시간 설정 (마지막은 이미 설정되어 있음)
        if (i < lastIndex) {
          setValue(
            type === 'toDestination'
              ? `shuttleRouteHubsToDestination.${i}.arrivalTime`
              : `shuttleRouteHubsFromDestination.${i}.arrivalTime`,
            currentTime.toISOString(),
          );
        }
      }
    }

    return roundedActualDepartureTime.toISOString();
  } catch (error) {
    console.error('경로 계산 중 오류 발생:', error);
    alert(
      '경로 계산 중 오류가 발생했습니다.' +
        (error instanceof Error && error.message),
    );
    return;
  }
};

/**
 * calculateUnion 는 출발시간과 도착시간을 모두 고려하여 경로를 계산합니다.
 * calculateRouteBackward와 calculateRoute를 순차적으로 호출하여 경로 소요시간을 계산합니다.
 * 설정한 도착시간과 10분이상 차이나게되면 출발시간을 시간 차 만큼 보상하여 경로를 재계산합니다.
 *
 * @param getValues
 * @param setValue
 * @return void
 */
export const calculateUnion = async (
  getValues: UseFormGetValues<CreateShuttleRouteFormValues>,
  setValue: UseFormSetValue<CreateShuttleRouteFormValues>,
): Promise<void> => {
  const hubsArray = getValues('shuttleRouteHubsToDestination');
  const plannedArrivalTime = hubsArray[hubsArray.length - 1].arrivalTime;

  try {
    // 1. 도착 시간 기준으로 출발 시간 계산
    const estimatedDepartureTime = await calculateRouteBackward(
      'toDestination',
      hubsArray,
      setValue,
    );

    // 2. 출발 시간 기준으로 도착 시간 계산
    const estimatedDestinationArrivalTime = await calculateRoute(
      'toDestination',
      hubsArray,
      setValue,
      getValues,
    );

    if (!estimatedDepartureTime || !estimatedDestinationArrivalTime) {
      throw new Error(
        '경로 계산에 필요한 시간 정보가 누락되었습니다. 각 정류장의 위치와 시간을 다시 확인해주세요.',
      );
    }

    // 3. 예상 도착 시간과 계획된 도착 시간 비교
    const diff = dayjs(estimatedDestinationArrivalTime).diff(
      estimatedDepartureTime,
      'minute',
    );

    if (diff >= 10) {
      const arrivalTimeDifference = dayjs(plannedArrivalTime).diff(
        estimatedDestinationArrivalTime,
        'minute',
      );
      setValue(
        'shuttleRouteHubsToDestination.0.arrivalTime',
        dayjs(getValues('shuttleRouteHubsToDestination.0.arrivalTime'))
          .add(arrivalTimeDifference, 'minute')
          .toISOString(),
      );
      await calculateRoute(
        'toDestination',
        getValues('shuttleRouteHubsToDestination'),
        setValue,
        getValues,
      );
    }
  } catch (error) {
    console.error('경로 계산 통합 중 오류 발생:', error);
    alert(
      `경로 계산 통합 중 오류가 발생했습니다: ${error instanceof Error && error.message}`,
    );
  }
};
