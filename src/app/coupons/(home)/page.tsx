import { getAllCoupons } from '@/app/actions/coupon.action';

const Page = async () => {
  const coupons = await getAllCoupons();
  console.log(coupons);
  return <div>coupons</div>;
};

export default Page;
