'use client';

import CustomPieChart from '@/components/chart/CustomPieChart';
import Heading from '@/components/text/Heading';
import { AgeRange, Gender } from '@/types/user.type';

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

const GenderChart = ({ data, isLoading }: Props) => {
  return (
    <article className="flex h-300 flex-col rounded-[4px] border border-grey-200 bg-white p-4">
      <Heading.h4 className="text-14 font-600 text-grey-900">성별</Heading.h4>
      <CustomPieChart
        data={data}
        dataKey="value"
        isLoading={isLoading}
        colors={['#3980fa', '#ed4e4e']}
        renderTooltip={(data) => (
          <div className="min-w-100 rounded-[4px] border border-grey-200 bg-white p-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
            <h5 className="text-14 font-500">{data.name}</h5>
            {data.additionalData.map((item) => (
              <p key={item.ageRange} className="text-12 text-grey-700">
                {item.ageRange} ({item.totalCount}건)
              </p>
            ))}
          </div>
        )}
      />
    </article>
  );
};

export default GenderChart;
