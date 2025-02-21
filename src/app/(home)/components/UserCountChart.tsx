'use client';

import Heading from '@/components/text/Heading';
import { useGetTotalUserCounts } from '@/services/userManagement.service';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from './CustomLineChart';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalUserCountsReadModel } from '@/types/dashboard.type';

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
    date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }),
  }));

  const dataKey: (keyof TotalUserCountsReadModel)[] =
    countType === '일일' ? ['intervalUserCount'] : ['cumulativeUserCount'];

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">
        가입한 유저
      </Heading.h4>
      <CustomLineChart data={parsedTotalUserCounts ?? []} dataKey={dataKey} />
    </article>
  );
};

export default UserCountChart;
