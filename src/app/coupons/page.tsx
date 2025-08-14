'use client';

import { columns } from './table.type';
import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { matches } from 'kled';
import DebouncedInput from '@/components/input/DebouncedInput';
import BlueLink from '@/components/link/BlueLink';
import useTable from '@/hooks/useTable';
import BaseTable from '@/components/table/BaseTable';
import { useGetCoupons } from '@/services/coupon.service';
import { AdminCouponsResponseModel } from '@/types/coupon.type';
import Heading from '@/components/text/Heading';
import dayjs from 'dayjs';

const FILTER_LIST = ['전체', '진행중', '대기', '만료'] as const;
type FilterType = (typeof FILTER_LIST)[number];

interface Props {
  searchParams: {
    filter: FilterType;
  };
}

const Page = ({ searchParams }: Props) => {
  const { data: coupons, isFetching } = useGetCoupons();

  const [value, setValue] = useState('');
  const filterCoupon = (
    coupon: AdminCouponsResponseModel,
    filter: { value: string; status: FilterType },
  ) => {
    const { value, status } = filter;
    const now = dayjs();
    const validFrom = dayjs(coupon.validFrom);

    const isFilteredByStatus =
      status === '전체' || !status
        ? true
        : status === '진행중'
          ? coupon.isActive && now.isAfter(validFrom)
          : status === '대기'
            ? !coupon.isActive && now.isBefore(validFrom)
            : !coupon.isActive && now.isAfter(validFrom);
    if (!value) {
      return isFilteredByStatus;
    }

    const stringToCompare =
      coupon.name +
      (coupon.discountType === 'AMOUNT'
        ? `${coupon?.discountAmount?.toLocaleString()}원 할인`
        : `${coupon?.discountRate}% 할인`) +
      `(최대 ${coupon?.maxDiscountAmount?.toLocaleString()}원)`;
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

  const table = useTable({
    columns,
    data: filteredCoupons,
    manualFiltering: true,
  });

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        쿠폰 대시보드
        <BlueLink href="/coupons/new" className="text-14">
          추가하기
        </BlueLink>
      </Heading>
      <nav className="flex gap-40 text-20 font-600">
        {FILTER_LIST.map((filter) => (
          <Link
            key={filter}
            href={`/coupons?filter=${filter}`}
            className={`${
              (filter === '전체' && !searchParams.filter) ||
              filter === searchParams.filter
                ? ''
                : 'text-basic-grey-300'
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
      <section className="flex flex-col">
        {isFetching ? (
          <div>
            <Loader2Icon className="animate-spin" size={64} />
          </div>
        ) : (
          <BaseTable table={table} />
        )}
      </section>
    </main>
  );
};

export default Page;
