'use client';

import Heading from '@/components/text/Heading';
import CustomLineChart from './CustomLineChart';
import { useGetTotalReviewCounts } from '@/services/shuttleOperation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalReviewCountsReadModel } from '@/types/dashboard.type';
import dayjs from 'dayjs';

interface Props {
  options: CountFilterOptions;
}

const ReviewCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: totalReviewCounts } = useGetTotalReviewCounts({
    intervalDays,
    totalRangeDate,
  });

  const parsedTotalReviewCounts = totalReviewCounts?.map((item) => ({
    ...item,
    date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
  }));

  const dataKey: (keyof TotalReviewCountsReadModel)[] =
    countType === '일일' ? ['intervalReviewCount'] : ['cumulativeReviewCount'];

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">리뷰</Heading.h4>
      <CustomLineChart data={parsedTotalReviewCounts ?? []} dataKey={dataKey} />
    </article>
  );
};

export default ReviewCountChart;
