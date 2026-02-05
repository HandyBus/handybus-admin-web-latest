import { useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BulkRouteFormValues } from '../form.type';
import { createRoutesFromDefaultHubs } from '../utils/createRoutesFromDefaultHubs.util';
import dayjs from 'dayjs';
import { EventDailyShuttlesInEventsViewEntity } from '@/types/event.type';
import { useGetRegionHubs } from '@/services/hub.service';
import { DEFAULT_HUBS } from '../constants/default-hubs.const';
import { RegionHubsViewEntity } from '@/types/hub.type';

interface Props {
  selectedDailyEventIds: string[] | undefined;
  dailyEvents: EventDailyShuttlesInEventsViewEntity[];
}

// 도착지 선택 시 default-hubs를 기반으로 노선 목록을 자동 생성하는 훅
export const useDefaultHubsRoutes = ({
  selectedDailyEventIds,
  dailyEvents,
}: Props) => {
  const { control, setValue } = useFormContext<BulkRouteFormValues>();

  const [
    destinationHub,
    toDestinationArrivalTime,
    fromDestinationDepartureTime,
    season,
  ] = useWatch({
    control,
    name: [
      'destinationHub',
      'toDestinationArrivalTime',
      'fromDestinationDepartureTime',
      'season',
    ],
  });

  // 첫 번째 선택된 daily event의 날짜를 기본 날짜로 사용
  const baseDailyEvent = dailyEvents.find(
    (de) => de.dailyEventId === selectedDailyEventIds?.[0],
  );
  const baseDate = baseDailyEvent?.dailyEventDate || dayjs().toISOString();

  // 모든 default-hub 이름으로 hub 조회
  const { data: allHubsData } = useGetRegionHubs({
    options: {
      usageType: ['SHUTTLE_HUB'],
    },
    enabled: !!destinationHub,
  });

  // default-hub 이름으로 실제 hub 정보 매핑
  const defaultHubMap = useMemo(() => {
    if (!allHubsData) {
      return new Map<string, RegionHubsViewEntity>();
    }

    const allHubs = allHubsData.pages.flatMap((page) => page.regionHubs);
    const hubMap = new Map<string, RegionHubsViewEntity>();

    DEFAULT_HUBS.forEach((defaultHub) => {
      // 이름으로 정확히 매칭되는 hub 찾기
      const matchedHub = allHubs.find((hub) => hub.name === defaultHub.name);
      if (matchedHub) {
        hubMap.set(defaultHub.name, matchedHub);
      }
    });

    return hubMap;
  }, [allHubsData]);

  // 도착지가 변경되면 default-hubs를 기반으로 노선 목록 생성
  useEffect(() => {
    if (!destinationHub) {
      setValue('routes', []);
      return;
    }

    const routes = createRoutesFromDefaultHubs(
      destinationHub,
      baseDate,
      toDestinationArrivalTime ?? undefined,
      fromDestinationDepartureTime ?? undefined,
      season || '성수기',
      defaultHubMap,
    );

    setValue('routes', routes);
  }, [
    destinationHub,
    baseDate,
    toDestinationArrivalTime,
    fromDestinationDepartureTime,
    season,
    defaultHubMap,
    setValue,
  ]);
};
