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
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GA_LINK =
  'https://analytics.google.com/analytics/web/?hl=ko#/p464197268/reports/intelligenthome';
const GOOGLE_SEARCH_CONSOLE_LINK =
  'https://search.google.com/search-console?utm_source=about-page&resource_id=https://www.handybus.co.kr/';
const NAVER_SEARCH_ADVISOR_LINK =
  'https://searchadvisor.naver.com/console/site/summary?site=https%3A%2F%2Fwww.handybus.co.kr';

const Page = () => {
  const [countFilter, dispatchCountFilter] = useCountFilter();

  return (
    <main className="grow">
      <Heading>통계 대시보드</Heading>
      <section className="flex gap-20 pb-12">
        <article className="group relative flex h-188 w-188 flex-col justify-center gap-4 rounded-[8px] border border-grey-200 bg-white pl-28 transition-all hover:bg-grey-50">
          <Link
            href={GA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-14 font-600 text-blue-500 underline underline-offset-2"
          >
            구글 애널리틱스
          </Link>
          <Link
            href={GOOGLE_SEARCH_CONSOLE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-14 font-600 text-blue-500 underline underline-offset-2"
          >
            구글 서치 콘솔
          </Link>
          <Link
            href={NAVER_SEARCH_ADVISOR_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-14 font-600 text-blue-500 underline underline-offset-2"
          >
            네이버 서치어드바이저
          </Link>
          <ArrowRight
            className="absolute bottom-4 right-4 text-grey-400"
            width={20}
            height={20}
          />
        </article>
        {/* <DashboardCard title="유저 통계" href="/statistics/users" /> */}
        <DashboardCard title="수요조사 통계" href="/statistics/demands" />
      </section>
      <section>
        <Heading.h2>성과 통계</Heading.h2>
        <CountFilter
          countFilter={countFilter}
          dispatchCountFilter={dispatchCountFilter}
        />
        <div className="mx-auto flex w-full max-w-[1300px] flex-wrap justify-between gap-8">
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

interface DashboardCardProps {
  title: string;
  href: string;
}

const DashboardCard = ({ title, href }: DashboardCardProps) => {
  return (
    <Link
      href={href}
      className="group relative flex h-188 w-188 items-center justify-center rounded-[8px] border border-grey-200 bg-white transition-all hover:bg-grey-50"
    >
      <span className="font-600">{title}</span>
      <ArrowRight
        className="absolute bottom-4 right-4 text-grey-400"
        width={20}
        height={20}
      />
    </Link>
  );
};
