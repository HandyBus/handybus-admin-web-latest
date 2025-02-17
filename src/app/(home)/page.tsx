'use client';

import Heading from '@/components/text/Heading';
import UserCountChart from './components/UserCountChart';
import DemandCountChart from './components/DemandCountChart';
import ReservationPassengerCountChart from './components/ReservationPassengerCountChart';
import CancelledReservationPassengerCountChart from './components/CancelledReservationPassengerCountChart';
import SalesCountChart from './components/SalesCountChart';
import ReviewCountChart from './components/ReviewCountChart';

const Page = () => {
  return (
    <main className="grow">
      <Heading>통계 대시보드</Heading>
      <section className="mx-auto w-full max-w-[1300px] p-12">
        <Heading.h3 className="bg-white font-600">성과 통계</Heading.h3>
        <div className="flex w-full flex-wrap justify-between gap-8">
          <UserCountChart />
          <DemandCountChart />
          <ReservationPassengerCountChart />
          <CancelledReservationPassengerCountChart />
          <SalesCountChart />
          <ReviewCountChart />
        </div>
      </section>
    </main>
  );
};

export default Page;
