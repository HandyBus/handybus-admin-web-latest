'use client';

import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import { IssuedCouponsViewEntity } from '@/types/coupon.type';

interface Props {
  coupons: IssuedCouponsViewEntity[];
}

const CouponsTable = ({ coupons }: Props) => {
  const table = useTable({
    data: coupons,
    columns,
  });

  return (
    <section className="flex w-full flex-col">
      <Heading.h2>쿠폰 정보</Heading.h2>
      <BaseTable table={table} />
    </section>
  );
};

export default CouponsTable;
