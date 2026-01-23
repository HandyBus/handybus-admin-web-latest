import dayjs from 'dayjs';
import { BulkRouteItem } from '../form.type';

/**
 * 행사장행 경유지의 도착 시간을 계산합니다.
 */
export const calculateToDestinationArrivalTime = (
  hubIndex: number,
  totalHubs: number,
  dailyEventDate: string,
  route: BulkRouteItem,
  toDestinationArrivalTime: string | undefined,
): string => {
  const isLastHub = hubIndex === totalHubs - 1;

  // 마지막 hub는 도착지 도착 시간 사용
  if (isLastHub && toDestinationArrivalTime) {
    // HH:mm 형식의 시간을 파싱
    const [hours, minutes] = toDestinationArrivalTime.split(':').map(Number);
    return dayjs(dailyEventDate)
      .set('hour', hours)
      .set('minute', minutes)
      .set('second', 0)
      .set('millisecond', 0)
      .toISOString();
  }

  // 기존 시간을 daily event date에 맞춰 조정
  if (route.toDestinationArrivalTimes[hubIndex]?.time) {
    const existingTime = dayjs(route.toDestinationArrivalTimes[hubIndex].time);
    return dayjs(dailyEventDate)
      .set('hour', existingTime.hour())
      .set('minute', existingTime.minute())
      .set('second', 0)
      .set('millisecond', 0)
      .toISOString();
  }

  return dailyEventDate;
};

/**
 * 귀가행 경유지의 도착 시간을 계산합니다.
 */
export const calculateFromDestinationArrivalTime = (
  hubIndex: number,
  dailyEventDate: string,
  route: BulkRouteItem,
  fromDestinationDepartureTime: string | undefined,
): string => {
  const isFirstHub = hubIndex === 0;

  // 첫 hub는 도착지 출발 시간 사용
  if (isFirstHub && fromDestinationDepartureTime) {
    // HH:mm 형식의 시간을 파싱
    const [hours, minutes] = fromDestinationDepartureTime
      .split(':')
      .map(Number);
    return dayjs(dailyEventDate)
      .set('hour', hours)
      .set('minute', minutes)
      .set('second', 0)
      .set('millisecond', 0)
      .toISOString();
  }

  // 기존 시간을 daily event date에 맞춰 조정
  if (route.fromDestinationArrivalTimes[hubIndex]?.time) {
    const existingTime = dayjs(
      route.fromDestinationArrivalTimes[hubIndex].time,
    );
    const baseDate = dayjs(dailyEventDate);

    const existingHour = existingTime.hour();
    const existingMinute = existingTime.minute();

    // dailyEventDate에 시간을 적용
    let calculatedTime = baseDate
      .set('hour', existingHour)
      .set('minute', existingMinute)
      .set('second', 0)
      .set('millisecond', 0);

    // 출발 시간과 비교하여 자정을 넘어가는지 확인
    if (!isFirstHub && fromDestinationDepartureTime) {
      const [departureHours, departureMinutes] = fromDestinationDepartureTime
        .split(':')
        .map(Number);
      const departureTime = baseDate
        .set('hour', departureHours)
        .set('minute', departureMinutes)
        .set('second', 0)
        .set('millisecond', 0);

      // calculatedTime이 departureTime보다 작으면 다음날로 넘어간 것
      // (예: 출발 23:00, 도착 01:00 -> 01:00 < 23:00이므로 다음날)
      if (calculatedTime.isBefore(departureTime)) {
        calculatedTime = calculatedTime.add(1, 'day');
      }
    }

    return calculatedTime.toISOString();
  }

  return dailyEventDate;
};
