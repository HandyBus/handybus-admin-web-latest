'use client';

import { getAllCoupons } from '@/app/actions/coupon.action';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { CouponType } from '@/types/coupon.type';
import { FilterFnOption } from '@tanstack/react-table';
import { matches } from 'kled';
import DebouncedInput from '@/components/input/DebouncedInput';

const FILTER_LIST = ['전체', '진행중', '만료'] as const;
type FilterType = (typeof FILTER_LIST)[number];

interface Props {
  searchParams: {
    filter: FilterType;
  };
}

const Page = ({ searchParams }: Props) => {
  const { data: coupons, isFetching } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => getAllCoupons(),
    initialData: [],
  });

  const [value, setValue] = useState('');
  const filterCoupons: FilterFnOption<CouponType> = (row, _, filter) => {
    const { value, status } = filter;

    const isFilteredByStatus =
      status === '전체' || !status
        ? true
        : status === '진행중'
          ? row.original.isActive
          : !row.original.isActive;
    if (!value) {
      return isFilteredByStatus;
    }

    const stringToCompare =
      row.original.name +
      (row.original.discountType === 'AMOUNT'
        ? `${row.original.discountAmount.toLocaleString()}원 할인`
        : `${row.original.discountRate}% 할인`) +
      `(최대 ${row.original.maxDiscountAmount.toLocaleString()}원)`;
    const score =
      value.length > stringToCompare.length
        ? matches(stringToCompare, value)
        : matches(value, stringToCompare);
    return score > 0;
  };

  if (isFetching)
    return (
      <div>
        <Loader2Icon className="animate-spin" size={64} />
      </div>
    );

  return (
    <main>
      <nav className="flex gap-40 text-20 font-600">
        {FILTER_LIST.map((filter) => (
          <Link
            key={filter}
            href={`/coupons?filter=${filter}`}
            className={`${
              (filter === '전체' && !searchParams.filter) ||
              filter === searchParams.filter
                ? ''
                : 'text-grey-300'
            }`}
          >
            {filter}
          </Link>
        ))}
      </nav>
      <div className="py-20">
        <DebouncedInput
          value={value}
          setValue={setValue}
          placeholder="쿠폰 이름으로 검색"
        />
      </div>
      <section>
        <DataTable
          data={coupons}
          columns={columns}
          globalFilter={{ value, status: searchParams.filter }}
          globalFilterFn={filterCoupons}
        />
      </section>
    </main>
  );
};

export default Page;
