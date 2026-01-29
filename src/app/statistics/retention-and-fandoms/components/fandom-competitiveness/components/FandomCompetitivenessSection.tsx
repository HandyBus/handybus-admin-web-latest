'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { InfoIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import dayjs from 'dayjs';
import Loading from '@/components/loading/Loading';
import {
  useGetDailyFandomActivityMetrics,
  useGetDailyFandomSnapshotMetrics,
  useGetMonthlyFandomCrossMetrics,
} from '@/services/analytics.service';

import {
  calculateFandomCompetitiveness,
  FandomCompetitiveness,
} from '../utils/fandomCompetitiveness.util';

const FandomCompetitivenessSection = () => {
  const [mounted, setMounted] = useState(false);
  const [tooltipState, setTooltipState] = useState<{
    show: boolean;
    rect: DOMRect | null;
    details: { artist: string; percent: number }[];
  }>({ show: false, rect: null, details: [] });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FandomCompetitiveness;
    direction: 'asc' | 'desc';
  } | null>(null);

  // 날짜 계산 로직
  const {
    dailyStartDate,
    crossMetricsStartDate,
    endDate,
    yesterday,
    dayBeforeYesterday,
    twoDaysBeforeYesterday,
  } = useMemo(() => {
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const dayBeforeYesterday = yesterday.subtract(1, 'day');
    const twoDaysBeforeYesterday = dayBeforeYesterday.subtract(1, 'day');

    return {
      dailyStartDate: twoDaysBeforeYesterday.format('YYYY-MM-DD'), // 3일치 데이터만 필요 (T, T-1, T-2)
      crossMetricsStartDate: today
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'), // 전월 1일부터 조회
      endDate: yesterday.format('YYYY-MM-DD'),
      yesterday: yesterday.format('YYYY-MM-DD'),
      dayBeforeYesterday: dayBeforeYesterday.format('YYYY-MM-DD'),
      twoDaysBeforeYesterday: twoDaysBeforeYesterday.format('YYYY-MM-DD'),
    };
  }, []);

  // API 쿼리
  const { data: activityData, isLoading: isActivityLoading } =
    useGetDailyFandomActivityMetrics({
      startDate: dailyStartDate,
      endDate,
    });
  const { data: snapshotData, isLoading: isSnapshotLoading } =
    useGetDailyFandomSnapshotMetrics({
      startDate: dailyStartDate,
      endDate,
    });
  const { data: crossMetricsData, isLoading: isCrossMetricsLoading } =
    useGetMonthlyFandomCrossMetrics({
      startDate: crossMetricsStartDate,
      endDate,
    });

  const isLoading =
    isActivityLoading || isSnapshotLoading || isCrossMetricsLoading;

  // 데이터 가공
  const processedData: FandomCompetitiveness[] = useMemo(() => {
    return calculateFandomCompetitiveness(
      activityData,
      snapshotData,
      yesterday,
      dayBeforeYesterday,
      twoDaysBeforeYesterday,
      crossMetricsData,
    );
  }, [
    activityData,
    snapshotData,
    crossMetricsData,
    yesterday,
    dayBeforeYesterday,
    twoDaysBeforeYesterday,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSort = (key: keyof FandomCompetitiveness) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'desc'
    ) {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...processedData];
    if (sortConfig) {
      sortableItems.sort((a, b) => {
        const { key, direction } = sortConfig;

        const getSortValue = (
          item: FandomCompetitiveness,
          sortKey: keyof FandomCompetitiveness,
        ): number | string => {
          if (sortKey === 'inflowMix') {
            // 믹스 항목의 '신규' 비율 기준 정렬
            return item.inflowMix.new;
          }
          if (sortKey === 'crossInterest') {
            return item.crossInterest.percent;
          }
          if (sortKey === 'crossInterestDetails') {
            return 0; // Not sortable
          }
          return item[sortKey] as number | string;
        };

        const aValue = getSortValue(a, key);
        const bValue = getSortValue(b, key);

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [processedData, sortConfig]);

  const renderSortIcon = (key: keyof FandomCompetitiveness) => {
    if (sortConfig?.key !== key) {
      return (
        <div className="ml-4 flex size-12 flex-col">
          <ArrowUpIcon size={12} className="text-basic-grey-400" />
          <ArrowDownIcon size={12} className="text-basic-grey-400" />
        </div>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUpIcon size={12} className="ml-4 inline text-basic-black" />
    ) : (
      <ArrowDownIcon size={12} className="ml-4 inline text-basic-black" />
    );
  };

  const headers: {
    label: string;
    key: keyof FandomCompetitiveness;
    width?: string;
  }[] = [
    { label: '순위', key: 'rank' },
    { label: '아티스트', key: 'artist' },
    { label: '팬덤 별 유저 수', key: 'fandomUserCount' },
    { label: '팬덤 유저 증감률', key: 'userGrowthRate' },
    { label: '재참여율', key: 'reparticipationRate' },
    { label: '재참여 주기', key: 'reparticipationCycle' },
    { label: '재예매율', key: 'rebookingRate' },
    { label: '재예매 주기', key: 'rebookingCycle' },
    { label: '재탑승 주기', key: 'reboardingCycle' },
    {
      label: '팬덤 내 신규 유저 유입 변화율',
      key: 'newInflowChangeRate',
      width: 'w-[240px]',
    },
    { label: '월간 팬덤 교차 지표 (지난 달 기준)', key: 'crossInterest' },
  ];

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-16">
      <h3 className="text-20 font-600 text-basic-black">
        팬덤별 경쟁력 (1일 전 기준, 비교 단위 1일)
      </h3>
      <div className="overflow-x-auto rounded-16 border border-basic-grey-200 bg-basic-white">
        <table className="w-full min-w-[1200px] table-auto text-left">
          <thead className="bg-basic-grey-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  onClick={() => handleSort(header.key)}
                  className={`${header.width || ''} cursor-pointer whitespace-nowrap px-16 py-12 text-12 font-500 text-basic-grey-600 hover:bg-basic-grey-50`}
                >
                  <div
                    className={`flex items-center ${header.key === 'newInflowChangeRate' ? 'w-full justify-between' : 'gap-4'}`}
                  >
                    <div className="flex items-center gap-4">
                      {header.label}
                      {renderSortIcon(header.key)}
                    </div>
                    {header.key === 'newInflowChangeRate' ? (
                      <div className="font-normal ml-8 flex items-center gap-4 text-10">
                        <span className="flex items-center gap-4">
                          <div className="h-[6px] w-[6px] rounded-full bg-[#3B82F6]"></div>
                          <span className="text-basic-grey-600">기존</span>
                        </span>
                        <span className="flex items-center gap-4">
                          <div className="h-[6px] w-[6px] rounded-full bg-[#A855F7]"></div>
                          <span className="text-basic-grey-600">신규</span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-basic-grey-200">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-basic-grey-50">
                <td className="px-16 py-20 text-14 text-basic-grey-600">
                  {String(row.rank).padStart(3, '0')}
                </td>
                <td className="px-16 py-20 text-14 font-600 text-basic-black">
                  {row.artist}
                </td>
                <td className="px-16 py-20 text-14 text-basic-grey-600">
                  {row.fandomUserCount.toLocaleString()}
                </td>
                <td
                  className={`px-16 py-20 text-14 font-600 ${row.userGrowthRate > 0 ? 'text-[#22C55E]' : row.userGrowthRate < 0 ? 'text-basic-red-500' : 'text-basic-grey-600'}`}
                >
                  {row.userGrowthRate > 0 ? '+' : ''}
                  {row.userGrowthRate}%
                </td>
                <td className="px-16 py-20 text-14 font-600 text-[#3B82F6]">
                  {row.reparticipationRate === '-'
                    ? '-'
                    : `${row.reparticipationRate}%`}
                </td>
                <td className="px-16 py-20 text-14 text-basic-grey-600">
                  {row.reparticipationCycle === '-'
                    ? '-'
                    : `${row.reparticipationCycle}일`}
                </td>
                <td className="px-16 py-20 text-14 font-600 text-[#A855F7]">
                  {row.rebookingRate === '-' ? '-' : `${row.rebookingRate}%`}
                </td>
                <td className="px-16 py-20 text-14 text-basic-grey-600">
                  {row.rebookingCycle === '-' ? '-' : `${row.rebookingCycle}일`}
                </td>
                <td className="px-16 py-20 text-14 text-basic-grey-600">
                  {row.reboardingCycle === '-'
                    ? '-'
                    : `${row.reboardingCycle}일`}
                </td>
                {/* ... (rest of the columns) */}
                <td className="px-16 py-20">
                  <div className="flex items-center gap-12">
                    <div className="flex-1">
                      <div className="flex h-8 w-full overflow-hidden rounded-full bg-basic-grey-100">
                        <div
                          className="h-full bg-[#3B82F6]"
                          style={{ width: `${row.inflowMix.existing}%` }}
                        ></div>
                        <div
                          className="h-full bg-[#A855F7]"
                          style={{ width: `${row.inflowMix.new}%` }}
                        ></div>
                      </div>
                      <div className="mt-4 flex justify-between text-10 text-basic-grey-500">
                        <span>{row.inflowMix.existing}%</span>
                        <span>{row.inflowMix.new}%</span>
                      </div>
                    </div>
                    <span
                      className={`whitespace-nowrap text-14 font-600 ${row.newInflowChangeRate > 0 ? 'text-[#22C55E]' : row.newInflowChangeRate < 0 ? 'text-basic-red-500' : 'text-basic-grey-600'}`}
                    >
                      {row.newInflowChangeRate > 0 ? '+' : ''}
                      {row.newInflowChangeRate}%
                    </span>
                  </div>
                </td>
                <td className="px-16 py-20 text-14 font-600 text-basic-black">
                  <div
                    className="flex cursor-help items-center gap-4"
                    onMouseEnter={(e) => {
                      if (row.crossInterestDetails.length > 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipState({
                          show: true,
                          rect,
                          details: row.crossInterestDetails,
                        });
                      }
                    }}
                    onMouseLeave={() =>
                      setTooltipState((prev) => ({ ...prev, show: false }))
                    }
                  >
                    {row.crossInterest.percent > 0 ? (
                      <div className="flex items-center gap-4">
                        <div className="whitespace-normal break-keep">
                          {row.crossInterest.artist}
                        </div>
                        <span className="text-[#3B82F6]">
                          {row.crossInterest.percent}%
                        </span>
                        {row.crossInterestDetails.length > 0 && (
                          <InfoIcon size={14} className="text-basic-grey-400" />
                        )}
                      </div>
                    ) : (
                      <span className="text-basic-grey-400">없음</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 포털 툴팁 */}
      {mounted &&
        tooltipState.show &&
        tooltipState.rect &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50 flex w-[180px] flex-col gap-8 rounded-8 border border-basic-grey-200 bg-basic-white p-12 shadow-md"
            style={{
              top: tooltipState.rect.top - 8,
              left: tooltipState.rect.right,
              transform: 'translateX(-90%) translateY(-100%)',
            }}
          >
            <span className="text-12 font-600 text-basic-grey-600">
              팬덤 교차 지표 상세
            </span>
            <div className="flex flex-col gap-4">
              {tooltipState.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-12"
                >
                  <span className="text-basic-black">{detail.artist}</span>
                  <span className="text-[#3B82F6]">{detail.percent}%</span>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FandomCompetitivenessSection;
