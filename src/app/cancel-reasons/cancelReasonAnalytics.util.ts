import type { AdminFeedbackResponseModel } from '@/types/feedback.type';
import {
  parseCancelReasonContent,
  UNKNOWN_DETAIL,
  UNKNOWN_REASON,
} from './cancelReasonContent.util';

export interface ChartData {
  name: string;
  value: number;
}

interface CancelReasonChartData {
  reasonChartData: ChartData[];
  detailChartDataByReason: Record<string, ChartData[]>;
}

const sortChartData = (countByName: Record<string, number>): ChartData[] => {
  return Object.entries(countByName)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
};

export const filterCancelReasonFeedbacks = (
  feedbacks: AdminFeedbackResponseModel[] | undefined,
) => {
  return (
    feedbacks
      ?.filter((feedback) => feedback.subject.includes('취소 사유'))
      .toReversed() ?? []
  );
};

export const buildCancelReasonChartData = (
  feedbacks: AdminFeedbackResponseModel[],
): CancelReasonChartData => {
  const reasonCountByName: Record<string, number> = {};
  const detailCountByReason: Record<string, Record<string, number>> = {};

  for (const feedback of feedbacks) {
    const parsed = parseCancelReasonContent(feedback.content);
    const reason = parsed?.reason ?? UNKNOWN_REASON;
    const detail = parsed?.detail ?? UNKNOWN_DETAIL;

    reasonCountByName[reason] = (reasonCountByName[reason] ?? 0) + 1;
    detailCountByReason[reason] ??= {};
    detailCountByReason[reason][detail] =
      (detailCountByReason[reason][detail] ?? 0) + 1;
  }

  const detailChartDataByReason = Object.fromEntries(
    Object.entries(detailCountByReason).map(([reason, detailCountByName]) => [
      reason,
      sortChartData(detailCountByName),
    ]),
  ) as Record<string, ChartData[]>;

  return {
    reasonChartData: sortChartData(reasonCountByName),
    detailChartDataByReason,
  };
};
