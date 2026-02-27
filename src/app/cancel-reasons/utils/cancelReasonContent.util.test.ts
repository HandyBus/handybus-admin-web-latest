import { describe, expect, it } from 'vitest';
import {
  parseCancelReasonContent,
  UNKNOWN_DETAIL,
  UNKNOWN_REASON,
} from './cancelReasonContent.util';

describe('parseCancelReasonContent', () => {
  it('단순 취소 사유를 파싱한다', () => {
    const parsed = parseCancelReasonContent(
      'ReservationId: 605676973477335170, 취소 사유: 단순 변심',
    );

    expect(parsed).toEqual({
      reservationId: '605676973477335170',
      reason: '단순 변심',
      detail: UNKNOWN_DETAIL,
    });
  });

  it('취소 사유 상세가 포함된 경우를 파싱한다', () => {
    const parsed = parseCancelReasonContent(
      'ReservationId: 605676973477335170, 취소 사유: 다른 셔틀을 이용하려고요., 취소 사유 상세: 출발지/도착지가 더 가까워요.',
    );

    expect(parsed).toEqual({
      reservationId: '605676973477335170',
      reason: '다른 셔틀을 이용하려고요.',
      detail: '출발지/도착지가 더 가까워요.',
    });
  });

  it('기타 의견이 포함된 경우를 파싱한다', () => {
    const parsed = parseCancelReasonContent(
      'ReservationId: 605676973477335170, 취소 사유: 기타, 기타 의견: 카카오탈래요',
    );

    expect(parsed).toEqual({
      reservationId: '605676973477335170',
      reason: '기타',
      detail: '카카오탈래요',
    });
  });

  it('상세 기타 의견이 포함된 경우를 파싱한다', () => {
    const parsed = parseCancelReasonContent(
      'ReservationId: 605676973477335170, 취소 사유: 다른 셔틀을 이용하려고요., 취소 사유 상세: 기타, 상세 기타 의견: fsadfds',
    );

    expect(parsed).toEqual({
      reservationId: '605676973477335170',
      reason: '다른 셔틀을 이용하려고요.',
      detail: '기타',
    });
  });

  it('빈 문자열은 기본값을 반환한다', () => {
    const parsed = parseCancelReasonContent('');

    expect(parsed).toEqual({
      reservationId: null,
      reason: UNKNOWN_REASON,
      detail: UNKNOWN_DETAIL,
    });
  });

  it('label:value 형식이 아닌 문자열은 기본값을 반환한다', () => {
    const parsed = parseCancelReasonContent('수요조사왜안되냐고ㅠ');

    expect(parsed).toEqual({
      reservationId: null,
      reason: UNKNOWN_REASON,
      detail: UNKNOWN_DETAIL,
    });
  });
});
