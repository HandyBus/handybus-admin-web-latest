'use client';

import Heading from '@/components/text/Heading';
import { useGetEventCheerCampaign } from '@/services/cheer.service';
import { columns } from './table.type';
import VerticalTable from '@/components/table/VerticalTable';
import useTable from '@/hooks/useTable';
import { EventCheerCampaignsViewEntity } from '@/types/cheer.type';
import BlueLink from '@/components/link/BlueLink';

interface Props {
  params: {
    eventId: string;
    cheerCampaignId: string;
  };
}

const Page = ({ params }: Props) => {
  const { cheerCampaignId } = params;

  const { data: cheerCampaign } = useGetEventCheerCampaign(cheerCampaignId);

  return (
    <main className="flex flex-col">
      <Heading className="flex items-baseline gap-20">
        응원 캠페인 상세 페이지
        <BlueLink
          href={`/events/${params.eventId}/cheer/${params.cheerCampaignId}/edit`}
          className="text-12"
        >
          수정하기
        </BlueLink>
      </Heading>
      {cheerCampaign && <CheerCampaignTable cheerCampaign={cheerCampaign} />}
    </main>
  );
};

export default Page;

interface CheerCampaignTableProps {
  cheerCampaign: EventCheerCampaignsViewEntity;
}

const CheerCampaignTable = ({ cheerCampaign }: CheerCampaignTableProps) => {
  const table = useTable({
    columns,
    data: [cheerCampaign],
  });
  return <VerticalTable table={table} />;
};
