import {
  DashboardOptions,
  TotalReviewCountsReadModelSchema,
} from '@/types/dashboard.type';
import dayjs from 'dayjs';
import { authInstance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';
import { useQuery } from '@tanstack/react-query';
import { ReviewsViewEntitySchema } from '@/types/reviews.type';

// ----- GET -----

export const getUserReviews = async (userId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/reviews`,
    {
      shape: {
        reviews: ReviewsViewEntitySchema.array(),
      },
    },
  );
  return res.reviews;
};

export const useGetUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'review'],
    queryFn: () => getUserReviews(userId),
  });
};

export const getTotalReviewCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 6,
  intervalDays = 1,
}: Partial<DashboardOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reviews/all/total-counts${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
      },
      '?',
    )}`,
    {
      shape: {
        totalReviewCounts: TotalReviewCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalReviewCounts;
};

export const useGetTotalReviewCounts = (
  options?: Partial<DashboardOptions>,
) => {
  return useQuery({
    queryKey: ['review', 'count', options],
    queryFn: () => getTotalReviewCounts(options),
  });
};
