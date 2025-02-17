'use client';

import Heading from '@/components/text/Heading';
import { dayjsTz } from '@/utils/date.util';
import CustomLineChart from './CustomLineChart';
import { useGetTotalReservationCounts } from '@/services/shuttleOperation.service';
import { CountFilterOptions, getInterval } from '../hooks/useCountFilter';
import { TotalReservationPassengerCountsReadModel } from '@/types/dashboard.type';

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
      date: dayjsTz(item.date).toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      }),
    }),
  );

  const dataKey: (keyof TotalReservationPassengerCountsReadModel)[] =
    countType === '일일'
      ? ['intervalReservationPassengerCount']
      : ['cumulativeReservationPassengerCount'];

  return (
    <article className="max-w-[412px] rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">
        예약 탑승객
      </Heading.h4>
      <CustomLineChart
        data={parsedReservationPassengerCounts ?? []}
        dataKey={dataKey}
      />
    </article>
  );
};

export default ReservationPassengerCountChart;
