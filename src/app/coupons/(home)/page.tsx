'use client';

import { getAllCoupons } from '@/app/actions/coupon.action';
import { columns } from './types/table.type';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CouponType } from '@/types/coupon.type';
import { matches } from 'kled';
import DebouncedInput from '@/components/input/DebouncedInput';
import BlueLink from '@/components/link/BlueLink';
import ManuallyFilteredInfiniteTable from '@/components/table/ManuallyFilteredInfiniteTable';

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
  const filterCoupon = (
    coupon: CouponType,
    filter: { value: string; status: FilterType },
  ) => {
    const { value, status } = filter;

    const isFilteredByStatus =
      status === '전체' || !status
        ? true
        : status === '진행중'
          ? coupon.isActive
          : !coupon.isActive;
    if (!value) {
      return isFilteredByStatus;
    }

    const stringToCompare =
      coupon.name +
      (coupon.discountType === 'AMOUNT'
        ? `${coupon.discountAmount.toLocaleString()}원 할인`
        : `${coupon.discountRate}% 할인`) +
      `(최대 ${coupon.maxDiscountAmount.toLocaleString()}원)`;
    const score =
      value.length > stringToCompare.length
        ? matches(stringToCompare, value)
        : matches(value, stringToCompare);
    return isFilteredByStatus && score > 0;
  };

  const filteredCoupons = useMemo(
    () =>
      coupons.filter((coupon) =>
        filterCoupon(coupon, { value, status: searchParams.filter }),
      ),
    [coupons, value, searchParams.filter],
  );

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <header className="flex items-center justify-between">
        <h1 className="text-[32px] font-500">쿠폰 관리</h1>
        <BlueLink href="/coupons/new">쿠폰 추가</BlueLink>
      </header>
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
        {isFetching ? (
          <div>
            <Loader2Icon className="animate-spin" size={64} />
          </div>
        ) : (
          <ManuallyFilteredInfiniteTable
            data={filteredCoupons}
            columns={columns}
          />
        )}
      </section>
    </main>
  );
};

export default Page;
