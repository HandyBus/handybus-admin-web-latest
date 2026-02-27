export const UNKNOWN_REASON = '미분류';
export const UNKNOWN_DETAIL = '상세 미입력';

export interface ParsedCancelReasonContent {
  reservationId?: string;
  reason?: string;
  detail?: string;
}

interface LabeledSegment {
  key: string;
  valueStartIndex: number;
  keyStartIndex: number;
}

const KEY_PATTERN = /(?:^|,\s*)([a-zA-Z]+)\s*:/g;

const parseLabeledSegments = (content: string): LabeledSegment[] => {
  const segments: LabeledSegment[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = KEY_PATTERN.exec(content))) {
    segments.push({
      key: match[1],
      keyStartIndex: match.index,
      valueStartIndex: KEY_PATTERN.lastIndex,
    });
  }

  return segments;
};

const parseContentByLabel = (content: string) => {
  const segments = parseLabeledSegments(content);
  if (segments.length === 0) {
    return null;
  }

  const valuesByLabel: Record<string, string> = {};

  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    const next = segments[i + 1];
    const rawValue = content.slice(
      current.valueStartIndex,
      next?.keyStartIndex ?? content.length,
    );
    const value = rawValue.replace(/^,\s*/, '').trim();

    if (value) {
      valuesByLabel[current.key.toLowerCase()] = value;
    }
  }

  return valuesByLabel;
};

export const parseCancelReasonContent = (
  content: string,
): ParsedCancelReasonContent | null => {
  if (!content.trim()) {
    return null;
  }

  const valuesByLabel = parseContentByLabel(content);
  if (!valuesByLabel) {
    return null;
  }

  const parsed: ParsedCancelReasonContent = {
    reservationId: valuesByLabel.reservationid,
    reason: valuesByLabel.reason,
    detail: valuesByLabel.details ?? valuesByLabel.detail,
  };

  const hasAnyValue = Object.values(parsed).some((value) => value != null);
  if (!hasAnyValue) {
    return null;
  }

  return parsed;
};
