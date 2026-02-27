import { getColorByIndex } from '@/components/chart/chart.util';
import type { ChartData } from '../utils/cancelReasonAnalytics.util';

interface Props {
  data: ChartData[];
}

const CancelReasonDetailList = ({ data }: Props) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ul className="flex grow flex-col gap-4 overflow-y-auto px-4">
      {data.map((item, index) => {
        const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

        return (
          <li
            key={item.name}
            className="flex items-center gap-8 rounded-[4px] border border-basic-grey-100 px-8 py-4"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-full"
              style={{ backgroundColor: getColorByIndex(index) }}
            />
            <span className="grow truncate text-14 text-basic-grey-700">
              {item.name}
            </span>
            <span className="shrink-0 text-14 font-500 text-basic-grey-700">
              {item.value.toLocaleString()}명
            </span>
            <span className="w-40 shrink-0 text-right text-12 text-basic-grey-500">
              {percent}%
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default CancelReasonDetailList;
