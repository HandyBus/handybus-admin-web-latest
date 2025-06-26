'use client';

import useTable from '@/hooks/useTable';
import PartialRegionInput, {
  PartialRegion,
} from '@/components/input/PartialRegionInput';
import { useMemo, useState } from 'react';
import {
  GetDemandOptions,
  useGetDemandsStats,
} from '@/services/demand.service';
import { columns } from '../table.type';
import BaseTable from '@/components/table/BaseTable';
import Loading from '@/components/loading/Loading';

interface Props {
  eventId: string;
  dailyEventId: string;
}

const Table = ({ eventId, dailyEventId }: Props) => {
  const [partialRegion, setPartialRegion] = useState<PartialRegion>({
    province: null,
    city: null,
  });

  const optionTo: GetDemandOptions = {
    groupBy: 'TO_DESTINATION_REGION_HUB',
    provinceFullName: partialRegion.province ?? undefined,
    cityFullName: partialRegion.city ?? undefined,
    dailyEventId: dailyEventId,
    eventId: eventId,
  };

  const optionFrom: GetDemandOptions = {
    groupBy: 'FROM_DESTINATION_REGION_HUB',
    provinceFullName: partialRegion.province ?? undefined,
    cityFullName: partialRegion.city ?? undefined,
    dailyEventId: dailyEventId,
    eventId: eventId,
  };

  const { data: demandTo, isPending: isPendingTo } =
    useGetDemandsStats(optionTo);

  const { data: demandFrom, isPending: isPendingFrom } =
    useGetDemandsStats(optionFrom);

  const isLoading = isPendingTo || isPendingFrom;

  const joinedDemand = useMemo(() => {
    if (!demandTo || !demandFrom) {
      return [];
    }
    const newDemandTo = demandTo.map((item) => ({
      ...item,
      fromDestinationCount:
        demandFrom.find((demand) => demand.regionHubName === item.regionHubName)
          ?.fromDestinationCount ?? 0,
    }));

    const newDemand = demandFrom.map((item) => {
      const isAdded = newDemandTo.find(
        (demand) => demand.regionHubName === item.regionHubName,
      );
      if (isAdded) {
        return isAdded;
      }
      return {
        ...item,
        toDestinationCount: 0,
      };
    });

    const sortedDemand = newDemand.sort((a, b) => {
      const isACustom = !Boolean(a?.regionHubId);
      const isBCustom = !Boolean(b?.regionHubId);

      if (isACustom && isBCustom) {
        const provinceCompare = (a.provinceShortName ?? '').localeCompare(
          b.provinceShortName ?? '',
        );
        if (provinceCompare !== 0) {
          return provinceCompare;
        }

        const cityCompare = (a.cityShortName ?? '').localeCompare(
          b.cityShortName ?? '',
        );
        if (cityCompare !== 0) {
          return cityCompare;
        }

        return (a.regionHubName ?? '').localeCompare(b.regionHubName ?? '');
      }
      if (isACustom) {
        return 1;
      }
      if (isBCustom) {
        return -1;
      }

      return (a?.regionHubName ?? '').localeCompare(b?.regionHubName ?? '');
    });

    return sortedDemand;
  }, [demandTo, demandFrom]);

  const table = useTable({
    data: joinedDemand,
    columns,
  });

  return (
    <div className="flex grow flex-col gap-12">
      <PartialRegionInput value={partialRegion} setValue={setPartialRegion} />

      <section className="flex flex-col gap-16">
        {isLoading ? (
          <Loading />
        ) : joinedDemand && joinedDemand.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          <BaseTable table={table} />
        )}
      </section>
    </div>
  );
};

export default Table;
