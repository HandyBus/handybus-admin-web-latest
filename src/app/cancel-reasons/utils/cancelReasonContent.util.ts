export const UNKNOWN_REASON = '미분류';
export const UNKNOWN_DETAIL = '상세 미입력';

export interface ParsedCancelReasonContent {
  reservationId: string | null;
  reason: string;
  detail: string;
  parseStatus: 'parsed' | 'partial' | 'fallback';
}

interface ParsedLabelValue {
  key: string;
  value: string;
}

const LABEL_VALUE_PATTERN =
  /(?:^|,\s*)([^:,]+?)\s*:\s*([\s\S]*?)(?=,\s*[^:,]+?\s*:|$)/g;

const RESERVATION_KEY_ALIASES = [
  'reservationid',
  'reservation',
  '예약id',
  '예약번호',
  '예약',
];
const DETAIL_KEY_ALIASES = [
  'detail',
  'details',
  '상세',
  '상세사유',
  '상세내용',
  '내용',
];
const REASON_KEY_ALIASES = ['reason', 'cancelreason', '취소사유', '사유'];

const normalizeLabelKey = (key: string) => {
  return key
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
};

const parseLabelValuePairs = (content: string): ParsedLabelValue[] => {
  const pairs: ParsedLabelValue[] = [];
  LABEL_VALUE_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null = null;
  while ((match = LABEL_VALUE_PATTERN.exec(content))) {
    const normalizedKey = normalizeLabelKey(match[1]);
    const value = match[2].trim();

    if (normalizedKey && value) {
      pairs.push({
        key: normalizedKey,
        value,
      });
    }
  }

  return pairs;
};

const parsePositionalValues = (content: string): string[] => {
  return content
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      if (!token.includes(':')) {
        return token.trim();
      }
      return token.split(':').slice(1).join(':').trim();
    })
    .filter(Boolean);
};

const includesAlias = (key: string, aliases: string[]) => {
  return aliases.some((alias) => key === alias || key.includes(alias));
};

export const parseCancelReasonContent = (
  content: string,
): ParsedCancelReasonContent => {
  if (!content.trim()) {
    return {
      reservationId: null,
      reason: UNKNOWN_REASON,
      detail: UNKNOWN_DETAIL,
      parseStatus: 'fallback',
    };
  }

  const labelValuePairs = parseLabelValuePairs(content);
  const positionalValues = parsePositionalValues(content);

  const reservationFromLabel = labelValuePairs.find((pair) =>
    includesAlias(pair.key, RESERVATION_KEY_ALIASES),
  )?.value;
  const detailFromLabel = labelValuePairs.find((pair) =>
    includesAlias(pair.key, DETAIL_KEY_ALIASES),
  )?.value;
  const reasonFromLabel = labelValuePairs.find(
    (pair) =>
      includesAlias(pair.key, REASON_KEY_ALIASES) &&
      !includesAlias(pair.key, DETAIL_KEY_ALIASES),
  )?.value;

  const reservationId = reservationFromLabel ?? positionalValues[0] ?? null;
  const reason = reasonFromLabel ?? positionalValues[1] ?? UNKNOWN_REASON;
  const detail = detailFromLabel ?? positionalValues[2] ?? UNKNOWN_DETAIL;

  let parseStatus: ParsedCancelReasonContent['parseStatus'] = 'fallback';
  if (labelValuePairs.length > 0) {
    parseStatus =
      reservationFromLabel != null &&
      reasonFromLabel != null &&
      detailFromLabel != null
        ? 'parsed'
        : 'partial';
  }

  return {
    reservationId,
    reason: reason || UNKNOWN_REASON,
    detail: detail || UNKNOWN_DETAIL,
    parseStatus,
  };
};
