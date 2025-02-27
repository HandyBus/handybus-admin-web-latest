'use client';

import ChartBox from '@/components/chart/ChartSection';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { useGetTotalReservationCounts } from '@/services/shuttleOperation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalReservationPassengerCountsReadModel } from '@/types/dashboard.type';
import dayjs from 'dayjs';

interface Props {
  options: CountFilterOptions;
}

const ReservationPassengerCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: reservationPassengerCounts } = useGetTotalReservationCounts({
    totalRangeDate,
    intervalDays,
    reservationStatus: 'COMPLETE_PAYMENT',
  });

  const parsedReservationPassengerCounts = reservationPassengerCounts?.map(
    (item) => ({
      ...item,
      date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
    }),
  );

  const dataKey: (keyof TotalReservationPassengerCountsReadModel)[] =
    countType === '일일'
      ? ['intervalReservationPassengerCount']
      : ['cumulativeReservationPassengerCount'];

  return (
    <ChartBox title="예약 탑승객">
      <CustomLineChart
        data={parsedReservationPassengerCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalReservationPassengerCount: '일일 예약 탑승객',
          cumulativeReservationPassengerCount: '누적 예약 탑승객',
        }}
      />
    </ChartBox>
  );
};

export default ReservationPassengerCountChart;
