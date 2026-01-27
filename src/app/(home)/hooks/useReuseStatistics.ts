import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useGetEventUserStatistics } from '@/services/analytics.service';
import { EventsViewEntity } from '@/types/event.type';
import { ChartData } from '../components/ReuseChart';
import { CardStats } from '../components/ReuseStatsCards';

interface UseReuseStatisticsReturn {
  isLoadingStats: boolean;
  chartData: ChartData[];
  cardStats: CardStats | null;
}

const COLORS = ['#6366f1', '#e5e7eb'];

/**
 * 재구매율 통계 데이터를 관리하는 커스텀 훅
 * @param selectedEvent 선택된 행사
 */
export const useReuseStatistics = (
  selectedEvent: EventsViewEntity | null,
): UseReuseStatisticsReturn => {
  // 3. 통계 조회를 위한 날짜 설정 (오늘 날짜)
  const endDate = dayjs().format('YYYY-MM-DD');

  // 4. 통계 데이터 조회
  const { data: stats, isLoading: isLoadingStats } = useGetEventUserStatistics({
    eventId: selectedEvent?.eventId ?? '',
    endDate,
  });

  // 5. 데이터 가공 (ChartData)
  const chartData: ChartData[] = useMemo(() => {
    if (!stats) return [];

    // 재이용 통계 계산 (총합 - 첫이용)
    const reuseParticipation =
      stats.totalParticipationUserCount - stats.firstParticipationUserCount;
    const reuseReservation =
      stats.totalReservationUserCount - stats.firstReservationUserCount;
    const reuseDemand = stats.totalDemandUserCount - stats.firstDemandUserCount;

    // 참가자 수 기준 퍼센트 계산
    const totalParticipation = stats.totalParticipationUserCount;
    const firstPercentage =
      totalParticipation > 0
        ? Math.round(
            (stats.firstParticipationUserCount / totalParticipation) * 100,
          )
        : 0;
    const reusePercentage = totalParticipation > 0 ? 100 - firstPercentage : 0; // 합계 100% 보장

    return [
      {
        name: '첫이용',
        value: stats.firstParticipationUserCount,
        displayValue: firstPercentage,
        participation: stats.firstParticipationUserCount,
        reservation: stats.firstReservationUserCount,
        demand: stats.firstDemandUserCount,
        color: COLORS[0],
      },
      {
        name: '재이용',
        value: reuseParticipation,
        displayValue: reusePercentage,
        participation: reuseParticipation,
        reservation: reuseReservation,
        demand: reuseDemand,
        color: COLORS[1],
      },
    ];
  }, [stats]);

  // 6. 데이터 가공 (CardStats)
  const cardStats: CardStats | null = useMemo(() => {
    if (!stats || chartData.length < 2) return null;
    const firstData = chartData[0]; // 첫이용
    const reuseData = chartData[1]; // 재이용

    return {
      first: {
        percentage: firstData.displayValue,
        count: firstData.participation,
      },
      reuse: {
        percentage: reuseData.displayValue,
        count: reuseData.participation,
      },
      total: stats.totalParticipationUserCount,
    };
  }, [stats, chartData]);

  return {
    isLoadingStats,
    chartData,
    cardStats,
  };
};
