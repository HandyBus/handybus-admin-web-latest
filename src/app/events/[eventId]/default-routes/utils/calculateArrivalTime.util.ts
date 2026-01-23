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
    const calculatedTime = baseDate
      .set('hour', existingTime.hour())
      .set('minute', existingTime.minute())
      .set('second', 0)
      .set('millisecond', 0);

    // 기존 시간이 dailyEventDate의 다음날인 경우 (예: 오후 11시 출발 -> 다음날 오전 도착)
    // existingTime의 날짜가 baseDate보다 하루 이후인지 확인
    const existingDate = existingTime.startOf('day');
    const baseDateOnly = baseDate.startOf('day');
    const daysDifference = existingDate.diff(baseDateOnly, 'day');

    // 날짜 차이가 있으면 그만큼 더해줌
    if (daysDifference > 0) {
      return calculatedTime.add(daysDifference, 'day').toISOString();
    }

    return calculatedTime.toISOString();
  }

  return dailyEventDate;
};
