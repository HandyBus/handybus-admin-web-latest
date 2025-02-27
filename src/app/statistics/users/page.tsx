'use client';

import Heading from '@/components/text/Heading';
import GenderChart from './components/GenderChart';
import AgeRangeChart from './components/AgeRangeChart';
import SocialLoginChart from './components/SocialLoginChart';
import MarketingConsentChart from './components/MarketingConsentChart';

const Page = () => {
  return (
    <main className="flex grow flex-col">
      <Heading>유저 통계</Heading>
      <div className="grid w-full grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        <GenderChart />
        <AgeRangeChart />
        <SocialLoginChart />
        <MarketingConsentChart />
      </div>
    </main>
  );
};

export default Page;
