import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { authInstance } from './config';
import { withPagination } from '@/types/common.type';
import {
  AgeRange,
  Gender,
  UserStatsReadModel,
  UsersViewEntitySchema,
} from '@/types/user.type';
import { toSearchParamString } from '@/utils/searchParam.util';
import { ActiveStatus } from '@/types/common.type';
import dayjs from 'dayjs';
import {
  DashboardOptions,
  TotalUserCountsReadModelSchema,
  UserStatsAggregateResponseSchema,
} from '@/types/dashboard.type';

// ----- GET -----

export interface GetUsersOptions {
  name?: string;
  nickname?: string;
  phoneNumber?: string;
  gender?: Gender;
  ageRange?: AgeRange;
  regionId?: string;
  orderBy?: 'nickname'; // orderBy 쿼리 퍼포먼스가 좋지 않기에 기본값으로 사용하는 건 권장하지 않음
  additionalOrderOptions?: 'ASC' | 'DESC'; // orderBy 와 additionalOrderOptions은 항상 함께 전달해야 함
  status?: ActiveStatus;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  marketingConsent?: boolean;
  serviceTermsAgreement?: boolean;
  personalInfoConsent?: boolean;
  onboardingComplete?: boolean;
  paymentComplete?: boolean;
  isConnectedKakao?: boolean;
  isConnectedNaver?: boolean;
  isConnectedApple?: boolean;
}

export interface GetUsersOptionsWithPagination extends GetUsersOptions {
  page: string | undefined;
  limit?: number; // 최대 50, 없으면 전체 조회
}

export const getUsers = async (option?: GetUsersOptionsWithPagination) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users${toSearchParamString({ ...option }, '?')}`,
    {
      shape: withPagination({
        users: UsersViewEntitySchema.array(),
      }),
    },
  );
  return res;
};

export const useGetUsersWithPagination = (
  option?: GetUsersOptionsWithPagination,
) =>
  useInfiniteQuery({
    queryKey: ['user', option],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getUsers({ ...option, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });

export const getUser = async (userId: string) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}`,
    {
      shape: {
        user: UsersViewEntitySchema,
      },
    },
  );
  return res.user;
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });
};

export const getUserStats = async (userId: string) => {
  const res = await authInstance.get(
    `/v1/user-management/admin/users/${userId}/stats`,
    {
      shape: {
        userStats: UserStatsReadModel,
      },
    },
  );
  return res.userStats;
};

export const useGetUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['user', 'stats', userId],
    queryFn: () => getUserStats(userId),
  });
};

export const getTotalUserCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 6,
  intervalDays = 1,
}: Partial<DashboardOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/all/total-counts${toSearchParamString(
      {
        baseDate,
        totalRangeDate,
        intervalDays,
      },
      '?',
    )}`,
    {
      shape: {
        totalUserCounts: TotalUserCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalUserCounts;
};

export const useGetTotalUserCounts = (options?: Partial<DashboardOptions>) => {
  return useQuery({
    queryKey: ['user', 'count', options],
    queryFn: () => getTotalUserCounts(options),
    retry: false,
  });
};

export const getUserStatsAggregate = async () => {
  const res = await authInstance.get(
    '/v2/user-management/admin/users/all/total-aggregate',
    {
      shape: { userStatsAggregate: UserStatsAggregateResponseSchema },
    },
  );
  return res.userStatsAggregate;
};

export const useGetUserStatsAggregate = () => {
  return useQuery({
    queryKey: ['user', 'aggregate'],
    queryFn: () => getUserStatsAggregate(),
    retry: false,
  });
};
