export type FilterPeriod = '월간' | '주간' | '일간';

export const FILTER_PERIODS: FilterPeriod[] = ['일간', '주간', '월간'];

export type MetricId =
  | 'gmv'
  | 'activeUsersExplore'
  | 'activeUsersCore'
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
  criterionLabel?: string;
  percentage: string;
  chartData: { date: string; value: number }[];
  chartLabel: string;
}
