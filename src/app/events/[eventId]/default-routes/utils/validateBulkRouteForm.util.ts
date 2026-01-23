import { BulkRouteFormValues } from '../form.type';

/**
 * 폼 데이터를 검증합니다.
 */
export const validateBulkRouteForm = (
  data: BulkRouteFormValues,
): { isValid: boolean; errorMessage?: string } => {
  if (!data.selectedDailyEventIds || data.selectedDailyEventIds.length === 0) {
    return {
      isValid: false,
      errorMessage: '노선을 생성할 일자를 선택해주세요.',
    };
  }

  if (!data.destinationHub) {
    return {
      isValid: false,
      errorMessage: '도착지를 선택해주세요.',
    };
  }

  if (!data.toDestinationArrivalTime || !data.fromDestinationDepartureTime) {
    return {
      isValid: false,
      errorMessage: '도착지 도착/출발 시간을 입력해주세요.',
    };
  }

  if (data.routes.length === 0) {
    return {
      isValid: false,
      errorMessage: '생성할 노선이 없습니다.',
    };
  }

  return { isValid: true };
};
