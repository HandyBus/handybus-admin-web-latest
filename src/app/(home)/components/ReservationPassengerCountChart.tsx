'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomLineChart from '../../../components/chart/CustomLineChart';
import { useGetTotalReservationPassengerCounts } from '@/services/reservation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import dayjs from 'dayjs';

interface Props {
  options: CountFilterOptions;
}

const ReservationPassengerCountChart = ({ options }: Props) => {
  const { countType, range } = options;
  const { intervalDays, totalRangeDate } = getInterval(range);
  const { data: reservationPassengerCounts } =
    useGetTotalReservationPassengerCounts({
      totalRangeDate,
      intervalDays,
      reservationStatus: 'COMPLETE_PAYMENT',
    });
  const { data: cancelledReservationPassengerCounts } =
    useGetTotalReservationPassengerCounts({
      intervalDays,
      totalRangeDate,
      reservationStatus: 'CANCEL',
    });

  const parsedReservationPassengerCounts = reservationPassengerCounts?.map(
    (item, index) => ({
      intervalReservationPassengerCount:
        item.intervalReservationPassengerCount +
        (cancelledReservationPassengerCounts?.[index]
          ?.intervalReservationPassengerCount ?? 0),
      cumulativeReservationPassengerCount:
        item.cumulativeReservationPassengerCount +
        (cancelledReservationPassengerCounts?.[index]
          ?.cumulativeReservationPassengerCount ?? 0),
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
    <ChartBox
      title={
        <>
          <span className="keep-word shrink-0">예약 탑승객</span>
          <span className="ml-[6px] line-clamp-1 text-12 font-400 text-grey-600">
            예약 탑승객 수는 취소한 예약 탑승객 수를 포함합니다.
          </span>
        </>
      }
    >
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
