'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomBarChart from '@/components/chart/CustomBarChart';
import { useGetTotalDemandCounts } from '@/services/demand.service';
import { useGetTotalReservationCounts } from '@/services/reservation.service';
import { useGetTotalReviewCounts } from '@/services/review.service';
import { getUserStatsAggregate } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const UserFunnelChart = () => {
  const { data: totalUserCounts, isLoading: isTotalUserCountsLoading } =
    useGetTotalUserCounts();
  const { data: totalDemandCounts, isLoading: isTotalDemandCountsLoading } =
    useGetTotalDemandCounts({
      totalRangeDate: 1,
      useDistinctUserId: true,
    });
  const {
    data: totalReservationCounts,
    isLoading: isTotalReservationCountsLoading,
  } = useGetTotalReservationCounts({
    totalRangeDate: 1,
    useDistinctUserId: true,
  });
  const { data: totalReviewCounts, isLoading: isTotalReviewCountsLoading } =
    useGetTotalReviewCounts({
      totalRangeDate: 1,
      useDistinctUserId: true,
    });

  const funnelData = useMemo(
    () => [
      { name: '전체', value: totalUserCounts?.totalUserCounts ?? 0 },
      {
        name: '수요조사 완료',
        value:
          totalDemandCounts?.[totalDemandCounts.length - 1]
            .cumulativeDemandCount ?? 0,
      },
      {
        name: '예약 완료',
        value:
          totalReservationCounts?.[totalReservationCounts.length - 1]
            .cumulativeReservationCount ?? 0,
      },
      {
        name: '리뷰 작성 완료',
        value:
          totalReviewCounts?.[totalReviewCounts.length - 1]
            .cumulativeReviewCount ?? 0,
      },
    ],
    [
      totalUserCounts,
      totalDemandCounts,
      totalReservationCounts,
      totalReviewCounts,
    ],
  );

  const isLoading =
    isTotalUserCountsLoading ||
    isTotalDemandCountsLoading ||
    isTotalReservationCountsLoading ||
    isTotalReviewCountsLoading;

  return (
    <ChartBox title="유저 참여 현황">
      <CustomBarChart data={funnelData} isLoading={isLoading} />
    </ChartBox>
  );
};

export default UserFunnelChart;

const useGetTotalUserCounts = () => {
  return useQuery({
    queryKey: ['user', 'total-counts'],
    queryFn: async () => {
      const res = await getUserStatsAggregate();
      return {
        totalUserCounts: res.totalUserCount,
        onboardingCompleteUserCounts:
          res.totalUserCount - res.onboardingIncompleteCount,
      };
    },
  });
};
