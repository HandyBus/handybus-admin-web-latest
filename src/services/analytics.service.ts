import {
  DailyCoreMetricsViewEntitySchema,
  DailyExploreMetricsViewEntitySchema,
  DailyFandomActivityMetricsViewEntity,
  DailyFandomSnapshotMetricsViewEntity,
  DailyFirstPurchaseLeadTimeMetricsReadModelSchema,
  DailyGmvMetricsViewEntitySchema,
  DailyRetentionMetricsReadModelSchema,
  DailySignupMetricsViewEntitySchema,
  EventUserStatisticsSchema,
  MonthlyActiveEventsMetricsReadModelSchema,
  MonthlyCoreMetricsViewEntitySchema,
  MonthlyExploreMetricsViewEntitySchema,
  WeeklyCoreMetricsViewEntitySchema,
  WeeklyExploreMetricsViewEntitySchema,
  MonthlyFandomCrossMetricsViewEntity,
} from '@/types/analytics.type';
import { authInstance } from './config';
import { useQuery } from '@tanstack/react-query';

/**
 * Explore 매트릭 조회
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
 * Core 매트릭 조회
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
 * 일별 GMV 매트릭 조회
 */

export const getDailyGmvMetrics = async (
  startDate: string,
  endDate: string,
) => {
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
 * 일별 가입 매트릭 조회
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

/**
 * 일별 첫 구매 리드타임 매트릭 조회
 */

export const getDailyFirstPurchaseLeadTimeMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-first-purchase-lead-time-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyFirstPurchaseLeadTimeMetricsList:
          DailyFirstPurchaseLeadTimeMetricsReadModelSchema.array(),
      },
    },
  );
  return res.dailyFirstPurchaseLeadTimeMetricsList;
};

export const useGetDailyFirstPurchaseLeadTimeMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-first-purchase-lead-time-metrics', startDate, endDate],
    queryFn: () => getDailyFirstPurchaseLeadTimeMetrics(startDate, endDate),
  });
};

/**
 * 월별 활성 행사 수 매트릭 조회
 */

export const getMonthlyActiveEventsMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/monthly-active-events-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        monthlyActiveEventsMetricsList:
          MonthlyActiveEventsMetricsReadModelSchema.array(),
      },
    },
  );
  return res.monthlyActiveEventsMetricsList;
};

export const useGetMonthlyActiveEventsMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['monthly-active-events-metrics', startDate, endDate],
    queryFn: () => getMonthlyActiveEventsMetrics(startDate, endDate),
  });
};

/**
 * 행사별 유저 통계 조회
 */

export const getEventUserStatistics = async (
  eventId: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/event-user-statistics?eventId=${eventId}&endDate=${endDate}`,
    {
      shape: {
        eventUserStatistics: EventUserStatisticsSchema.nullable(),
      },
    },
  );
  return res.eventUserStatistics;
};

export const useGetEventUserStatistics = ({
  eventId,
  endDate,
}: {
  eventId: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['event-user-statistics', eventId, endDate],
    queryFn: () => getEventUserStatistics(eventId, endDate),
  });
};

/**
 * 행사별 리텐션 매트릭 조회
 */

export const getDailyRetentionMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-retention-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyRetentionMetricsList: DailyRetentionMetricsReadModelSchema.array(),
      },
    },
  );
  return res.dailyRetentionMetricsList;
};

export const useGetDailyRetentionMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-retention-metrics', startDate, endDate],
    queryFn: () => getDailyRetentionMetrics(startDate, endDate),
  });
};

/*
 * 일별 팬덤 활동 메트릭 조회
 */

export const getDailyFandomActivityMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-fandom-activity-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyFandomActivityMetricsList:
          DailyFandomActivityMetricsViewEntity.array(),
      },
    },
  );
  return res.dailyFandomActivityMetricsList;
};

export const useGetDailyFandomActivityMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-fandom-activity-metrics', startDate, endDate],
    queryFn: () => getDailyFandomActivityMetrics(startDate, endDate),
  });
};

/*
 * 기간 내 일별 팬덤 스냅샷 메트릭 조회
 */

export const getDailyFandomSnapshotMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/daily-fandom-snapshot-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        dailyFandomSnapshotMetricsList:
          DailyFandomSnapshotMetricsViewEntity.array(),
      },
    },
  );
  return res.dailyFandomSnapshotMetricsList;
};

export const useGetDailyFandomSnapshotMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['daily-fandom-snapshot-metrics', startDate, endDate],
    queryFn: () => getDailyFandomSnapshotMetrics(startDate, endDate),
  });
};

/*
 * 기간 내 월별 팬덤 교차 메트릭 조회
 */

export const getMonthlyFandomCrossMetrics = async (
  startDate: string,
  endDate: string,
) => {
  const res = await authInstance.get(
    `/v1/analytics/admin/monthly-fandom-cross-metrics?startDate=${startDate}&endDate=${endDate}`,
    {
      shape: {
        monthlyFandomCrossMetricsList:
          MonthlyFandomCrossMetricsViewEntity.array(),
      },
    },
  );
  return res.monthlyFandomCrossMetricsList;
};

export const useGetMonthlyFandomCrossMetrics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  return useQuery({
    queryKey: ['monthly-fandom-cross-metrics', startDate, endDate],
    queryFn: () => getMonthlyFandomCrossMetrics(startDate, endDate),
  });
};
