'use client';

import Heading from '@/components/text/Heading';
import ExternalAnalysisTools from './components/ExternalAnalysisTools';
import StatisticsInsights from './components/StatisticsInsights';
import GrowthMetrics from './components/GrowthMetrics';
import InflowAndConversionMetrics from './components/InflowAndConversionMetrics';
import ReuseAnalysis from './components/ReuseAnalysis';
import ActiveEvents from './components/ActiveEvents';
import ExploreToCoreConversionElasticity from './components/ExploreToCoreConversionElasticity';

const Page = () => {
  return (
    <main className="grow">
      <div className="flex flex-col gap-80">
        <div className="flex flex-col gap-48">
          <Heading className="mb-0 h-auto p-0 text-28 font-600">
            성과 분석
          </Heading>
          <div className="flex gap-16">
            <ExternalAnalysisTools />
            <div className="w-[1px] self-stretch bg-basic-grey-200" />
            <StatisticsInsights />
          </div>
          <div className="flex w-full min-w-[936px] flex-col gap-48">
            <GrowthMetrics />
            <ActiveEvents />
            <Heading.h2>유입과 전환</Heading.h2>
            <ExploreToCoreConversionElasticity />
            <div className="h-24" />
            <InflowAndConversionMetrics />
            <ReuseAnalysis />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
