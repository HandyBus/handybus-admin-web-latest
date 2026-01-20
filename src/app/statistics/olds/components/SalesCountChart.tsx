'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomLineChart from '@/components/chart/CustomLineChart';
import { useGetTotalSalesCounts } from '@/services/payment.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalSalesCountsReadModel } from '@/types/dashboard.type';
import dayjs from 'dayjs';

interface Props {
  options: CountFilterOptions;
}

const SalesCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: totalSalesCounts } = useGetTotalSalesCounts({
    intervalDays,
    totalRangeDate,
  });

  const parsedTotalSalesCounts = totalSalesCounts?.map((item) => ({
    ...item,
    date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
  }));

  const dataKey: (keyof TotalSalesCountsReadModel)[] =
    countType === '일일'
      ? ['dailyGrossSales', 'dailyDiscountedSales']
      : ['cumulativeGrossSales', 'cumulativeDiscountedSales'];

  return (
    <ChartBox title="매출">
      <CustomLineChart
        data={parsedTotalSalesCounts ?? []}
        dataKey={dataKey}
        label={{
          dailyGrossSales: '일일 판매액',
          cumulativeGrossSales: '누적 판매액',
          dailyDiscountedSales: '일일 할인 적용 판매액',
          cumulativeDiscountedSales: '누적 할인 적용 판매액',
        }}
      />
    </ChartBox>
  );
};

export default SalesCountChart;
