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
      <Heading.h2>계정정보</Heading.h2>
      <VerticalTable table={table} />
    </article>
  );
};

export default AccountInfo;
