import { getAllCoupons } from '@/app/actions/coupon.action';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';

const Page = async () => {
  const coupons = await getAllCoupons();
  return (
    <main>
      <DataTable data={coupons} columns={columns} />
    </main>
  );
};

export default Page;
