'use client';

import Heading from '@/components/text/Heading';
import GenderChart from './components/GenderChart';
import AgeRangeChart from './components/AgeRangeChart';
import SocialLoginChart from './components/SocialLoginChart';
import MarketingConsentChart from './components/MarketingConsentChart';
import { useGetUserStatsAggregate } from '@/services/user.service';
import { useMemo } from 'react';
import ChartBox from '@/components/chart/ChartBox';

const Page = () => {
  const { data: userStatsAggregate, isLoading } = useGetUserStatsAggregate();

  const genderData = useMemo(() => {
    if (!userStatsAggregate) {
      return [];
    }

    const males = userStatsAggregate.ageGenderStats.filter(
      (item) => item.gender === 'MALE',
    );
    const females = userStatsAggregate.ageGenderStats.filter(
      (item) => item.gender === 'FEMALE',
    );

    const malesTotalCount = males.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const femalesTotalCount = females.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );

    return [
      { name: '남성', value: malesTotalCount, additionalData: males },
      { name: '여성', value: femalesTotalCount, additionalData: females },
    ];
  }, [userStatsAggregate]);

  const ageRangeData = useMemo(() => {
    if (!userStatsAggregate) {
      return [];
    }

    const ten = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '10대 이하',
    );
    const twenty = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '20대',
    );
    const thirty = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '30대',
    );
    const forty = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '40대',
    );
    const fifty = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '50대',
    );
    const sixty = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '60대',
    );
    const seventy = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '70대',
    );
    const eighty = userStatsAggregate.ageGenderStats.filter(
      (item) => item.ageRange === '80대 이상',
    );

    const tenTotalCount = ten.reduce((acc, item) => acc + item.totalCount, 0);
    const twentyTotalCount = twenty.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const thirtyTotalCount = thirty.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const fortyTotalCount = forty.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const fiftyTotalCount = fifty.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const sixtyTotalCount = sixty.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const seventyTotalCount = seventy.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );
    const eightyTotalCount = eighty.reduce(
      (acc, item) => acc + item.totalCount,
      0,
    );

    return [
      { name: '10대 이하', value: tenTotalCount, additionalData: ten },
      { name: '20대', value: twentyTotalCount, additionalData: twenty },
      { name: '30대', value: thirtyTotalCount, additionalData: thirty },
      { name: '40대', value: fortyTotalCount, additionalData: forty },
      { name: '50대', value: fiftyTotalCount, additionalData: fifty },
      { name: '60대', value: sixtyTotalCount, additionalData: sixty },
      { name: '70대', value: seventyTotalCount, additionalData: seventy },
      { name: '80대 이상', value: eightyTotalCount, additionalData: eighty },
    ];
  }, [userStatsAggregate]);

  const socialLoginData = useMemo(() => {
    if (!userStatsAggregate) {
      return [];
    }

    return [
      { name: '카카오', value: userStatsAggregate.kakaoUserCount },
      { name: '네이버', value: userStatsAggregate.naverUserCount },
    ];
  }, [userStatsAggregate]);

  const marketingConsentData = useMemo(() => {
    if (!userStatsAggregate) {
      return [];
    }

    return [
      { name: '동의', value: userStatsAggregate.marketingConsentCount },
      {
        name: '미동의',
        value:
          userStatsAggregate.totalUserCount -
          userStatsAggregate.marketingConsentCount,
      },
    ];
  }, [userStatsAggregate]);

  return (
    <main className="flex grow flex-col">
      <Heading>유저 통계</Heading>
      <div className="grid w-full grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        <GenderChart data={genderData} isLoading={isLoading} />
        <AgeRangeChart data={ageRangeData} isLoading={isLoading} />
        <SocialLoginChart data={socialLoginData} isLoading={isLoading} />
        <MarketingConsentChart
          data={marketingConsentData}
          isLoading={isLoading}
        />
        <ChartBox title="유저 수">
          <div className="flex h-full w-full items-center justify-center pb-32">
            <div className="flex w-192 flex-col gap-8">
              <p className="flex items-baseline justify-between">
                <span className="flex text-basic-grey-700">총 유저 수 : </span>
                <b className="text-24">
                  {userStatsAggregate?.totalUserCount ?? 0}
                </b>
              </p>
              <p className="flex items-baseline justify-between gap-4">
                <span className="text-basic-grey-700">
                  온보딩 미완료 유저 수:{' '}
                </span>
                <b className="text-24">
                  {userStatsAggregate?.onboardingIncompleteCount ?? 0}
                </b>
              </p>
              <p className="flex items-baseline justify-between gap-4">
                <span className="text-basic-grey-700">탈퇴한 유저 수: </span>
                <b className="text-24">
                  {userStatsAggregate?.withdrawnUserCount ?? 0}
                </b>
              </p>
            </div>
          </div>
        </ChartBox>
        <ChartBox title="오늘 접속한 유저 수">
          <div className="flex h-full w-full items-center justify-center pb-32">
            <p className="text-28 font-700">
              {userStatsAggregate?.todayLoginCount ?? 0}
            </p>
          </div>
        </ChartBox>
      </div>
    </main>
  );
};

export default Page;
