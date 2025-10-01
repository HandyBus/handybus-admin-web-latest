import BlueLink from '@/components/link/BlueLink';
import { accountColumns } from '../types/account.table.type';
import VerticalTable from '@/components/table/VerticalTable';
import Heading from '@/components/text/Heading';
import useTable from '@/hooks/useTable';
import { ReservationViewEntity } from '@/types/reservation.type';

interface Props {
  response: ReservationViewEntity;
}

const AccountInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: accountColumns,
  });

  return (
    <article className="flex flex-col">
      <Heading.h2>
        유저정보{' '}
        <BlueLink
          href={`/users/${response.userId}`}
          className="ml-auto text-14"
        >
          유저 바로가기
        </BlueLink>
      </Heading.h2>
      <VerticalTable table={table} />
    </article>
  );
};

export default AccountInfo;
