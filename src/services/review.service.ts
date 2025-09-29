import {
  DashboardOptions,
  TotalReviewCountsReadModelSchema,
} from '@/types/dashboard.type';
import dayjs from 'dayjs';
import { authInstance, instance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  ReviewStatisticsViewEntityProductSchema,
  ReviewsViewEntityProductSchema,
  ReviewsViewEntitySchema,
} from '@/types/reviews.type';
import { withPagination } from '@/types/common.type';

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
  ...options
}: Partial<DashboardOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/reviews/all/total-counts${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
        ...options,
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

// ----- product api) ------

interface GetReviewsWithPaginationOptions {
  limit: number;
  page?: string;
  eventId?: string;
  userId?: string;
  orderBy?: 'eventName' | 'userNickname' | 'rating';
  additionalOrderOptions?: 'ASC' | 'DESC';
}

export const getReviewsWithPagination = async ({
  limit = 15,
  page,
  eventId,
  orderBy,
  additionalOrderOptions,
}: Partial<GetReviewsWithPaginationOptions> = {}) => {
  const searchParams = toSearchParamString({
    limit,
    page,
    eventId,
    orderBy,
    additionalOrderOptions,
  });
  const res = await instance.get(
    `/v2/shuttle-operation/reviews?${searchParams}`,
    {
      shape: withPagination({
        reviews: ReviewsViewEntityProductSchema.array(),
      }),
    },
  );
  return res;
};

export const useGetReviewsWithPagination = (
  options?: Partial<GetReviewsWithPaginationOptions>,
) =>
  useInfiniteQuery({
    queryKey: ['review', options],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getReviewsWithPagination({ page: pageParam, ...options }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const getReviewStatistics = async () => {
  const res = await instance.get('/v2/shuttle-operation/reviews/all/stats', {
    shape: {
      totalReviewStatistics: ReviewStatisticsViewEntityProductSchema.array(),
    },
  });
  return res.totalReviewStatistics;
};

export const useGetReviewStatistics = () =>
  useQuery({
    queryKey: ['review', 'statistics'],
    queryFn: getReviewStatistics,
  });
