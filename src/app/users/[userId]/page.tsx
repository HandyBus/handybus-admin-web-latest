'use client';

import Heading from '@/components/text/Heading';
import {
  useGetUser,
  useGetUserCoupons,
  useGetUserDemands,
  useGetUserReservations,
  useGetUserReviews,
  useGetUserStats,
} from '@/services/userManagement.service';
import UserTable from './components/user-table/UserTable';
import ReservationsTable from './components/reservations-table/ReservationsTable';
import DemandsTable from './components/demands-table/DemandsTable';
import ReviewsTable from './components/reviews-table/ReviewsTable';
import CouponsTable from './components/coupons-table/CouponsTable';
import Callout from '@/components/text/Callout';

interface Props {
  params: {
    userId: string;
  };
}

const Page = ({ params }: Props) => {
  const userId = Number(params.userId);

  const { data: stats } = useGetUserStats(userId);
  const { data: user } = useGetUser(userId);
  const { data: reservations } = useGetUserReservations(userId);
  const { data: demands } = useGetUserDemands(userId);
  const { data: reviews } = useGetUserReviews(userId);
  const { data: coupons } = useGetUserCoupons(userId);

  return (
    <main>
      <Heading>유저 상세 페이지</Heading>
      <Callout className="grid grid-cols-[140px_140px_140px] gap-x-36 gap-y-8">
        <div className="flex justify-between">
          총 예약 수 :{' '}
          <b>
            {(stats?.currentReservationCount ?? 0) +
              (stats?.pastReservationCount ?? 0)}
          </b>
        </div>
        <div className="flex justify-between">
          진행 중인 예약 수 : <b>{stats?.currentReservationCount}</b>
        </div>
        <div className="flex justify-between">
          종료된 예약 수 : <b>{stats?.pastReservationCount}</b>
        </div>
        <div className="flex justify-between">
          총 수요조사 수 : <b>{stats?.shuttleDemandCount}</b>
        </div>
        <div className="flex justify-between">
          총 리뷰 수 : <b>{stats?.reviewCount}</b>
        </div>
      </Callout>
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
