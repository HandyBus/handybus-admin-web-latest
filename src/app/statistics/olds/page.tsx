'use client';

import Heading from '@/components/text/Heading';
import UserCountChart from './components/UserCountChart';
import DemandCountChart from './components/DemandCountChart';
import ReservationPassengerCountChart from './components/ReservationPassengerCountChart';
import SalesCountChart from './components/SalesCountChart';
import ReviewCountChart from './components/ReviewCountChart';
import CountFilter from './components/CountFilter';
import CancellationCountChart from './components/CancellationCountChart';
import UserFunnelChart from './components/UserFunnelChart';
import useCountFilter from './hooks/useCountFilter';

const Page = () => {
  const [countFilter, dispatchCountFilter] = useCountFilter();

  return (
    <main className="grow">
      <Heading>(구)성과 통계</Heading>
      <div className="flex flex-col gap-12">
        <section>
          <div className="flex w-full">
            <UserFunnelChart />
          </div>
        </section>
        <section>
          <Heading.h2>성과 통계</Heading.h2>
          <CountFilter
            countFilter={countFilter}
            dispatchCountFilter={dispatchCountFilter}
          />
          <div className="grid w-full grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
            <UserCountChart options={countFilter} />
            <DemandCountChart options={countFilter} />
            <ReservationPassengerCountChart options={countFilter} />
            <CancellationCountChart options={countFilter} />
            <SalesCountChart options={countFilter} />
            <ReviewCountChart options={countFilter} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
