'use client';

import Heading from '@/components/text/Heading';
import {
  useGetUser,
  useGetUserCoupons,
  useGetUserDemands,
  useGetUserReservations,
  useGetUserReviews,
  // useGetUserStats,
} from '@/services/userManagement.service';
import UserTable from './components/user-table/UserTable';
import ReservationsTable from './components/reservations-table/ReservationsTable';
import DemandsTable from './components/demands-table/DemandsTable';
import ReviewsTable from './components/reviews-table/ReviewsTable';
import CouponsTable from './components/coupons-table/CouponsTable';

interface Props {
  params: {
    userId: string;
  };
}

const Page = ({ params }: Props) => {
  const userId = Number(params.userId);

  // const { data: stats } = useGetUserStats(userId);
  const { data: user } = useGetUser(userId);
  const { data: reservations } = useGetUserReservations(userId);
  const { data: demands } = useGetUserDemands(userId);
  const { data: reviews } = useGetUserReviews(userId);
  const { data: coupons } = useGetUserCoupons(userId);

  return (
    <main>
      <Heading>유저 상세 페이지</Heading>
      <section className="flex flex-col gap-32">
        {user && <UserTable user={user} />}
        {reservations && <ReservationsTable reservations={reservations} />}
        {demands && <DemandsTable demands={demands} />}
        {reviews && <ReviewsTable reviews={reviews} />}
        {coupons && <CouponsTable coupons={coupons} />}
      </section>
    </main>
  );
};

export default Page;
