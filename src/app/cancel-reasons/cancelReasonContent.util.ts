export const UNKNOWN_REASON = '미분류';
export const UNKNOWN_DETAIL = '상세 미입력';

interface ParsedCancelReasonContent {
  reservationId: string;
  reason: string;
  detail: string;
}

const extractValue = (content: string, key: string) => {
  const regex = new RegExp(
    `(?:^|,\\s*)${key}\\s*:\\s*([\\s\\S]*?)(?=,\\s*[a-zA-Z]+\\s*:|$)`,
    'i',
  );
  return regex.exec(content)?.[1]?.trim();
};

export const parseCancelReasonContent = (
  content: string,
): ParsedCancelReasonContent => {
  const reservationId =
    extractValue(content, 'reservationId') ??
    content.split(', ')?.[0]?.split(': ')?.[1]?.trim() ??
    '';
  const reason =
    extractValue(content, 'reason') ??
    content.split(', ')?.[1]?.split(': ')?.[1]?.trim() ??
    UNKNOWN_REASON;
  const detail =
    extractValue(content, 'details') ??
    extractValue(content, 'detail') ??
    content.split(', ')?.[2]?.split(': ')?.slice(1).join(': ')?.trim() ??
    UNKNOWN_DETAIL;

  return {
    reservationId,
    reason: reason || UNKNOWN_REASON,
    detail: detail || UNKNOWN_DETAIL,
  };
};
