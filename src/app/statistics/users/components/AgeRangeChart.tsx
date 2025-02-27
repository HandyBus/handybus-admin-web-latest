'use client';

import CustomPieChart from '@/components/chart/CustomPieChart';
import Heading from '@/components/text/Heading';
import { useGetUsersWithPagination } from '@/services/userManagement.service';
import { useMemo } from 'react';

const AgeRangeChart = () => {
  const { data: ten, isFetching: tenLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    ageRange: '10대 이하',
  });
  const { data: twenty, isFetching: twentyLoading } = useGetUsersWithPagination(
    {
      page: undefined,
      limit: 1,
      status: 'ACTIVE',
      onboardingComplete: true,
      ageRange: '20대',
    },
  );
  const { data: thirty, isFetching: thirtyLoading } = useGetUsersWithPagination(
    {
      page: undefined,
      limit: 1,
      status: 'ACTIVE',
      onboardingComplete: true,
      ageRange: '30대',
    },
  );
  const { data: forty, isFetching: fortyLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    ageRange: '40대',
  });
  const { data: fifty, isFetching: fiftyLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    ageRange: '50대',
  });
  const { data: sixty, isFetching: sixtyLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    ageRange: '60대',
  });
  const { data: seventy, isFetching: seventyLoading } =
    useGetUsersWithPagination({
      page: undefined,
      limit: 1,
      status: 'ACTIVE',
      onboardingComplete: true,
      ageRange: '70대',
    });
  const { data: eighty, isFetching: eightyLoading } = useGetUsersWithPagination(
    {
      page: undefined,
      limit: 1,
      status: 'ACTIVE',
      onboardingComplete: true,
      ageRange: '80대 이상',
    },
  );

  const sortedChartData = useMemo(() => {
    const chartData = [
      { name: '10대 이하', value: ten?.pages[0]?.totalCount ?? 0 },
      { name: '20대', value: twenty?.pages[0]?.totalCount ?? 0 },
      { name: '30대', value: thirty?.pages[0]?.totalCount ?? 0 },
      { name: '40대', value: forty?.pages[0]?.totalCount ?? 0 },
      { name: '50대', value: fifty?.pages[0]?.totalCount ?? 0 },
      { name: '60대', value: sixty?.pages[0]?.totalCount ?? 0 },
      { name: '70대', value: seventy?.pages[0]?.totalCount ?? 0 },
      { name: '80대 이상', value: eighty?.pages[0]?.totalCount ?? 0 },
    ];
    return chartData.toSorted((a, b) => b.value - a.value);
  }, [ten, twenty, thirty, forty, fifty, sixty, seventy, eighty]);

  const isLoading =
    tenLoading ||
    twentyLoading ||
    thirtyLoading ||
    fortyLoading ||
    fiftyLoading ||
    sixtyLoading ||
    seventyLoading ||
    eightyLoading;

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">연령대</Heading.h4>
      <CustomPieChart
        data={sortedChartData}
        dataKey="value"
        isLoading={isLoading}
        renderTooltip={(data) => (
          <div className="min-w-100 rounded-[4px] border border-grey-200 bg-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
            <h5 className="text-14 font-500">{data.name}</h5>
            <p className="text-12 text-grey-700">
              {data.value}건 ({data.value}건)
            </p>
          </div>
        )}
      />
    </article>
  );
};

export default AgeRangeChart;
