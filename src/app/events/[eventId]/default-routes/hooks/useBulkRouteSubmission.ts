import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { BulkRouteFormValues } from '../form.type';
import { usePostShuttleRoute } from '@/services/shuttleRoute.service';
import { createShuttleRouteRequest } from '../utils/createShuttleRouteRequest.util';
import { validateBulkRouteForm } from '../utils/validateBulkRouteForm.util';

interface UseBulkRouteSubmissionProps {
  eventId: string;
  dailyEvents: Array<{
    dailyEventId: string;
    date: string;
    status: string;
  }>;
}

/**
 * 노선 일괄 제출 로직을 관리하는 훅입니다.
 */
export const useBulkRouteSubmission = ({
  eventId,
  dailyEvents,
}: UseBulkRouteSubmissionProps) => {
  const router = useRouter();
  const { mutateAsync: postRoute } = usePostShuttleRoute();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBulkRoutes = async (data: BulkRouteFormValues) => {
    if (
      !confirm(
        '노선을 생성하시겠습니까? 노선 생성 후 가격 변동은 자제해주세요.\n\n*최대 3분이 소요됩니다.\n*완료 메시지가 표시될 때까지 **절대** 사이트를 끄지 말아주세요.',
      )
    ) {
      return;
    }

    const validation = validateBulkRouteForm(data);
    if (!validation.isValid) {
      alert(validation.errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      // 각 daily event에 대해 노선 생성
      for (const dailyEventId of data.selectedDailyEventIds) {
        const dailyEvent = dailyEvents.find(
          (de) => de.dailyEventId === dailyEventId,
        );
        if (!dailyEvent) continue;

        const dailyEventDate = dailyEvent.date;
        const reservationDeadline = dayjs(dailyEventDate)
          .subtract(data.reservationDeadlineDays, 'day')
          .toISOString();

        // 각 노선에 대해 생성
        for (const route of data.routes) {
          const body = createShuttleRouteRequest(
            route,
            dailyEventDate,
            reservationDeadline,
            data.toDestinationArrivalTime ?? undefined,
            data.fromDestinationDepartureTime ?? undefined,
          );

          await postRoute({
            eventId,
            dailyEventId,
            body,
          });
        }
      }

      router.push(`/events`);
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      alert(
        '노선 추가 과정에서 오류가 발생했습니다.\n' +
          (error instanceof Error && error.message),
      );
    }
  };

  return {
    submitBulkRoutes,
    isSubmitting,
  };
};
