import dayjs from 'dayjs';
import { getEstimatedRoute } from '@/services/kakaomoblility.service';
import {
  roundDownToNearestFiveMinutes,
  roundUpToNearestFiveMinutes,
} from '../components/roundNearestFiveMinutes';
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
 * 출발 시간 기준으로 경로를 계산하고 도착 시간을 설정합니다.
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
      .format('YYYYMMDDHHmm');

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

    alert(
      `출발시간 기준 경로 계산이 완료되었습니다.\n출발시간 : ${dayjs(hubsArray[0].arrivalTime).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')}\n총 소요시간 : ${Math.floor(result[0].duration / 60)}분\n총 거리 : ${result[0].distance}m
      ${hubsArray.map((_, index) => {
        if (index === 0) return '\n경유지 별 소요시간';
        return `\n${index}번째 경유지 : ${Math.floor(
          result[0].sections[index - 1].duration / 60,
        )}분`;
      })}`,
    );

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
 * 도착 시간 기준으로 경로를 계산하고 출발 시간을 설정합니다.
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
    const tempDepartureTime = dayjs().format('YYYYMMDDHHmm');

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

    alert(
      `도착시간 기준 경로 계산이 완료되었습니다.\n출발 시간이 ${roundedActualDepartureTime.format('HH:mm')}로 설정되었습니다.\n` +
        `총 소요시간: ${Math.floor(totalDuration / 60)}분\n총 거리: ${result.summary.distance}m
        ${hubsArray.map((_, index) => {
          if (index === 0) return '\n경유지 별 소요시간';
          return `\n${index}번째 경유지 : ${Math.floor(
            result.sections[index - 1].duration / 60,
          )}분`;
        })}`,
    );

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
 * 출발시간과 도착시간을 모두 고려하여 경로를 계산합니다.
 */
export const calculateUnion = async (
  getValues: UseFormGetValues<CreateShuttleRouteFormValues>,
  setValue: UseFormSetValue<CreateShuttleRouteFormValues>,
): Promise<void> => {
  const hubsArray = getValues('shuttleRouteHubsToDestination');
  const plannedArrivalTime = hubsArray[hubsArray.length - 1].arrivalTime;

  alert('도착시간 기준 경로를 계산합니다. 재조정이 있을 수 있습니다.');

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
      return;
    }

    // 3. 예상 도착 시간과 계획된 도착 시간 비교
    const diff = dayjs(estimatedDestinationArrivalTime).diff(
      estimatedDepartureTime,
      'minute',
    );

    if (diff >= 10) {
      alert('예상 도착시간이 10분 이상 벗어나 재조정합니다');
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
