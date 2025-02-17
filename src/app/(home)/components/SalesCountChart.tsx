'use client';

import Heading from '@/components/text/Heading';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from './CustomLineChart';
import { useGetTotalSalesCounts } from '@/services/billing.service';

const SalesCountChart = () => {
  const { data: totalSalesCounts } = useGetTotalSalesCounts();

  const parsedTotalSalesCounts = totalSalesCounts?.map((item) => ({
    ...item,
    date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }),
  }));

  return (
    <article className="max-w-[412px] rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">매출</Heading.h4>
      <CustomLineChart
        data={parsedTotalSalesCounts ?? []}
        dataKey={['cumulativeGrossSales', 'cumulativeDiscountedSales']}
      />
    </article>
  );
};

export default SalesCountChart;
