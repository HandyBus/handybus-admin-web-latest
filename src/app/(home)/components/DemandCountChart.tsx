'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { useGetTotalDemandCounts } from '@/services/demand.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalDemandCountsReadModel } from '@/types/dashboard.type';
import dayjs from 'dayjs';

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
    date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
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
