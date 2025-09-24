import { toSearchParamString } from '@/utils/searchParam.util';
import { authInstance } from './config';
import {
  DemandBasedRouteResponseSchema,
  RegionHubClusterNodeSchema,
  ShuttleDemandStatisticsReadModelSchema,
  ShuttleDemandStatus,
  ShuttleDemandsViewEntitySchema,
} from '@/types/demand.type';
import { useQuery } from '@tanstack/react-query';
import {
  DEFAULT_CLUSTER_MIN_COUNT,
  DEFAULT_EPSILON,
  DEFAULT_MAX_DISTANCE,
  DEFAULT_MAX_NODES,
  DEFAULT_MIN_COUNT,
} from '@/constants/common';
import dayjs from 'dayjs';
import {
  DashboardOptions,
  TotalDemandCountsReadModelSchema,
} from '@/types/dashboard.type';
import { withPagination } from '@/types/common.type';

// ----- GET -----

export const getUserDemands = async (
  userId: string,
  params?: { status?: ShuttleDemandStatus },
) => {
  const res = await authInstance.get(
    `/v2/user-management/admin/users/${userId}/demands${toSearchParamString(params, '?')}`,
    {
      shape: {
        shuttleDemands: ShuttleDemandsViewEntitySchema.array(),
      },
    },
  );
  return res.shuttleDemands;
};

export const useGetUserDemands = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId, 'demand'],
    queryFn: () => getUserDemands(userId),
  });
};

export interface GetDemandOptions {
  groupBy:
    | 'EVENT'
    | 'DAILY_EVENT'
    | 'PROVINCE'
    | 'CITY'
    | 'TO_DESTINATION_REGION_HUB'
    | 'FROM_DESTINATION_REGION_HUB';
  provinceFullName?: string;
  provinceShortName?: string;
  cityFullName?: string;
  cityShortName?: string;
  dailyEventId?: string;
  eventId?: string;
}

export const getDemandsStats = async (options?: GetDemandOptions) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/demands/all/stats${toSearchParamString({ ...options }, '?')}`,
    {
      shape: {
        statistics: ShuttleDemandStatisticsReadModelSchema.array(),
      },
    },
  );
  return res.statistics;
};

export const useGetDemandsStats = (options?: GetDemandOptions) => {
  return useQuery({
    queryKey: ['demand', 'stats', options],
    queryFn: () => getDemandsStats(options),
  });
};

export interface RouteTreeOptions {
  clusterMinCount: number;
  minCount: number;
  maxNodes: number;
  maxDistance: number;
  epsilon: number;
}

export interface GetRouteTreeWithDemandsOptions extends RouteTreeOptions {
  provinceFullName?: string;
  provinceShortName?: string;
  cityFullName?: string;
  cityShortName?: string;
  dailyEventId?: string;
  eventId?: string;
}

export const getDemandBasedRouteTree = async ({
  clusterMinCount = DEFAULT_CLUSTER_MIN_COUNT,
  minCount = DEFAULT_MIN_COUNT,
  maxNodes = DEFAULT_MAX_NODES,
  maxDistance = DEFAULT_MAX_DISTANCE,
  epsilon = DEFAULT_EPSILON,
  ...props
}: GetRouteTreeWithDemandsOptions) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/demands/all/tree${toSearchParamString(
      { ...props, clusterMinCount, minCount, maxNodes, maxDistance, epsilon },
      '?',
    )}`,
    {
      shape: {
        routes: DemandBasedRouteResponseSchema.array(),
        clusters: RegionHubClusterNodeSchema.array(),
      },
    },
  );
  return res;
};

export const useGetDemandBasedRouteTree = (
  options?: Partial<GetRouteTreeWithDemandsOptions>,
) => {
  return useQuery({
    queryKey: ['demand', 'route-tree', options],
    queryFn: () =>
      getDemandBasedRouteTree({
        clusterMinCount: DEFAULT_CLUSTER_MIN_COUNT,
        minCount: DEFAULT_MIN_COUNT,
        maxNodes: DEFAULT_MAX_NODES,
        maxDistance: DEFAULT_MAX_DISTANCE,
        epsilon: DEFAULT_EPSILON,
        ...options,
      }),
  });
};

export const getTotalDemandCounts = async ({
  baseDate = dayjs().tz().endOf('day').toISOString(),
  totalRangeDate = 6,
  intervalDays = 1,
  ...options
}: Partial<DashboardOptions> = {}) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/demands/all/total-counts${toSearchParamString(
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
        totalDemandCounts: TotalDemandCountsReadModelSchema.array(),
      },
    },
  );
  return res.totalDemandCounts;
};

export const useGetTotalDemandCounts = (
  options?: Partial<DashboardOptions>,
) => {
  return useQuery({
    queryKey: ['demand', 'count', options],
    queryFn: () => getTotalDemandCounts(options),
  });
};

export interface GetDemandsOptions {
  userId?: string;
  eventId?: string;
  dailyEventId?: string;
  regionId?: string;
  status?: ShuttleDemandStatus;
}

interface GetDemandsOptionsWithPagination extends GetDemandsOptions {
  page: string | undefined;
  limit: number;
}

export const getDemands = async (
  options?: Partial<GetDemandsOptionsWithPagination>,
) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/demands${toSearchParamString(
      { ...options },
      '?',
    )}`,
    {
      shape: withPagination({
        shuttleDemands: ShuttleDemandsViewEntitySchema.array(),
      }),
    },
  );
  return res;
};

export const useGetDemands = (
  options?: Partial<GetDemandsOptionsWithPagination>,
) => {
  return useQuery({
    queryKey: ['demand', options],
    queryFn: () => getDemands(options),
  });
};
