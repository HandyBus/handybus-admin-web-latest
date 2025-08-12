'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomPieChart from '@/components/chart/CustomPieChart';

interface Props {
  data: { name: string; value: number }[];
  isLoading: boolean;
}

const MarketingConsentChart = ({ data, isLoading }: Props) => {
  return (
    <ChartBox title="마케팅 동의 여부">
      <CustomPieChart
        data={data}
        dataKey="value"
        isLoading={isLoading}
        colors={['#3980fa', '#ed4e4e']}
        renderTooltip={(data) => (
          <div className="min-w-100 rounded-[4px] border border-basic-grey-200 bg-basic-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
            <h5 className="text-14 font-500">{data.name}</h5>
            <p className="text-12 text-basic-grey-700">
              {data.value}건 ({data.value}건)
            </p>
          </div>
        )}
      />
    </ChartBox>
  );
};

export default MarketingConsentChart;
