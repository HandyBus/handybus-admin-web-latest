'use client';

import ChartBox from '@/components/chart/ChartSection';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { useGetTotalReservationCounts } from '@/services/shuttleOperation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
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
  const { data: cancelledReservationPassengerCounts } =
    useGetTotalReservationCounts({
      intervalDays,
      totalRangeDate,
      reservationStatus: 'CANCEL',
    });

  const parsedReservationPassengerCounts = reservationPassengerCounts?.map(
    (item, index) => ({
      ...item,
      intervalCancelledReservationPassengerCount:
        cancelledReservationPassengerCounts?.[index]
          ?.intervalReservationPassengerCount,
      cumulativeCancelledReservationPassengerCount:
        cancelledReservationPassengerCounts?.[index]
          ?.cumulativeReservationPassengerCount,
      date: dayjs(item.date).tz('Asia/Seoul').format('MM.DD.'),
    }),
  );

  const dataKey: Array<
    | 'intervalReservationPassengerCount'
    | 'cumulativeReservationPassengerCount'
    | 'intervalCancelledReservationPassengerCount'
    | 'cumulativeCancelledReservationPassengerCount'
  > =
    countType === '일일'
      ? [
          'intervalReservationPassengerCount',
          'intervalCancelledReservationPassengerCount',
        ]
      : [
          'cumulativeReservationPassengerCount',
          'cumulativeCancelledReservationPassengerCount',
        ];

  return (
    <ChartBox title="예약 탑승객">
      <CustomLineChart
        data={parsedReservationPassengerCounts ?? []}
        dataKey={dataKey}
        label={{
          intervalReservationPassengerCount: '일일 예약 탑승객',
          cumulativeReservationPassengerCount: '누적 예약 탑승객',
          intervalCancelledReservationPassengerCount: '일일 예약 취소 탑승객',
          cumulativeCancelledReservationPassengerCount: '누적 예약 취소 탑승객',
        }}
      />
    </ChartBox>
  );
};

export default ReservationPassengerCountChart;
