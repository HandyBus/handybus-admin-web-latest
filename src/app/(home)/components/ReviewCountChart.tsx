'use client';

import Heading from '@/components/text/Heading';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { useGetTotalReviewCounts } from '@/services/shuttleOperation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalReviewCountsReadModel } from '@/types/dashboard.type';

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
    date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    }),
  }));

  const dataKey: (keyof TotalReviewCountsReadModel)[] =
    countType === '일일' ? ['intervalReviewCount'] : ['cumulativeReviewCount'];

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">리뷰</Heading.h4>
      <CustomLineChart
        data={parsedTotalReviewCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalReviewCount: '일일 리뷰',
          cumulativeReviewCount: '누적 리뷰',
        }}
      />
    </article>
  );
};

export default ReviewCountChart;
