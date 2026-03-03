import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FilterPeriod, ChartDataItem } from '../types/types';

dayjs.extend(isoWeek);

export const processChartData = (
  data: { date: string; value: number }[] | undefined,
  period: FilterPeriod,
): ChartDataItem[] => {
  if (!data) return [];

  // 일간: 30일 -> "YYYY-MM-DD"
  if (period === '일간') {
    return data.map((d) => {
      const dateObj = dayjs(d.date);
      return {
        date: dateObj.format('YYYY-MM-DD'),
        value: d.value,
        _rawDate: dateObj.format('YYYY-MM-DD'), // 정렬용 원본 날짜
      };
    });
  }

  // 주간: 12주 -> "M월 W주" (1월 첫째 주거나 첫 번째 인덱스인 경우 "YY년 MM월 W주")
  if (period === '주간') {
    const aggregatedData: Record<string, { value: number; dateObj: Dayjs }> =
      {};

    data.forEach((d) => {
      const dateObj = dayjs(d.date);
      // ISO 주 기준 (월~일) 으로 그룹핑 — 나머지 코드의 isoWeek 사용과 일관성 유지
      const key = dateObj.startOf('isoWeek').format('YYYY-MM-DD');

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
        _rawDate: dateObj.format('YYYY-MM-DD'), // 정렬용 원본 날짜 (해당 주의 대표 날짜)
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
      _rawDate: dateObj.format('YYYY-MM-DD'), // 정렬용 원본 날짜
    };
  });
};

/**
 * 여러 개의 차트 데이터를 날짜 기준으로 병합합니다.
 * @param datasets 병합할 데이터셋 목록. 각 항목은 { key: string, data: ChartDataItem[] } 형태여야 합니다.
 * @returns 병합된 데이터 배열. { date: string, [key1]: number, [key2]: number, ... } 형태
 */
export const mergeChartData = (
  datasets: { key: string; data: ChartDataItem[] }[],
): ChartDataItem[] => {
  if (!datasets || datasets.length === 0) return [];

  const mergedDataMap = new Map<string, ChartDataItem>();

  // reservation, cancel 두개의 데이터를 하나의 집합에 담기위해서 아래처럼 진행
  datasets.forEach((dataset) => {
    dataset.data.forEach((item) => {
      if (!mergedDataMap.has(item.date)) {
        mergedDataMap.set(item.date, {
          date: item.date,
          _rawDate: item._rawDate, // _rawDate 보존 (있는 경우)
        });
      }
      const currentObj = mergedDataMap.get(item.date)!;

      if ('value' in item) {
        currentObj[dataset.key] = item.value;
      }
      // 혹시 나중에 들어온 항목에 _rawDate가 있고 기존에 없었다면 업데이트 (보통은 동일 라벨이면 동일 rawDate일 것임)
      if (item._rawDate && !currentObj._rawDate) {
        currentObj._rawDate = item._rawDate;
      }
    });
  });

  // 날짜순 정렬 후 반환 (선택 사항, 차트의 X축 정렬을 위해 권장)
  return Array.from(mergedDataMap.values()).sort((a, b) => {
    // _rawDate가 있으면 그것으로 비교
    if (a._rawDate && b._rawDate) {
      return String(a._rawDate).localeCompare(String(b._rawDate));
    }
    // 없으면 기존대로 라벨 비교 (fallback)
    return a.date.localeCompare(b.date);
  });
};

/**
 * 현재 진행 중인 미완성 기간(이번 주/이번 달)의 데이터를 차트에서 제거합니다.
 * 주간/월간 필터 시 아직 완료되지 않은 현재 기간이 불완전한 수치로 표시되는 것을 방지합니다.
 */
export const filterCurrentIncompletePeriod = (
  data: ChartDataItem[],
  period: FilterPeriod,
): ChartDataItem[] => {
  if (period === '일간' || !data.length) return data;

  const now = dayjs();

  return data.filter((item) => {
    if (!item._rawDate) return true;
    const rawDate = dayjs(String(item._rawDate));

    if (period === '주간') {
      // 현재 ISO 주에 속하는 데이터 제거
      return (
        rawDate.startOf('isoWeek').format('YYYY-MM-DD') !==
        now.startOf('isoWeek').format('YYYY-MM-DD')
      );
    }

    // 월간: 현재 달에 속하는 데이터 제거
    return rawDate.format('YYYY-MM') !== now.format('YYYY-MM');
  });
};
