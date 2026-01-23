import {
  DailyCoreMetricsViewEntitySchema,
  DailyExploreMetricsViewEntitySchema,
  DailyGmvMetricsViewEntitySchema,
  DailySignupMetricsViewEntitySchema,
  MonthlyCoreMetricsViewEntitySchema,
  MonthlyExploreMetricsViewEntitySchema,
  WeeklyCoreMetricsViewEntitySchema,
  WeeklyExploreMetricsViewEntitySchema,
} from '@/types/analytics.type';
import { authInstance } from './config';
import { useQuery } from '@tanstack/react-query';

/**
 * Explore Metrics
 */

export const getDailyExploreMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-explore-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyExploreMetricsList: DailyExploreMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.dailyExploreMetricsList;
};

export const useGetDailyExploreMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-explore-metrics', startDate, endDate],
    queryFn: () => getDailyExploreMetrics(startDate, endDate),
  });
};

export const getWeeklyExploreMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/weekly-explore-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        weeklyExploreMetricsList: WeeklyExploreMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.weeklyExploreMetricsList;
};

export const useGetWeeklyExploreMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['weekly-explore-metrics', startDate, endDate],
    queryFn: () => getWeeklyExploreMetrics(startDate, endDate),
  });
};

export const getMonthlyExploreMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/monthly-explore-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        monthlyExploreMetricsList:
          MonthlyExploreMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.monthlyExploreMetricsList;
};

export const useGetMonthlyExploreMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['monthly-explore-metrics', startDate, endDate],
    queryFn: () => getMonthlyExploreMetrics(startDate, endDate),
  });
};

/**
 * Core Metrics
 */

export const getDailyCoreMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-core-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyCoreMetricsList: DailyCoreMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.dailyCoreMetricsList;
};

export const useGetDailyCoreMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-core-metrics', startDate, endDate],
    queryFn: () => getDailyCoreMetrics(startDate, endDate),
  });
};

export const getWeeklyCoreMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/weekly-core-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        weeklyCoreMetricsList: WeeklyCoreMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.weeklyCoreMetricsList;
};

export const useGetWeeklyCoreMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['weekly-core-metrics', startDate, endDate],
    queryFn: () => getWeeklyCoreMetrics(startDate, endDate),
  });
};

export const getMonthlyCoreMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/monthly-core-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        monthlyCoreMetricsList: MonthlyCoreMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.monthlyCoreMetricsList;
};

export const useGetMonthlyCoreMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['monthly-core-metrics', startDate, endDate],
    queryFn: () => getMonthlyCoreMetrics(startDate, endDate),
  });
};

/**
 * Daily GMV Metrics
 */

const getDailyGmvMetrics = async (startDate: string, endDate: string) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-gmv-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyGmvMetricsList: DailyGmvMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.dailyGmvMetricsList;
};

export const useGetDailyGmvMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-gmv-metrics', startDate, endDate],
    queryFn: () => getDailyGmvMetrics(startDate, endDate),
  });
};

/**
 * Daily Signup Metrics
 */

export const getDailySignupMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-signup-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailySignupMetricsList: DailySignupMetricsViewEntitySchema.array(),
      },
    },
  );
  return res.dailySignupMetricsList;
};

export const useGetDailySignupMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-signup-metrics', startDate, endDate],
    queryFn: () => getDailySignupMetrics(startDate, endDate),
  });
};
