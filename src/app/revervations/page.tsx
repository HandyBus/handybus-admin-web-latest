import { getReservations } from '../actions/revervations.action';
import DataTable from '@/components/table/DataTable';
import { columns } from './components/ReservationTable';

const Page = async () => {
  const r = await getReservations();
  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <h1 className="text-[32px] font-500">예약 관리</h1>
      <DataTable data={r} columns={columns} />
    </main>
  );
};

export default Page;
