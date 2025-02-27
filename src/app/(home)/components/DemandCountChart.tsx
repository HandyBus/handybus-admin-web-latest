'use client';

import ChartBox from '@/components/chart/ChartSection';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from '../../../components/chart/CustomLineChart';
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
    <ChartBox title="수요조사">
      <CustomLineChart
        data={parsedTotalDemandCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalDemandCount: '일일 수요조사',
          cumulativeDemandCount: '누적 수요조사',
        }}
      />
    </ChartBox>
  );
};

export default DemandCountChart;
