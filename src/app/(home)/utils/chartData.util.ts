import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { FilterPeriod } from '../types/types';

dayjs.extend(weekOfYear);

export const processChartData = (
  data: { date: string; value: number }[] | undefined,
  period: FilterPeriod,
) => {
  if (!data) return [];

  // 일간: 30일 -> "YYYY-MM-DD"
  if (period === '일간') {
    return data.map((d) => {
      const dateObj = dayjs(d.date);
      return {
        date: dateObj.format('YYYY-MM-DD'),
        value: d.value,
      };
    });
  }

  // 주간: 12주 -> "M월 W주" (1월 첫째 주거나 첫 번째 인덱스인 경우 "YY년 MM월 W주")
  if (period === '주간') {
    const aggregatedData: Record<string, { value: number; dateObj: Dayjs }> =
      {};

    data.forEach((d) => {
      const dateObj = dayjs(d.date);
      const year = dateObj.year();
      const week = dateObj.week();
      const key = `${year}-${week}`;

      if (!aggregatedData[key]) {
        aggregatedData[key] = { value: 0, dateObj };
      }
      aggregatedData[key].value += d.value;
    });

    return Object.values(aggregatedData).map(({ value, dateObj }, index) => {
      const weekOfMonth = Math.ceil(dateObj.date() / 7);
      const month = dateObj.month() + 1;
      let label = `${month}월 ${weekOfMonth}주`;

      if (index === 0) {
        label = `${dateObj.format('YY')}년 ${dateObj.format('MM')}월 ${String(weekOfMonth).padStart(2, '0')}주`;
      } else if (month === 1 && weekOfMonth === 1) {
        label = `${dateObj.format('YY')}년 ${label}`;
      }

      return {
        date: label,
        value,
      };
    });
  }

  // 전체 또는 월간 -> 월별 그룹화
  // 포맷: "M월" (1월이거나 첫 번째 인덱스인 경우 "YY년 MM월")
  const monthlyMap = new Map<string, number>();
  const monthlyDateObjs = new Map<string, Dayjs>();

  data.forEach((d) => {
    const dateObj = dayjs(d.date);
    // 연도 구분을 위해 키는 YYYY-MM 형식이어야 함
    const key = dateObj.format('YYYY-MM');

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, 0);
      monthlyDateObjs.set(key, dateObj);
    }
    monthlyMap.set(key, monthlyMap.get(key)! + d.value);
  });

  return Array.from(monthlyMap.entries()).map(([key, value], index) => {
    const dateObj = monthlyDateObjs.get(key)!;
    const month = dateObj.month() + 1;
    let label = `${month}월`;

    if (index === 0) {
      label = dateObj.format('YY년 MM월');
    } else if (month === 1) {
      label = `${dateObj.format('YY')}년 ${label}`;
    }

    return {
      date: label,
      value,
    };
  });
};
