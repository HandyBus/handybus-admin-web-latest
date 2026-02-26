'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomBarChart from '@/components/chart/CustomBarChart';
import useTable from '@/hooks/useTable';
import { useGetFeedbacks } from '@/services/feedback.service';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import type { AdminFeedbackResponseModel } from '@/types/feedback.type';
import { useEffect, useMemo, useState } from 'react';
import { parseCancelReasonContent } from './cancelReasonContent.util';
import { cancelReasonColumns } from './table.type';

type ChartData = { name: string; value: number };
const DRILL_DOWN_GUIDE_TEXT =
  '막대를 클릭하면 해당 사유의 상세 차트를 볼 수 있습니다.';

const toSortedChartData = (
  countByName: Record<string, number>,
): ChartData[] => {
  return Object.entries(countByName)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
};

const buildCancelReasonChartData = (
  feedbacks: AdminFeedbackResponseModel[],
) => {
  const reasonCountByName: Record<string, number> = {};
  const detailCountByReason: Record<string, Record<string, number>> = {};

  for (const feedback of feedbacks) {
    const { reason, detail } = parseCancelReasonContent(feedback.content);

    reasonCountByName[reason] = (reasonCountByName[reason] ?? 0) + 1;

    if (!detailCountByReason[reason]) {
      detailCountByReason[reason] = {};
    }

    detailCountByReason[reason][detail] =
      (detailCountByReason[reason][detail] ?? 0) + 1;
  }

  const detailChartDataByReason = Object.fromEntries(
    Object.entries(detailCountByReason).map(([reason, detailCountByName]) => [
      reason,
      toSortedChartData(detailCountByName),
    ]),
  ) as Record<string, ChartData[]>;

  return {
    reasonChartData: toSortedChartData(reasonCountByName),
    detailChartDataByReason,
  };
};

const ChartLoadingBars = () => {
  return (
    <div className="gap-3 flex h-full flex-col justify-center px-8">
      <div className="h-8 w-full animate-pulse rounded-[4px] bg-basic-grey-100" />
      <div className="h-8 w-10/12 animate-pulse rounded-[4px] bg-basic-grey-100" />
      <div className="h-8 w-8/12 animate-pulse rounded-[4px] bg-basic-grey-100" />
      <div className="h-8 w-6/12 animate-pulse rounded-[4px] bg-basic-grey-100" />
      <p className="pt-2 text-12 text-basic-grey-500">
        데이터를 불러오는 중입니다.
      </p>
    </div>
  );
};

const Page = () => {
  const { data, isLoading } = useGetFeedbacks();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const cancelReasons = useMemo(() => {
    return (
      data
        ?.filter((feedback) => feedback.subject.includes('취소 사유'))
        .toReversed() ?? []
    );
  }, [data]);

  const { reasonChartData, detailChartDataByReason } = useMemo(
    () => buildCancelReasonChartData(cancelReasons),
    [cancelReasons],
  );
  const selectedReasonDetailChartData = useMemo(() => {
    if (!selectedReason) {
      return [];
    }
    return detailChartDataByReason[selectedReason] ?? [];
  }, [detailChartDataByReason, selectedReason]);

  useEffect(() => {
    if (selectedReason && !detailChartDataByReason[selectedReason]) {
      setSelectedReason(null);
    }
  }, [detailChartDataByReason, selectedReason]);

  const handleReasonBarClick = (reason: string) => {
    setSelectedReason((prev) => (prev === reason ? null : reason));
  };

  const cancelReasonTable = useTable({
    columns: cancelReasonColumns,
    data: cancelReasons,
  });

  return (
    <main className="flex grow flex-col">
      <Heading>예약 취소 사유</Heading>
      <section className="mb-8 flex flex-col gap-4">
        <ChartBox title="취소 사유 분포">
          <div className="mb-2 gap-2 flex flex-wrap items-center justify-between px-4">
            <p className="text-12 text-basic-grey-500">
              {DRILL_DOWN_GUIDE_TEXT}
            </p>
            {selectedReason && (
              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                className="px-2 py-1 rounded-[4px] border border-basic-grey-200 text-12 text-basic-grey-600 hover:bg-basic-grey-100"
              >
                선택 해제
              </button>
            )}
          </div>
          {selectedReason && (
            <div className="mb-2 px-4">
              <span className="px-2 py-1 rounded-full bg-brand-primary-100 text-12 text-brand-primary-600">
                선택된 사유: {selectedReason}
              </span>
            </div>
          )}
          {isLoading ? (
            <ChartLoadingBars />
          ) : reasonChartData.length > 0 ? (
            <CustomBarChart
              data={reasonChartData}
              isLoading={false}
              onBarClick={handleReasonBarClick}
              activeBar={selectedReason}
              barActionLabel={DRILL_DOWN_GUIDE_TEXT}
            />
          ) : (
            <p className="flex h-full items-center justify-center text-14 text-basic-grey-500">
              표시할 취소 사유 데이터가 없습니다.
            </p>
          )}
        </ChartBox>
        {selectedReason && (
          <ChartBox title={`${selectedReason} 상세 사유`}>
            <p className="mb-2 px-4 text-12 text-basic-grey-500">
              선택된 사유에 해당하는 상세 이유 분포입니다.
            </p>
            {isLoading ? (
              <ChartLoadingBars />
            ) : selectedReasonDetailChartData.length > 0 ? (
              <CustomBarChart
                data={selectedReasonDetailChartData}
                isLoading={false}
              />
            ) : (
              <p className="flex h-full items-center justify-center text-14 text-basic-grey-500">
                {selectedReason} 상세 사유 데이터가 없습니다.
              </p>
            )}
          </ChartBox>
        )}
      </section>
      <div className="flex flex-col">
        <BaseTable table={cancelReasonTable} />
      </div>
    </main>
  );
};

export default Page;
