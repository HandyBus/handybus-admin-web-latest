import { getAllCoupons } from '@/app/actions/coupon.action';
import DataTable from '@/components/table/DataTable';
import { columns } from './types/table.type';
import { CouponType } from '@/types/coupon.type';

const FILTER_LIST = ['전체', '진행중', '만료'] as const;
type FilterType = (typeof FILTER_LIST)[number];

interface Props {
  searchParams: {
    filter: FilterType;
  };
}

const Page = async ({ searchParams }: Props) => {
  const coupons = await getAllCoupons();

  const filterCoupons = (filter: FilterType, coupons: CouponType[]) => {
    switch (filter) {
      case '진행중':
        return coupons.filter((coupon) => coupon.isActive);
      case '만료':
        return coupons.filter((coupon) => !coupon.isActive);
      default:
        return coupons;
    }
  };
  const filteredCoupons = filterCoupons(searchParams.filter, coupons);

  return (
    <main>
      <nav className="flex gap-40 text-20 font-600">
        {FILTER_LIST.map((filter) => (
          <a
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
          </a>
        ))}
      </nav>
      <DataTable data={filteredCoupons} columns={columns} />
    </main>
  );
};

export default Page;
