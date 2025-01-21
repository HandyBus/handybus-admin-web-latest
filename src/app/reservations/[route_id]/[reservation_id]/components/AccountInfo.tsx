import { accountColumns } from '../types/account.table.type';
import VerticalTable from '@/components/table/VerticalTable';
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
    <>
      <h2 className="text-[18px] font-500">계정정보</h2>
      <VerticalTable table={table} />
    </>
  );
};

export default AccountInfo;
