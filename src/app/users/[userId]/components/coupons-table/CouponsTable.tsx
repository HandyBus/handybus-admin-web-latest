'use client';

import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import { IssuedCouponsViewEntity } from '@/types/coupon.type';
import { useMemo } from 'react';

interface Props {
  coupons: IssuedCouponsViewEntity[];
}

const CouponsTable = ({ coupons }: Props) => {
  const memoizedCoupons = useMemo(() => coupons, [coupons]);
  const table = useTable({
    data: memoizedCoupons,
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
