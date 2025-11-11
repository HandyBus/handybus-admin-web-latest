'use client';

import { putShuttleRoute } from '@/services/shuttleRoute.service';

const useChangeMaxPassengerCountOfMultipleShuttleRoutes = () => {
  const changeMaxPassengerCountOfShuttleRoute = async (
    eventId: string,
    dailyEventId: string,
    shuttleRouteId: string,
    maxPassengerCount: number,
  ) => {
    await putShuttleRoute(eventId, dailyEventId, shuttleRouteId, {
      maxPassengerCount: maxPassengerCount,
    });
  };

  const changeMaxPassengerCountOfMultipleShuttleRoutes = async ({
    eventId,
    dailyEventId,
    shuttleRouteIds,
    maxPassengerCount,
  }: {
    eventId: string;
    dailyEventId: string;
    shuttleRouteIds: string[];
    maxPassengerCount: number;
  }) => {
    const shuttleRouteCount = shuttleRouteIds.length;
    const confirmed = confirm(
      `${shuttleRouteCount}개의 노선 최대 승객 수를 ${maxPassengerCount}로 변경하시겠습니까?\n*최대 1분이 소요됩니다.\n*완료 메시지가 표시될 때까지 절대 사이트를 끄지 말아주세요.`,
    );
    if (!confirmed) {
      return;
    }

    for (const shuttleRouteId of shuttleRouteIds) {
      await changeMaxPassengerCountOfShuttleRoute(
        eventId,
        dailyEventId,
        shuttleRouteId,
        maxPassengerCount,
      );
    }

    alert('노선들이 최대 승객 수가 변경되었습니다.');
  };

  return {
    changeMaxPassengerCountOfMultipleShuttleRoutes,
  };
};

export default useChangeMaxPassengerCountOfMultipleShuttleRoutes;
