'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomBarChart from '@/components/chart/CustomBarChart';
import { useGetTotalDemandCounts } from '@/services/demand.service';
import { useGetTotalReservationCounts } from '@/services/reservation.service';
import { useGetTotalReviewCounts } from '@/services/review.service';
import {
  getUserStatsAggregate,
  useGetTotalUserCounts,
} from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const UserFunnelChart = () => {
  const { data: totalUserCounts, isLoading: isTotalUserCountsLoading } =
    useGetTotalUserCounts({
      useDistinctUserId: true,
    });
  const { data: totalOnboardedUsers, isLoading: isTotalOnboardedUsersLoading } =
    useGetOnboardedUsers();
  const { data: totalDemandCounts, isLoading: isTotalDemandCountsLoading } =
    useGetTotalDemandCounts({
      useDistinctUserId: true,
    });
  const {
    data: totalReservationCounts,
    isLoading: isTotalReservationCountsLoading,
  } = useGetTotalReservationCounts({
    useDistinctUserId: true,
  });
  const { data: totalReviewCounts, isLoading: isTotalReviewCountsLoading } =
    useGetTotalReviewCounts({
      useDistinctUserId: true,
    });

  const funnelData = useMemo(
    () => [
      { name: '전체', value: totalUserCounts?.[0].cumulativeUserCount ?? 0 },
      {
        name: '온보딩 완료',
        value: totalOnboardedUsers ?? 0,
      },
      {
        name: '수요조사 완료',
        value: totalDemandCounts?.[0].cumulativeDemandCount ?? 0,
      },
      {
        name: '예약 완료',
        value: totalReservationCounts?.[0].cumulativeReservationCount ?? 0,
      },
      {
        name: '리뷰 작성 완료',
        value: totalReviewCounts?.[0].cumulativeReviewCount ?? 0,
      },
    ],
    [
      totalUserCounts,
      totalOnboardedUsers,
      totalDemandCounts,
      totalReservationCounts,
      totalReviewCounts,
    ],
  );

  const isLoading =
    isTotalUserCountsLoading ||
    isTotalOnboardedUsersLoading ||
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

const useGetOnboardedUsers = () => {
  return useQuery({
    queryKey: ['user', 'onboarded'],
    queryFn: async () => {
      const res = await getUserStatsAggregate();
      return res.totalUserCount - res.onboardingIncompleteCount;
    },
  });
};
