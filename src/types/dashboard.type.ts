import { z } from 'zod';

export interface DashboardOptions {
  baseDate: string; // 기준일자
  totalRangeDate: number; // 기준일자로부터 몇일 전까지 조회 할 지 (예: 6이면 기준 일 포함 총 7일)
  intervalDays: number; // 집계 간격 (일 단위)
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
