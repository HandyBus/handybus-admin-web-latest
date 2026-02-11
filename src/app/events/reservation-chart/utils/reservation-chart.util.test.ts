import { describe, it, expect } from 'vitest';
import {
  aggregateReservationsByDate,
  convertToChartData,
  formatDateToMMDD,
} from './reservation-chart.util';
import type { ReservationPage } from './reservation-chart.util';

describe('aggregateReservationsByDate', () => {
  it('빈 배열을 처리할 수 있어야 한다', () => {
    const result = aggregateReservationsByDate([]);
    expect(result.size).toBe(0);
  });

  it('단일 예약을 정확히 집계해야 한다', () => {
    const pages: ReservationPage[] = [
      {
        reservations: [{ createdAt: '2026-02-11T10:00:00+09:00' }],
      },
    ];

    const result = aggregateReservationsByDate(pages);
    expect(result.get('2026-02-11')).toBe(1);
  });

  it('같은 날짜의 여러 예약을 집계해야 한다', () => {
    const pages: ReservationPage[] = [
      {
        reservations: [
          { createdAt: '2026-02-11T10:00:00+09:00' },
          { createdAt: '2026-02-11T15:30:00+09:00' },
          { createdAt: '2026-02-11T23:59:00+09:00' },
        ],
      },
    ];

    const result = aggregateReservationsByDate(pages);
    expect(result.get('2026-02-11')).toBe(3);
  });

  it('다른 날짜의 예약을 별도로 집계해야 한다', () => {
    const pages: ReservationPage[] = [
      {
        reservations: [
          { createdAt: '2026-02-10T10:00:00+09:00' },
          { createdAt: '2026-02-11T10:00:00+09:00' },
          { createdAt: '2026-02-11T15:00:00+09:00' },
        ],
      },
    ];

    const result = aggregateReservationsByDate(pages);
    expect(result.get('2026-02-10')).toBe(1);
    expect(result.get('2026-02-11')).toBe(2);
  });

  it('여러 페이지의 예약을 집계해야 한다', () => {
    const pages: ReservationPage[] = [
      {
        reservations: [{ createdAt: '2026-02-11T10:00:00+09:00' }],
      },
      {
        reservations: [{ createdAt: '2026-02-11T15:00:00+09:00' }],
      },
    ];

    const result = aggregateReservationsByDate(pages);
    expect(result.get('2026-02-11')).toBe(2);
  });
});

describe('convertToChartData', () => {
  it('빈 맵을 처리할 수 있어야 한다', () => {
    const result = convertToChartData(new Map(), new Map());
    expect(result).toEqual([]);
  });

  it('단일 날짜 데이터를 차트 형식으로 변환해야 한다', () => {
    const allMap = new Map([['2026-02-11', 5]]);
    const cancelMap = new Map([['2026-02-11', 2]]);

    const result = convertToChartData(allMap, cancelMap);

    expect(result).toEqual([
      {
        date: '02.11',
        reservationCount: 5,
        cancelCount: 2,
      },
    ]);
  });

  it('여러 날짜 데이터를 날짜순으로 정렬해야 한다', () => {
    const allMap = new Map([
      ['2026-02-13', 3],
      ['2026-02-11', 5],
      ['2026-02-12', 4],
    ]);
    const cancelMap = new Map([
      ['2026-02-11', 1],
      ['2026-02-13', 2],
    ]);

    const result = convertToChartData(allMap, cancelMap);

    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('02.11');
    expect(result[1].date).toBe('02.12');
    expect(result[2].date).toBe('02.13');
  });

  it('한쪽 맵에만 있는 날짜도 처리해야 한다', () => {
    const allMap = new Map([['2026-02-11', 5]]);
    const cancelMap = new Map([['2026-02-12', 2]]);

    const result = convertToChartData(allMap, cancelMap);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      date: '02.11',
      reservationCount: 5,
      cancelCount: 0,
    });
    expect(result[1]).toEqual({
      date: '02.12',
      reservationCount: 0,
      cancelCount: 2,
    });
  });
});

describe('formatDateToMMDD', () => {
  it('null을 처리할 수 있어야 한다', () => {
    expect(formatDateToMMDD(null)).toBeNull();
  });

  it('유효한 날짜를 MM.DD 포맷으로 변환해야 한다', () => {
    const result = formatDateToMMDD('2026-02-11T10:00:00+09:00');
    expect(result).toBe('02.11');
  });

  it('ISO 형식 날짜를 정확히 변환해야 한다', () => {
    const result = formatDateToMMDD('2026-12-31T23:59:59+09:00');
    expect(result).toBe('12.31');
  });
});
