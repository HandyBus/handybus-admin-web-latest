'use client';

import CustomPieChart from '@/components/chart/CustomPieChart';
import Heading from '@/components/text/Heading';
import { useGetUsersWithPagination } from '@/services/userManagement.service';

const SocialLoginChart = () => {
  const { data: kakao, isFetching: kakaoLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    isConnectedKakao: true,
  });
  const { data: naver, isFetching: naverLoading } = useGetUsersWithPagination({
    page: undefined,
    limit: 1,
    status: 'ACTIVE',
    onboardingComplete: true,
    isConnectedNaver: true,
  });

  const chartData = [
    { name: '카카오', value: kakao?.pages[0]?.totalCount ?? 0 },
    { name: '네이버', value: naver?.pages[0]?.totalCount ?? 0 },
  ];

  const isLoading = kakaoLoading || naverLoading;

  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">
        소셜 로그인
      </Heading.h4>
      <CustomPieChart
        data={chartData}
        dataKey="value"
        isLoading={isLoading}
        colors={['#F2DA00', '#34A634']}
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

export default SocialLoginChart;
