import { z } from 'zod';
import { AgeRangeEnum, GenderEnum } from './user.type';

export interface DashboardOptions {
  baseDate: string; // 기준일자
  totalRangeDate: number; // 기준일자로부터 몇일 전까지 조회 할 지 (예: 6이면 기준 일 포함 총 7일)
  intervalDays: number; // 집계 간격 (일 단위)
  useDistinctUserId?: boolean; // 집계 시 유저의 중복된 예약 제외 여부 (미전달시 false)
}

export const TotalUserCountsReadModelSchema = z.object({
  date: z.string(),
  intervalUserCount: z.number(),
  cumulativeUserCount: z.number(),
});
export type TotalUserCountsReadModel = z.infer<
  typeof TotalUserCountsReadModelSchema
>;

export const TotalDemandCountsReadModelSchema = z.object({
  date: z.string(),
  intervalDemandCount: z.number(),
  cumulativeDemandCount: z.number(),
});
export type TotalDemandCountsReadModel = z.infer<
  typeof TotalDemandCountsReadModelSchema
>;

export const TotalReservationPassengerCountsReadModelSchema = z.object({
  date: z.string(),
  intervalReservationPassengerCount: z.number(),
  cumulativeReservationPassengerCount: z.number(),
});
export type TotalReservationPassengerCountsReadModel = z.infer<
  typeof TotalReservationPassengerCountsReadModelSchema
>;

export const TotalReservationCountsReadModelSchema = z.object({
  date: z.string(),
  intervalReservationCount: z.number(),
  cumulativeReservationCount: z.number(),
});
export type TotalReservationCountsReadModel = z.infer<
  typeof TotalReservationCountsReadModelSchema
>;

export const TotalSalesCountsReadModelSchema = z.object({
  date: z.string(),
  dailyGrossSales: z.number(), // 총 판매액
  cumulativeGrossSales: z.number(),
  dailyDiscountedSales: z.number(), // 할인 이후 판매액
  cumulativeDiscountedSales: z.number(),
});
export type TotalSalesCountsReadModel = z.infer<
  typeof TotalSalesCountsReadModelSchema
>;

export const TotalReviewCountsReadModelSchema = z.object({
  date: z.string(),
  intervalReviewCount: z.number(),
  cumulativeReviewCount: z.number(),
});
export type TotalReviewCountsReadModel = z.infer<
  typeof TotalReviewCountsReadModelSchema
>;

export const UserStatsAggregateResponseSchema = z.object({
  ageGenderStats: z
    .object({
      ageRange: AgeRangeEnum,
      gender: GenderEnum,
      totalCount: z.number(),
    })
    .array(),
  marketingConsentCount: z.number(),
  totalUserCount: z.number(),
  onboardingIncompleteCount: z.number(),
  withdrawnUserCount: z.number(),
  todayLoginCount: z.number(),
  kakaoUserCount: z.number(),
  naverUserCount: z.number(),
});
export type UserStatsAggregateResponse = z.infer<
  typeof UserStatsAggregateResponseSchema
>;
