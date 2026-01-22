export type FilterPeriod = '전체' | '월간' | '주간' | '일간';

export const FILTER_PERIODS: FilterPeriod[] = ['전체', '월간', '주간', '일간'];

export type MetricId =
  | 'gmv'
  | 'activeUsersBrowse'
  | 'activeUsersParticipate'
  | 'newUsers'
  | 'newUserConversionRate'
  | 'firstPurchaseTime'
  | 'firstPaymentContribution';

export interface MetricData {
  id: MetricId;
  title: string;
  subtitle?: string;
  value: string;
  unit: string;
  percentage: string;
  chartData: { date: string; value: number }[];
  chartLabel: string;
}
