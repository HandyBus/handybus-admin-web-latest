'use client';

import Heading from '@/components/text/Heading';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from './CustomLineChart';
import { useGetTotalDemandCounts } from '@/services/shuttleOperation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalDemandCountsReadModel } from '@/types/dashboard.type';

interface Props {
  options: CountFilterOptions;
}

const DemandCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: totalDemandCounts } = useGetTotalDemandCounts({
    totalRangeDate,
    intervalDays,
  });

  const parsedTotalDemandCounts = totalDemandCounts?.map((item) => ({
    ...item,
    date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }),
  }));

  const dataKey: (keyof TotalDemandCountsReadModel)[] =
    countType === '일일' ? ['intervalDemandCount'] : ['cumulativeDemandCount'];

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">
        수요조사
      </Heading.h4>
      <CustomLineChart data={parsedTotalDemandCounts ?? []} dataKey={dataKey} />
    </article>
  );
};

export default DemandCountChart;
