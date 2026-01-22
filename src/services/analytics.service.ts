import {
  DailyGmvMetricsViewEntitySchema,
  DailySignupMetricsViewEntitySchema,
} from '@/types/analytics.type';
import { authInstance } from './config';
import { useQuery } from '@tanstack/react-query';

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
