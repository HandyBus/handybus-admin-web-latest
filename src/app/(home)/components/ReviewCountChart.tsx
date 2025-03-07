'use client';

import ChartBox from '@/components/chart/ChartSection';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { useGetTotalReviewCounts } from '@/services/review.service';
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
    <ChartBox title="리뷰">
      <CustomLineChart
        data={parsedTotalReviewCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalReviewCount: '일일 리뷰',
          cumulativeReviewCount: '누적 리뷰',
        }}
      />
    </ChartBox>
  );
};

export default ReviewCountChart;
