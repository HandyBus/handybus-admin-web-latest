'use client';

import ChartBox from '@/components/chart/ChartSection';
import { useGetTotalUserCounts } from '@/services/userManagement.service';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalUserCountsReadModel } from '@/types/dashboard.type';
import dayjs from 'dayjs';

interface Props {
  options: CountFilterOptions;
}

const UserCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: totalUserCounts } = useGetTotalUserCounts({
    totalRangeDate,
    intervalDays,
  });

  const parsedTotalUserCounts = totalUserCounts?.map((item) => ({
    ...item,
    date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
  }));

  const dataKey: (keyof TotalUserCountsReadModel)[] =
    countType === '일일' ? ['intervalUserCount'] : ['cumulativeUserCount'];

  return (
    <ChartBox title="가입한 유저">
      <CustomLineChart
        data={parsedTotalUserCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalUserCount: '일일 가입자',
          cumulativeUserCount: '누적 가입자',
        }}
      />
    </ChartBox>
  );
};

export default UserCountChart;
