'use client';

import useTable from '@/hooks/useTable';
import PartialRegionInput, {
  PartialRegion,
} from '@/components/input/PartialRegionInput';
import { useMemo, useState } from 'react';
import {
  GetDemandOptions,
  useGetDemandsStats,
} from '@/services/shuttleOperation.service';
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
    const newDemand = demandTo
      .map((item) => ({
        ...item,
        fromDestinationCount:
          demandFrom.find(
            (demand) => demand.regionHubName === item.regionHubName,
          )?.fromDestinationCount ?? 0,
      }))
      .toSorted((a, b) => {
        const aCount =
          a.fromDestinationCount + a.toDestinationCount + a.roundTripCount;
        const bCount =
          b.fromDestinationCount + b.toDestinationCount + b.roundTripCount;
        return bCount - aCount;
      });
    return newDemand;
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
