'use client';

import ChartBox from '@/components/chart/ChartBox';
import CustomBarChart from '@/components/chart/CustomBarChart';
import useTable from '@/hooks/useTable';
import { useGetFeedbacks } from '@/services/feedback.service';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';
import Loading from '@/components/loading/Loading';
import { useEffect, useMemo, useState } from 'react';
import {
  buildCancelReasonChartData,
  filterCancelReasonFeedbacks,
} from './utils/cancelReasonAnalytics.util';
import { cancelReasonColumns } from './table.type';
import CancelReasonDetailList from './components/CancelReasonDetailList';

const DRILL_DOWN_GUIDE_TEXT =
  '막대를 클릭하면 해당 사유의 상세 차트를 볼 수 있습니다.';

const Page = () => {
  const { data, isLoading } = useGetFeedbacks();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const cancelReasons = useMemo(
    () => filterCancelReasonFeedbacks(data),
    [data],
  );

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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4">
            <p className="text-12 text-basic-grey-500">
              {selectedReason
                ? `선택된 사유: ${selectedReason}`
                : DRILL_DOWN_GUIDE_TEXT}
            </p>
            {selectedReason && (
              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                className="rounded-[4px] border border-basic-grey-200 px-4 py-4 text-12 text-basic-grey-600 hover:bg-basic-grey-100"
              >
                선택 해제
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="flex grow items-center justify-center">
              <Loading />
            </div>
          ) : reasonChartData.length > 0 ? (
            <CustomBarChart
              data={reasonChartData}
              isLoading={false}
              percentMode="total"
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
        <ChartBox
          title={selectedReason ? `${selectedReason} 상세 사유` : '상세 사유'}
        >
          {!selectedReason ? (
            <p className="flex grow items-center justify-center text-14 text-basic-grey-500">
              위 차트에서 사유를 선택하면 상세 내역을 볼 수 있습니다.
            </p>
          ) : isLoading ? (
            <div className="flex grow items-center justify-center">
              <Loading />
            </div>
          ) : selectedReasonDetailChartData.length > 0 ? (
            <CancelReasonDetailList data={selectedReasonDetailChartData} />
          ) : (
            <p className="flex grow items-center justify-center text-14 text-basic-grey-500">
              {selectedReason} 상세 사유 데이터가 없습니다.
            </p>
          )}
        </ChartBox>
      </section>
      <div className="flex flex-col">
        <BaseTable table={cancelReasonTable} />
      </div>
    </main>
  );
};

export default Page;
