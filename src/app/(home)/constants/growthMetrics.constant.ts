import { MetricData, MetricId } from '../types/types';

export const METRICS: MetricData[] = [
  {
    id: 'activeUsersExplore',
    title: 'Active Users',
    subtitle: 'Explore',
    value: '385만',
    unit: '명',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 30 },
      { date: '2월', value: 45 },
      { date: '3월', value: 35 },
      { date: '4월', value: 50 },
      { date: '5월', value: 60 },
      { date: '6월', value: 55 },
      { date: '7월', value: 70 },
      { date: '8월', value: 65 },
      { date: '9월', value: 80 },
      { date: '10월', value: 75 },
      { date: '11월', value: 90 },
      { date: '12월', value: 100 },
    ],
    chartLabel: 'Active Users (Explore)',
  },
  {
    id: 'activeUsersCore',
    title: 'Active Users',
    subtitle: 'Core',
    value: '280만',
    unit: '명',
    percentage: '15.3%',
    chartData: [
      { date: '1월', value: 25 },
      { date: '2월', value: 40 },
      { date: '3월', value: 30 },
      { date: '4월', value: 45 },
      { date: '5월', value: 55 },
      { date: '6월', value: 50 },
      { date: '7월', value: 65 },
      { date: '8월', value: 60 },
      { date: '9월', value: 75 },
      { date: '10월', value: 70 },
      { date: '11월', value: 85 },
      { date: '12월', value: 95 },
    ],
    chartLabel: 'Active Users (Core)',
  },
];

export const GROWTH_METRIC_IDS: MetricId[] = [
  'gmv',
  'activeUsersExplore',
  'activeUsersCore',
  'newUsers',
];
