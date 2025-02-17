'use client';

import Heading from '@/components/text/Heading';
import UserCountChart from './components/UserCountChart';
import DemandCountChart from './components/DemandCountChart';
import ReservationPassengerCountChart from './components/ReservationPassengerCountChart';
import CancelledReservationPassengerCountChart from './components/CancelledReservationPassengerCountChart';
import SalesCountChart from './components/SalesCountChart';
import ReviewCountChart from './components/ReviewCountChart';
import useCountFilter from './hooks/useCountFilter';
import CountFilter from './components/CountFilter';

const Page = () => {
  const [countFilter, dispatchCountFilter] = useCountFilter();

  return (
    <main className="grow">
      <Heading>통계 대시보드</Heading>
      <section className="mx-auto w-full max-w-[1300px] p-12">
        <Heading.h3 className="bg-white font-600">성과 통계</Heading.h3>
        <CountFilter
          countFilter={countFilter}
          dispatchCountFilter={dispatchCountFilter}
        />
        <div className="flex w-full flex-wrap justify-between gap-8">
          <UserCountChart options={countFilter} />
          <DemandCountChart options={countFilter} />
          <ReservationPassengerCountChart options={countFilter} />
          <CancelledReservationPassengerCountChart options={countFilter} />
          <SalesCountChart options={countFilter} />
          <ReviewCountChart options={countFilter} />
        </div>
      </section>
    </main>
  );
};

export default Page;
