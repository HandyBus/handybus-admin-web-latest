export const UNKNOWN_REASON = '미분류';
export const UNKNOWN_DETAIL = '상세 미입력';

export interface ParsedCancelReasonContent {
  reservationId: string | null;
  reason: string;
  detail: string;
}

const LABEL_VALUE_PATTERN =
  /(?:^|,\s*)([^:,]+?)\s*:\s*([\s\S]*?)(?=,\s*[^:,]+?\s*:|$)/g;

const normalizeKey = (key: string) =>
  key
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

const parseLabelValuePairs = (content: string): Map<string, string> => {
  const map = new Map<string, string>();
  LABEL_VALUE_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null = null;
  while ((match = LABEL_VALUE_PATTERN.exec(content))) {
    const key = normalizeKey(match[1]);
    const value = match[2].trim();
    if (key && value) {
      map.set(key, value);
    }
  }

  return map;
};

export const parseCancelReasonContent = (
  content: string,
): ParsedCancelReasonContent => {
  const pairs = parseLabelValuePairs(content);

  return {
    reservationId: pairs.get('reservationid') ?? null,
    reason: pairs.get('취소사유') || UNKNOWN_REASON,
    detail:
      pairs.get('취소사유상세') ??
      pairs.get('기타의견') ??
      pairs.get('상세기타의견') ??
      UNKNOWN_DETAIL,
  };
};
