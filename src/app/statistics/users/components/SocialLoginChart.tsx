'use client';

import ChartBox from '@/components/chart/ChartSection';
import CustomPieChart from '@/components/chart/CustomPieChart';

interface Props {
  data: { name: string; value: number }[];
  isLoading: boolean;
}

const SocialLoginChart = ({ data, isLoading }: Props) => {
  return (
    <ChartBox title="소셜 로그인 방식">
      <CustomPieChart
        data={data}
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
    </ChartBox>
  );
};

export default SocialLoginChart;
