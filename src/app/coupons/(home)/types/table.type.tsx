'use client';

import { CouponType } from '@/types/coupon.type';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<CouponType>();

export const columns = [
  columnHelper.accessor(
    (row) => ({
      name: row.name,
      type: row.discountType,
      rate: row.discountRate,
      amount: row.discountAmount,
      maxDiscount: row.maxDiscountAmount,
    }),
    {
      id: 'name',
      header: () => '쿠폰 이름',
      cell: (info) => {
        const { name, type, rate, amount, maxDiscount } = info.getValue();
        return (
          <span>
            {name}
            <br />
            {type === 'AMOUNT'
              ? `${amount.toLocaleString()}원 할인`
              : `${rate}% 할인`}{' '}
            {`(최대 ${maxDiscount.toLocaleString()}원)`}
          </span>
        );
      },
    },
  ),
  columnHelper.accessor('code', {
    header: () => '쿠폰 코드',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('isActive', {
    header: () => '상태',
    cell: (info) =>
      info.getValue() ? (
        <span className="text-primary-600">진행중</span>
      ) : (
        <span className="text-red-600">만료</span>
      ),
  }),
  columnHelper.accessor('discountType', {
    header: () => '쿠폰 형식',
    cell: (info) => (info.getValue() === 'AMOUNT' ? '정량' : '비율'),
  }),
  columnHelper.accessor(
    (row) => ({ used: row.currentCouponUsage, issued: row.maxCouponUsage }),
    {
      id: 'usageStatus',
      header: () => '사용/발행',
      cell: (info) => {
        const { used, issued } = info.getValue();
        return `${used}/${issued}`;
      },
    },
  ),
  columnHelper.accessor('maxApplicablePeople', {
    header: () => '최대 인원 수',
    cell: (info) => (info.getValue() === 0 ? '무제한' : info.getValue()),
  }),
  columnHelper.accessor((row) => ({ from: row.validFrom, to: row.validTo }), {
    id: 'validDateRange',
    header: () => '사용기간',
    cell: (info) => {
      const { from, to } = info.getValue();
      return (
        <span className="white-space text-14">
          {from.toLocaleString('ko-KR')}부터
          <br />
          {to.toLocaleString('ko-KR')}까지
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => (
      <span className="text-14">{info.getValue().toLocaleString('ko-KR')}</span>
    ),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => (
      <span className="text-14">{info.getValue().toLocaleString('ko-KR')}</span>
    ),
  }),
];
