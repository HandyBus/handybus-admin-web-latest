'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomBarChart from '@/components/chart/CustomBarChart';

const UserFunnelChart = () => {
  const data = [
    { name: '전체', value: 100 },
    { name: '온보딩 완료', value: 80 },
    { name: '수요조사 완료', value: 60 },
    { name: '예약 완료', value: 40 },
    { name: '리뷰 작성 완료', value: 20 },
  ];

  return (
    <ChartBox title="유저 참여 현황">
      <CustomBarChart data={data} />
    </ChartBox>
  );
};

export default UserFunnelChart;
