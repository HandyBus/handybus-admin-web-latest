'use client';

import { putShuttleRoute } from '@/services/shuttleRoute.service';

const useCloseMultipleShuttleRoutes = () => {
  const closeShuttleRoute = async (
    eventId: string,
    dailyEventId: string,
    shuttleRouteId: string,
  ) => {
    await putShuttleRoute(eventId, dailyEventId, shuttleRouteId, {
      status: 'CLOSED',
    });
  };

  const closeMultipleShuttleRoutes = async ({
    eventId,
    dailyEventId,
    shuttleRouteIds,
  }: {
    eventId: string;
    dailyEventId: string;
    shuttleRouteIds: string[];
  }) => {
    const shuttleRouteCount = shuttleRouteIds.length;
    const confirmed = confirm(
      `${shuttleRouteCount}개의 핸디팟 노선을 예약 마감하시겠습니까?\n*최대 1분이 소요됩니다.\n*완료 메시지가 표시될 때까지 절대 사이트를 끄지 말아주세요.`,
    );
    if (!confirmed) {
      return;
    }

    for (const shuttleRouteId of shuttleRouteIds) {
      await closeShuttleRoute(eventId, dailyEventId, shuttleRouteId);
    }

    alert('핸디팟 노선들이 예약 마감되었습니다.');
  };

  return {
    closeMultipleShuttleRoutes,
  };
};

export default useCloseMultipleShuttleRoutes;
