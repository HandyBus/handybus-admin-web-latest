import { z } from 'zod';

/**
 * Daily Active Users Explore
 */

export const DailyExploreMetricsByEventInDailyExploreMetricsViewEntitySchema =
  z.object({
    eventId: z.string().describe('행사 ID'),
    pageReachUserCount: z
      .number()
      .describe(
        '페이지 조회 사용자 수 (Page Reach Users): 당일 해당 이벤트 상세(/event/{id})를 1회 이상 조회한 고유 사용자 수',
      ),
    eventDetailPageViewCount: z.number().describe('행사 상세 페이지 조회 수'),
  });

export type DailyExploreMetricsByEventInDailyExploreMetricsViewEntity = z.infer<
  typeof DailyExploreMetricsByEventInDailyExploreMetricsViewEntitySchema
>;

export const DailyExploreMetricsViewEntitySchema = z.object({
  date: z.string().describe('비즈니스 기준 날짜 (Asia/Seoul)'),
  pageReachUserCount: z
    .number()
    .describe(
      '페이지 조회 사용자 수 (Page Reach Users): 당일 어떤 이벤트 상세(/event/*)든 1회 이상 조회한 고유 사용자 수',
    ),
  eventDetailPageViewCount: z.number().describe('행사 상세 페이지 조회 수'),
  dailyExploreMetricsByEvent: z
    .array(DailyExploreMetricsByEventInDailyExploreMetricsViewEntitySchema)
    .nullable()
    .describe('행사별 탐색 메트릭'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type DailyExploreMetricsViewEntity = z.infer<
  typeof DailyExploreMetricsViewEntitySchema
>;

/**
 * Weekly Active Users Explore
 */

export const WeeklyExploreMetricsByEventInWeeklyExploreMetricsViewEntitySchema =
  z.object({
    eventId: z.string().describe('행사 ID'),
    pageReachUserCount: z
      .number()
      .describe(
        '페이지 조회 사용자 수 (Page Reach Users): 해당 주 해당 이벤트 상세(/event/{id})를 1회 이상 조회한 고유 사용자 수',
      ),
    eventDetailPageViewCount: z.number().describe('행사 상세 페이지 조회 수'),
  });

export type WeeklyExploreMetricsByEventInWeeklyExploreMetricsViewEntity =
  z.infer<
    typeof WeeklyExploreMetricsByEventInWeeklyExploreMetricsViewEntitySchema
  >;

export const WeeklyExploreMetricsViewEntitySchema = z.object({
  week: z
    .string()
    .describe('비즈니스 기준 주 (해당 주의 첫 번째 날(월요일), Asia/Seoul)'),
  pageReachUserCount: z
    .number()
    .describe(
      '페이지 조회 사용자 수 (Page Reach Users): 해당 주 어떤 이벤트 상세(/event/*)든 1회 이상 조회한 고유 사용자 수',
    ),
  eventDetailPageViewCount: z.number().describe('행사 상세 페이지 조회 수'),
  weeklyExploreMetricsByEvent: z
    .array(WeeklyExploreMetricsByEventInWeeklyExploreMetricsViewEntitySchema)
    .nullable()
    .describe('행사별 탐색 메트릭'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type WeeklyExploreMetricsViewEntity = z.infer<
  typeof WeeklyExploreMetricsViewEntitySchema
>;

/**
 * Monthly Active Users Explore
 */

export const MonthlyExploreMetricsByEventInMonthlyExploreMetricsViewEntitySchema =
  z.object({
    eventId: z.string().describe('행사 ID'),
    pageReachUserCount: z
      .number()
      .describe(
        '페이지 조회 사용자 수 (Page Reach Users): 해당 월 해당 이벤트 상세(/event/{id})를 1회 이상 조회한 고유 사용자 수',
      ),
    eventDetailPageViewCount: z.number().describe('행사 상세 페이지 조회 수'),
  });

export type MonthlyExploreMetricsByEventInMonthlyExploreMetricsViewEntity =
  z.infer<
    typeof MonthlyExploreMetricsByEventInMonthlyExploreMetricsViewEntitySchema
  >;

export const MonthlyExploreMetricsViewEntitySchema = z.object({
  month: z
    .string()
    .describe('비즈니스 기준 월 (해당 월의 첫 번째 날, Asia/Seoul)'),
  pageReachUserCount: z
    .number()
    .describe(
      '페이지 조회 사용자 수 (Page Reach Users): 해당 월 어떤 이벤트 상세(/event/*)든 1회 이상 조회한 고유 사용자 수',
    ),
  eventDetailPageViewCount: z.number().describe('행사 상세 페이지 조회 수'),
  monthlyExploreMetricsByEvent: z
    .array(MonthlyExploreMetricsByEventInMonthlyExploreMetricsViewEntitySchema)
    .nullable()
    .describe('행사별 탐색 메트릭'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type MonthlyExploreMetricsViewEntity = z.infer<
  typeof MonthlyExploreMetricsViewEntitySchema
>;

/**
 * Daily Active Users Core
 */

export const DailyCoreMetricsByEventInDailyCoreMetricsViewEntitySchema =
  z.object({
    eventId: z.string().describe('행사 ID'),
    participationUserCount: z
      .number()
      .describe('참여 유저 수 (수요조사 또는 예약 유저 수)'),
    reservationUserCount: z.number().describe('예약 유저 수'),
    demandUserCount: z.number().describe('수요조사 유저 수'),
  });

export type DailyCoreMetricsByEventInDailyCoreMetricsViewEntity = z.infer<
  typeof DailyCoreMetricsByEventInDailyCoreMetricsViewEntitySchema
>;

export const DailyCoreMetricsViewEntitySchema = z.object({
  date: z.string().describe('비즈니스 기준 날짜 (Asia/Seoul)'),
  participationUserCount: z
    .number()
    .describe('참여 유저 수 (수요조사 또는 예약 유저 수)'),
  reservationUserCount: z.number().describe('예약 유저 수'),
  demandUserCount: z.number().describe('수요조사 유저 수'),
  firstParticipationUserCount: z.number().describe('해당 일자 첫 참여 유저 수'),
  firstReservationUserCount: z.number().describe('해당 일자 첫 예약 유저 수'),
  firstDemandUserCount: z.number().describe('해당 일자 첫 수요조사 유저 수'),
  dailyCoreMetricsByEvent: z
    .array(DailyCoreMetricsByEventInDailyCoreMetricsViewEntitySchema)
    .nullable()
    .describe('행사별 Core 메트릭'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type DailyCoreMetricsViewEntity = z.infer<
  typeof DailyCoreMetricsViewEntitySchema
>;

/**
 * Weekly Active Users Core
 */

export const WeeklyCoreMetricsByEventInWeeklyCoreMetricsViewEntitySchema =
  z.object({
    eventId: z.string().describe('행사 ID'),
    participationUserCount: z
      .number()
      .describe('참여 유저 수 (수요조사 또는 예약 유저 수)'),
    reservationUserCount: z.number().describe('예약 유저 수'),
    demandUserCount: z.number().describe('수요조사 유저 수'),
  });

export type WeeklyCoreMetricsByEventInWeeklyCoreMetricsViewEntity = z.infer<
  typeof WeeklyCoreMetricsByEventInWeeklyCoreMetricsViewEntitySchema
>;

export const WeeklyCoreMetricsViewEntitySchema = z.object({
  week: z
    .string()
    .describe('비즈니스 기준 주 (해당 주의 첫 번째 날(월요일), Asia/Seoul)'),
  participationUserCount: z
    .number()
    .describe('참여 유저 수 (수요조사 또는 예약 유저 수)'),
  reservationUserCount: z.number().describe('예약 유저 수'),
  demandUserCount: z.number().describe('수요조사 유저 수'),
  weeklyCoreMetricsByEvent: z
    .array(WeeklyCoreMetricsByEventInWeeklyCoreMetricsViewEntitySchema)
    .nullable()
    .describe('행사별 Core 메트릭'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type WeeklyCoreMetricsViewEntity = z.infer<
  typeof WeeklyCoreMetricsViewEntitySchema
>;

/*
 * Monthly Active Users Core
 */

export const MonthlyCoreMetricsByEventInMonthlyCoreMetricsViewEntitySchema =
  z.object({
    eventId: z.string().describe('행사 ID'),
    participationUserCount: z
      .number()
      .describe('참여 유저 수 (수요조사 또는 예약 유저 수)'),
    reservationUserCount: z.number().describe('예약 유저 수'),
    demandUserCount: z.number().describe('수요조사 유저 수'),
  });

export type MonthlyCoreMetricsByEventInMonthlyCoreMetricsViewEntity = z.infer<
  typeof MonthlyCoreMetricsByEventInMonthlyCoreMetricsViewEntitySchema
>;

export const MonthlyCoreMetricsViewEntitySchema = z.object({
  month: z
    .string()
    .describe('비즈니스 기준 월 (해당 월의 첫 번째 날, Asia/Seoul)'),
  participationUserCount: z
    .number()
    .describe('참여 유저 수 (수요조사 또는 예약 유저 수)'),
  reservationUserCount: z.number().describe('예약 유저 수'),
  demandUserCount: z.number().describe('수요조사 유저 수'),
  monthlyCoreMetricsByEvent: z
    .array(MonthlyCoreMetricsByEventInMonthlyCoreMetricsViewEntitySchema)
    .nullable()
    .describe('행사별 Core 메트릭'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type MonthlyCoreMetricsViewEntity = z.infer<
  typeof MonthlyCoreMetricsViewEntitySchema
>;

/**
 * GMV
 */

export const DailyGmvMetricsViewEntitySchema = z.object({
  date: z.string().describe('비즈니스 기준 날짜 (Asia/Seoul)'),
  gmvAmount: z.number().describe('GMV (결제 금액 합)'),
  gmvPaymentCount: z.number().describe('GMV 결제 건수'),
  gmvUserCount: z.number().describe('GMV 결제 유저 수'),
  firstPurchaseGmvAmount: z
    .number()
    .describe('첫 결제 유저 기준 GMV (결제 금액 합)'),
  firstPurchaseGmvUserCount: z
    .number()
    .describe('첫 결제 유저 수 (첫 결제 유저 수 = 첫 결제 건수)'),
  cumulativeGmvAmount: z.number().describe('누적 GMV (결제 금액 합)'),
  cumulativeGmvPaymentCount: z.number().describe('누적 GMV 결제 건수'),
  cumulativeFirstPurchaseGmvAmount: z
    .number()
    .describe('누적 첫 결제 유저 기준 GMV (결제 금액 합)'),
  cumulativeFirstPurchaseGmvUserCount: z
    .number()
    .describe('누적 첫 결제 유저 수'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type DailyGmvMetricsViewEntity = z.infer<
  typeof DailyGmvMetricsViewEntitySchema
>;

/**
 * 신규 가입자 수
 */

export const DailySignupMetricsViewEntitySchema = z.object({
  date: z.string().describe('비즈니스 기준 날짜 (Asia/Seoul)'),
  newUserCount: z.number().describe('신규 가입자 수'),
  firstPurchaseOnSignupDayUserCount: z
    .number()
    .describe('해당 일자에 가입 후 당일 첫 결제까지 완료한 유저 수'),
  cumulativeNewUserCount: z.number().describe('누적 신규 가입자 수'),
  cumulativeFirstPurchaseOnSignupDayUserCount: z
    .number()
    .describe('누적 해당 일자에 가입 후 당일 첫 결제까지 완료한 유저 수'),
  createdAt: z.string().describe('생성 일자'),
  updatedAt: z.string().describe('수정 일자'),
});

export type DailySignupMetricsViewEntity = z.infer<
  typeof DailySignupMetricsViewEntitySchema
>;

/**
 * 기간 내 일별 첫 구매 리드타임 메트릭
 */
export const DailyFirstPurchaseLeadTimeMetricsReadModelSchema = z.object({
  date: z.string().describe('비즈니스 기준 날짜 (Asia/Seoul, YYYY-MM-DD)'),
  averageUserTimeToFirstPurchaseHours: z
    .number()
    .describe(
      '첫 구매까지 평균 소요 시간 (hour, 소수점 1자리 반올림, 가입시점=구매시점이면 0.0)',
    ),
});

export type DailyFirstPurchaseLeadTimeMetricsReadModel = z.infer<
  typeof DailyFirstPurchaseLeadTimeMetricsReadModelSchema
>;

/**
 * 기간 내 월별 Active events 메트릭 목록
 */

export const MonthlyActiveEventsMetricsReadModelSchema = z.object({
  month: z
    .string()
    .describe(
      '비즈니스 기준 월 (해당 월의 첫 번째 날, YYYY-MM-DD, Asia/Seoul)',
    ),
  activeEventCount: z
    .number()
    .describe('Active events 수 (해당 월 실제 운행한 행사 수)'),
});

/**
 * 행사별 유저 통계 조회
 */

export const EventUserStatisticsSchema = z.object({
  eventId: z.string().describe('행사 ID'),
  firstParticipationUserCount: z.number().describe('첫 참여 유저 수'),
  firstReservationUserCount: z.number().describe('첫 예약 유저 수'),
  firstDemandUserCount: z.number().describe('첫 수요조사 유저 수'),
  totalParticipationUserCount: z.number().describe('총 참여 유저 수'),
  totalReservationUserCount: z.number().describe('총 예약 유저 수'),
  totalDemandUserCount: z.number().describe('총 수요조사 유저 수'),
});

export type EventUserStatistics = z.infer<typeof EventUserStatisticsSchema>;

/**
 * 기간 내 일별 리텐션 메트릭 목록
 */
export const DailyRetentionMetricsReadModelSchema = z.object({
  date: z.string().describe('비즈니스 기준 날짜 (Asia/Seoul, YYYY-MM-DD)'),
  eventReparticipationUserCount: z
    .number()
    .describe(
      '행사 재참여 유저 수 (과거 참여 이력이 있는 유저 중 해당 일자에 참여한 유저 수)',
    ),
  cumulativeEventReparticipationUserCount: z
    .number()
    .describe('누적 행사 재참여 유저 수'),
  eventRebookingUserCount: z
    .number()
    .describe(
      '행사 재예약 유저 수 (과거 예약 이력이 있는 유저 중 해당 일자에 예약한 유저 수)',
    ),
  cumulativeEventRebookingUserCount: z
    .number()
    .describe('누적 행사 재예약 유저 수'),
  averageUserEventReparticipationHours: z
    .number()
    .describe('행사 재참여주기 평균 시간 (hour, 소수점 1자리 반올림)'),
  averageUserEventRebookingHours: z
    .number()
    .describe('행사 재예약주기 평균 시간 (hour, 소수점 1자리 반올림)'),
  averageUserReboardingDays: z.number().describe('재탑승주기 평균 일수'),
});

export type DailyRetentionMetricsReadModel = z.infer<
  typeof DailyRetentionMetricsReadModelSchema
>;
