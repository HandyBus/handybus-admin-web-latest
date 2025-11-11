'use client';

import { putShuttleRoute } from '@/services/shuttleRoute.service';
import dayjs from 'dayjs';

const useChangeReservationDeadlineOfMultipleShuttleRoutes = () => {
  const changeReservationDeadlineOfShuttleRoute = async (
    eventId: string,
    dailyEventId: string,
    shuttleRouteId: string,
    reservationDeadline: string,
  ) => {
    await putShuttleRoute(eventId, dailyEventId, shuttleRouteId, {
      reservationDeadline: reservationDeadline,
    });
  };

  const changeReservationDeadlineOfMultipleShuttleRoutes = async ({
    eventId,
    dailyEventId,
    shuttleRouteIds,
    reservationDeadline,
  }: {
    eventId: string;
    dailyEventId: string;
    shuttleRouteIds: string[];
    reservationDeadline: string;
  }) => {
    const shuttleRouteCount = shuttleRouteIds.length;
    const formattedReservationDeadline = dayjs(reservationDeadline)
      .tz('Asia/Seoul')
      .format('YYYY.MM.DD');
    const confirmed = confirm(
      `${shuttleRouteCount}개의 노선 예약 마감일을 ${formattedReservationDeadline}로 변경하시겠습니까?\n*최대 1분이 소요됩니다.\n*완료 메시지가 표시될 때까지 절대 사이트를 끄지 말아주세요.`,
    );
    if (!confirmed) {
      return;
    }

    for (const shuttleRouteId of shuttleRouteIds) {
      await changeReservationDeadlineOfShuttleRoute(
        eventId,
        dailyEventId,
        shuttleRouteId,
        reservationDeadline,
      );
    }

    alert('노선들이 예약 마감일이 변경되었습니다.');
  };

  return {
    changeReservationDeadlineOfMultipleShuttleRoutes,
  };
};

export default useChangeReservationDeadlineOfMultipleShuttleRoutes;
