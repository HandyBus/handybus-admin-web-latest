import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/** 차트 데이터 타입 */
export interface ChartDataItem {
  date: string;
  reservationCount: number;
  cancelCount: number;
}

/** 이벤트 메타데이터에 저장되는 예매일 정보 */
export interface EventSaleDateMetadata {
  preSaleDate?: string | null;
  generalSaleDate?: string | null;
}

/** 예약 페이지 데이터 타입 */
export interface ReservationPage {
  reservations: {
    createdAt: string;
  }[];
}

/** 차트 색상 상수 */
export const STROKE_COLORS = {
  reservation: '#6366f1',
  cancel: '#f59e0b',
} as const;

/** Reference Line 색상 상수 */
export const REFERENCE_LINE_COLORS = {
  preSale: '#ef4444',
  generalSale: '#22c55e',
} as const;

/**
 * 예약 데이터를 createdAt 기준 일자별로 집계
 * @param reservationPageList - 예약 페이지 리스트
 * @returns 날짜별 예약 카운트 맵
 */
export const aggregateReservationsByDate = (
  reservationPageList: ReservationPage[],
): Map<string, number> => {
  const dateCountMap = new Map<string, number>();

  for (const page of reservationPageList) {
    for (const reservation of page.reservations) {
      const dateKey = dayjs(reservation.createdAt)
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD');
      dateCountMap.set(dateKey, (dateCountMap.get(dateKey) ?? 0) + 1);
    }
  }

  return dateCountMap;
};

/**
 * 예약 카운트 맵을 차트 데이터로 변환
 * @param allCountMap - 전체 예약 카운트 맵
 * @param cancelCountMap - 취소 예약 카운트 맵
 * @returns 차트 데이터 배열 (날짜 순 정렬)
 */
export const convertToChartData = (
  allCountMap: Map<string, number>,
  cancelCountMap: Map<string, number>,
): ChartDataItem[] => {
  // 모든 날짜 합치기
  const allDateSet = new Set<string>([
    ...allCountMap.keys(),
    ...cancelCountMap.keys(),
  ]);

  const sortedDateList = [...allDateSet].sort();

  return sortedDateList.map((date) => ({
    date: dayjs(date).format('MM.DD'),
    reservationCount: allCountMap.get(date) ?? 0,
    cancelCount: cancelCountMap.get(date) ?? 0,
  }));
};

/**
 * 날짜를 MM.DD 포맷으로 변환
 * @param date - ISO 날짜 문자열
 * @returns MM.DD 포맷 문자열 또는 null
 */
export const formatDateToMMDD = (date: string | null): string | null => {
  if (!date) return null;
  return dayjs(date).tz('Asia/Seoul').format('MM.DD');
};
