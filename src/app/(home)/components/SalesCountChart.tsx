'use client';

import Heading from '@/components/text/Heading';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from './CustomLineChart';
import { useGetTotalSalesCounts } from '@/services/billing.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalSalesCountsReadModel } from '@/types/dashboard.type';

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
    date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }),
  }));

  const dataKey: (keyof TotalSalesCountsReadModel)[] =
    countType === '일일'
      ? ['dailyGrossSales', 'dailyDiscountedSales']
      : ['cumulativeGrossSales', 'cumulativeDiscountedSales'];

  return (
    <article className="max-w-[412px] rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">매출</Heading.h4>
      <CustomLineChart data={parsedTotalSalesCounts ?? []} dataKey={dataKey} />
    </article>
  );
};

export default SalesCountChart;
