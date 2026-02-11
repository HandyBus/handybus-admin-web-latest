import { useMemo } from 'react';
import { useGetReservationsWithPagination } from '@/services/reservation.service';
import {
  aggregateReservationsByDate,
  convertToChartData,
} from '../utils/reservation-chart.util';
import type { ChartDataItem } from '../utils/reservation-chart.util';

interface UseReservationChartDataParams {
  eventId?: string;
  dailyEventId?: string;
}

interface UseReservationChartDataReturn {
  chartDataList: ChartDataItem[];
  isLoading: boolean;
}

/**
 * 이벤트/일자별 행사의 예약 데이터를 조회하고 차트 데이터로 변환하는 커스텀 훅
 *
 * 전체 예약과 취소 예약을 별도로 조회한 후 일자별로 집계하여 차트 데이터를 생성합니다.
 * API가 기본적으로 전체 데이터를 반환하므로 페이지네이션 처리 없이 한 번에 데이터를 가져옵니다.
 */
export const useReservationChartData = ({
  eventId,
  dailyEventId,
}: UseReservationChartDataParams): UseReservationChartDataReturn => {
  const isEnabled = Boolean(eventId && dailyEventId);

  // 전체 예약 데이터 조회
  const { data: allReservationData, isLoading: isLoadingAll } =
    useGetReservationsWithPagination(
      isEnabled
        ? {
            eventId,
            dailyEventId,
          }
        : undefined,
    );

  // 취소 예약 데이터 조회
  const { data: cancelReservationData, isLoading: isLoadingCancel } =
    useGetReservationsWithPagination(
      isEnabled
        ? {
            eventId,
            dailyEventId,
            cancelStatus: 'CANCEL_COMPLETE',
          }
        : undefined,
    );

  const isLoading = isLoadingAll || isLoadingCancel;

  // 차트 데이터 생성
  const chartDataList = useMemo(() => {
    if (!isEnabled) return [];

    const allPages = allReservationData?.pages ?? [];
    const cancelPages = cancelReservationData?.pages ?? [];

    const allCountMap = aggregateReservationsByDate(allPages);
    const cancelCountMap = aggregateReservationsByDate(cancelPages);

    return convertToChartData(allCountMap, cancelCountMap);
  }, [isEnabled, allReservationData, cancelReservationData]);

  return {
    chartDataList,
    isLoading,
  };
};
