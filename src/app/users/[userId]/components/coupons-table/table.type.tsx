import { createColumnHelper } from '@tanstack/react-table';
import { formatDateString } from '@/utils/date.util';
import Stringifier from '@/utils/stringifier.util';
import { IssuedCouponsViewEntity } from '@/types/coupon.type';

const columnHelper = createColumnHelper<IssuedCouponsViewEntity>();

export const columns = [
  columnHelper.accessor('name', {
    header: '쿠폰 이름',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('code', {
    header: '쿠폰 코드',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'discountType',
    header: '할인 유형',
    cell: (props) => {
      const {
        discountType,
        discountAmount,
        discountRate,
        maxDiscountAmount,
        maxApplicablePeople,
      } = props.row.original;
      return (
        <div>
          <p>
            {discountType === 'RATE'
              ? `${discountRate}% 할인`
              : `${discountAmount?.toLocaleString()}원 할인`}
          </p>
          {discountType === 'RATE' && (
            <p className="text-12 text-grey-700">
              최대 {maxDiscountAmount?.toLocaleString()}원 할인 가능
            </p>
          )}
          {maxApplicablePeople !== null && (
            <p className="text-12 text-grey-700">
              최대 {maxApplicablePeople || '∞'}명 적용 가능
            </p>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('validFrom', {
    header: '유효 시작일',
    cell: (info) => formatDateString(info.getValue()),
  }),
  columnHelper.accessor('validTo', {
    header: '유효 종료일',
    cell: (info) => formatDateString(info.getValue()),
  }),
  columnHelper.accessor('status', {
    header: '쿠폰 상태',
    cell: (info) => Stringifier.issuedCouponStatus(info.getValue()),
  }),
];
