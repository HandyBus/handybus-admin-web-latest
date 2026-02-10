export type FilterPeriod = '월간' | '주간' | '일간';

export const FILTER_PERIODS: FilterPeriod[] = ['일간', '주간', '월간'];

export type MetricId =
  | 'gmv'
  | 'activeUsersExplore'
  | 'activeUsersCore'
  | 'newUsers'
  | 'newUserConversionRate'
  | 'firstPurchaseTime'
  | 'firstPaymentContribution'
  | 'elasticityDAU'
  | 'elasticityWAU'
  | 'elasticityMAU'
  | 'reparticipation_rate'
  | 'reparticipation_cycle'
  | 'rebooking_rate'
  | 'rebooking_cycle'
  | 'reboarding_cycle'
  | 'demandCount'
  | 'reservationPassengerCount';

export interface ChartDataItem {
  date: string;
  [key: string]: number | string; // NOTE: TS의 인덱스 시그니처, date: string 을 포함한 명시적으로 선언된 모든 속성이 인덱스 시그니처의 타입을 만족해야하므로 number | string 으로 선언
}

export interface MetricData {
  id: MetricId;
  title: string;
  subtitle?: string;
  value: string;
  unit: string;
  criterionLabel?: string;
  percentage: string;
  chartData: ChartDataItem[];
  chartLabel: string;
  dataKeys?: string[];
  chartLabels?: Record<string, string>;
}
