import { describe, expect, it } from 'vitest';
import {
  parseCancelReasonContent,
  UNKNOWN_DETAIL,
  UNKNOWN_REASON,
} from './cancelReasonContent.util';

describe('parseCancelReasonContent', () => {
  it('영문 key 형식을 파싱한다', () => {
    const parsed = parseCancelReasonContent(
      'reservationId: 123, reason: 단순 변심, details: 일정 충돌',
    );

    expect(parsed).toEqual({
      reservationId: '123',
      reason: '단순 변심',
      detail: '일정 충돌',
      parseStatus: 'parsed',
    });
  });

  it('한글 key 형식을 파싱한다', () => {
    const parsed = parseCancelReasonContent(
      '예약번호: 456, 취소 사유: 가격 부담, 상세 내용: 기타 문의',
    );

    expect(parsed).toEqual({
      reservationId: '456',
      reason: '가격 부담',
      detail: '기타 문의',
      parseStatus: 'parsed',
    });
  });

  it('상세 key가 없으면 기본 상세값으로 보정한다', () => {
    const parsed = parseCancelReasonContent(
      'reservationId: 789, reason: 단순 변심',
    );

    expect(parsed).toEqual({
      reservationId: '789',
      reason: '단순 변심',
      detail: UNKNOWN_DETAIL,
      parseStatus: 'partial',
    });
  });

  it('라벨 파싱이 어려우면 위치 기반 fallback을 사용한다', () => {
    const parsed = parseCancelReasonContent(
      'id: 111, 사유: 일정 변경, 내용: 갑작스런 일정',
    );

    expect(parsed).toEqual({
      reservationId: '111',
      reason: '일정 변경',
      detail: '갑작스런 일정',
      parseStatus: 'partial',
    });
  });

  it('빈 문자열은 fallback 결과를 반환한다', () => {
    const parsed = parseCancelReasonContent('');

    expect(parsed).toEqual({
      reservationId: null,
      reason: UNKNOWN_REASON,
      detail: UNKNOWN_DETAIL,
      parseStatus: 'fallback',
    });
  });
});
