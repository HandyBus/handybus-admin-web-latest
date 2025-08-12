'use client';

import BlueLink from '@/components/link/BlueLink';
import { AdminCouponsResponseModel } from '@/types/coupon.type';
import { formatDateString } from '@/utils/date.util';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper<AdminCouponsResponseModel>();

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
          <div>
            <span className="text-16 font-500">{name}</span>
            <br />
            <span className="text-14 font-400 text-basic-grey-700">
              {type === 'AMOUNT'
                ? `${amount?.toLocaleString()}원 할인`
                : `${rate}% 할인 (최대 ${maxDiscount?.toLocaleString()}원)`}
            </span>
          </div>
        );
      },
    },
  ),
  columnHelper.accessor('code', {
    header: () => '쿠폰 코드',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor(
    (row) => ({
      isActive: row.isActive,
      validFrom: row.validFrom,
    }),
    {
      id: 'status',
      header: () => '상태',
      cell: (info) => {
        const { isActive, validFrom } = info.getValue();
        const now = dayjs();
        return isActive ? (
          <span className="text-brand-primary-600">진행중</span>
        ) : now.isBefore(dayjs(validFrom)) ? (
          <span className="text-basic-grey-700">대기</span>
        ) : (
          <span className="text-basic-red-600">만료</span>
        );
      },
    },
  ),
  columnHelper.accessor('discountType', {
    header: () => '쿠폰 형식',
    cell: (info) => (info.getValue() === 'AMOUNT' ? '정량' : '비율'),
  }),
  columnHelper.accessor(
    (row) => ({ used: row.currentCouponUsage, issued: row.maxCouponUsage }),
    {
      id: 'usageStatus',
      header: () => '발급/발행',
      cell: (info) => {
        const { used, issued } = info.getValue();
        return `${used}/${issued || '∞'}`;
      },
    },
  ),
  columnHelper.accessor('maxApplicablePeople', {
    header: () => '한 예약 당 최대 적용 가능 인원',
    cell: (info) => (info.getValue() === 0 ? '∞' : info.getValue()),
  }),
  columnHelper.accessor((row) => ({ from: row.validFrom, to: row.validTo }), {
    id: 'validDateRange',
    header: () => '사용기간',
    cell: (info) => {
      const { from, to } = info.getValue();
      return (
        <span className="white-space text-14">
          {formatDateString(from, 'datetime')}부터
          <br />
          {formatDateString(to, 'datetime')}까지
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => (
      <span className="text-14">
        {formatDateString(info.getValue(), 'datetime')}
      </span>
    ),
  }),
  columnHelper.accessor('updatedAt', {
    header: () => '수정일',
    cell: (info) => (
      <span className="text-14">
        {formatDateString(info.getValue(), 'datetime')}
      </span>
    ),
  }),
  columnHelper.accessor('allowedEventId', {
    header: () => '사용 가능 행사 제한',
    cell: (info) => {
      const allowedEventId = info.getValue();
      if (!allowedEventId) {
        return <span className="text-basic-grey-600">제한 없음</span>;
      }
      return (
        <BlueLink href={`/events/${allowedEventId}`}>
          사용 가능한 행사 보기
        </BlueLink>
      );
    },
  }),
  columnHelper.display({
    id: 'action',
    header: () => '수정하기 ',
    cell: (info) => {
      return (
        <BlueLink href={`/coupons/${info.row.original.couponId}/edit`}>
          수정하기
        </BlueLink>
      );
    },
  }),
];
