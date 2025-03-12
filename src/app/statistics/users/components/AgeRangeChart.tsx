'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomPieChart from '@/components/chart/CustomPieChart';
import { AgeRange, Gender } from '@/types/user.type';
import Stringifier from '@/utils/stringifier.util';

interface Props {
  data: {
    name: string;
    value: number;
    additionalData: {
      ageRange: AgeRange;
      gender: Gender;
      totalCount: number;
    }[];
  }[];
  isLoading: boolean;
}

const AgeRangeChart = ({ data, isLoading }: Props) => {
  return (
    <ChartBox title="연령대">
      <CustomPieChart
        data={data}
        dataKey="value"
        isLoading={isLoading}
        renderTooltip={(data) => (
          <div className="min-w-100 rounded-[4px] border border-grey-200 bg-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
            <h5 className="text-14 font-500">{data.name}</h5>
            {data.additionalData.map((item) => (
              <p key={item.gender} className="text-12 text-grey-700">
                {Stringifier.gender(item.gender)} ({item.totalCount}건)
              </p>
            ))}
          </div>
        )}
      />
    </ChartBox>
  );
};

export default AgeRangeChart;
