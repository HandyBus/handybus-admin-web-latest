import { accountColumns } from '../types/account.table.type';
import { ReservationView } from '@/types/v2/reservation.type';
import VerticalTable from '@/components/table/VerticalTable';
import useTable from '@/hooks/useTable';

interface Props {
  response: ReservationView;
}

const AccountInfo = ({ response }: Props) => {
  const table = useTable({
    data: [response],
    columns: accountColumns,
  });

  return (
    <>
      <h2 className="text-[18px] font-500">계정정보</h2>
      <VerticalTable table={table} />
    </>
  );
};

export default AccountInfo;
