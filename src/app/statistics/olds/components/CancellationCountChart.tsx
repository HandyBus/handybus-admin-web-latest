'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomLineChart from '@/components/chart/CustomLineChart';
import { useGetCancelledReservationCounts } from '@/services/reservation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import dayjs from 'dayjs';

interface Props {
  options: CountFilterOptions;
}

const CancellationCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: cancelledReservationCounts } = useGetCancelledReservationCounts(
    {
      intervalDays,
      totalRangeDate,
      reservationStatus: 'CANCEL',
    },
  );

  const parsedCancelledReservationCounts = cancelledReservationCounts?.map(
    (item) => ({
      ...item,
      date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
    }),
  );

  const dataKey: Array<
    'intervalCancellationCount' | 'cumulativeCancellationCount'
  > =
    countType === '일일'
      ? ['intervalCancellationCount']
      : ['cumulativeCancellationCount'];

  return (
    <ChartBox
      title={
        <>
          <span className="keep-word shrink-0">예약 취소</span>
        </>
      }
    >
      <CustomLineChart
        data={parsedCancelledReservationCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalCancellationCount: '일일 예약 취소',
          cumulativeCancellationCount: '누적 예약 취소',
        }}
      />
    </ChartBox>
  );
};

export default CancellationCountChart;
