import { z } from 'zod';

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
