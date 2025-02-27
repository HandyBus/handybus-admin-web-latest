'use client';

import CustomPieChart from '@/components/chart/CustomPieChart';
import Heading from '@/components/text/Heading';
import { useGetUsersWithPagination } from '@/services/userManagement.service';

const GenderChart = () => {
  const { data: male, isFetching: maleLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    gender: 'MALE',
  });
  const { data: female, isFetching: femaleLoading } = useGetUsersWithPagination(
    {
      page: undefined,
      limit: 1,
      status: 'ACTIVE',
      onboardingComplete: true,
      gender: 'FEMALE',
    },
  );

  const chartData = [
    { name: '남성', value: male?.pages[0]?.totalCount ?? 0 },
    { name: '여성', value: female?.pages[0]?.totalCount ?? 0 },
  ];

  const isLoading = maleLoading || femaleLoading;

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">성별</Heading.h4>
      <CustomPieChart
        data={chartData}
        dataKey="value"
        isLoading={isLoading}
        colors={['#3980fa', '#ed4e4e']}
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

export default GenderChart;
