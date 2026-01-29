import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  calculateQueryStartDate,
  calculateQueryEndDate,
  calculateDateRangeForPeriod,
  calculateNextDateRange,
  calculatePrevDateRange,
  isNextDateDisabled,
  isPrevDateDisabled,
  isAllTimeRange,
} from './dateNavigation.util';

dayjs.extend(isoWeek);

describe('dateNavigation.util', () => {
  // Mock 'today' to be a fixed date for consistent testing
  // Let's say today is 2025-05-15 (Thursday)
  const MOCK_TODAY = '2025-05-15';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs(MOCK_TODAY).toDate());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculateQueryStartDate', () => {
    it('should return formatted startDate if provided', () => {
      const start = dayjs('2025-01-01');
      expect(calculateQueryStartDate('일간', start)).toBe('2025-01-01');
    });

    it('should calculate correct start date for "일간" (Daily)', () => {
      // Yesterday: 2025-05-14
      // Daily default: 30 days ago from yesterday (inclusive? logic says yesterday.subtract(29, 'day'))
      // 2025-05-14 minus 29 days = 2025-04-15
      const expected = dayjs('2025-05-14')
        .subtract(29, 'day')
        .format('YYYY-MM-DD');
      expect(calculateQueryStartDate('일간', null)).toBe(expected);
    });

    it('should calculate correct start date for "주간" (Weekly)', () => {
      // Yesterday: 2025-05-14
      // Weekly default: yesterday.subtract(11, 'week').startOf('isoWeek')
      const yesterday = dayjs('2025-05-14');
      const expected = yesterday
        .subtract(11, 'week')
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
      expect(calculateQueryStartDate('주간', null)).toBe(expected);
    });

    it('should calculate correct start date for "월간" (Monthly)', () => {
      // Yesterday: 2025-05-14
      // Monthly default: yesterday.subtract(5, 'month').startOf('month')
      const yesterday = dayjs('2025-05-14');
      const expected = yesterday
        .subtract(5, 'month')
        .startOf('month')
        .format('YYYY-MM-DD');
      expect(calculateQueryStartDate('월간', null)).toBe(expected);
    });
  });

  describe('calculateQueryEndDate', () => {
    it('should return formatted endDate if provided', () => {
      const end = dayjs('2025-05-01');
      expect(calculateQueryEndDate(end)).toBe('2025-05-01');
    });

    it('should return yesterday if endDate is null', () => {
      const expected = dayjs('2025-05-14').format('YYYY-MM-DD');
      expect(calculateQueryEndDate(null)).toBe(expected);
    });
  });

  describe('calculateDateRangeForPeriod', () => {
    it('should return correct range for "일간"', () => {
      const { startDate, endDate } = calculateDateRangeForPeriod('일간');
      const yesterday = dayjs('2025-05-14');
      expect(endDate.format('YYYY-MM-DD')).toBe(yesterday.format('YYYY-MM-DD'));
      expect(startDate.format('YYYY-MM-DD')).toBe(
        yesterday.subtract(29, 'day').format('YYYY-MM-DD'),
      );
    });

    it('should return correct range for "주간"', () => {
      const { startDate, endDate } = calculateDateRangeForPeriod('주간');
      const yesterday = dayjs('2025-05-14');
      expect(endDate.format('YYYY-MM-DD')).toBe(yesterday.format('YYYY-MM-DD'));
      // Logic uses startOf('isoWeek')
      expect(startDate.format('YYYY-MM-DD')).toBe(
        yesterday.subtract(11, 'week').startOf('isoWeek').format('YYYY-MM-DD'),
      );
    });

    it('should return correct range for "월간"', () => {
      const { startDate, endDate } = calculateDateRangeForPeriod('월간');
      const yesterday = dayjs('2025-05-14');
      expect(endDate.format('YYYY-MM-DD')).toBe(yesterday.format('YYYY-MM-DD'));
      expect(startDate.format('YYYY-MM-DD')).toBe(
        yesterday.subtract(5, 'month').startOf('month').format('YYYY-MM-DD'),
      );
    });
  });

  describe('Navigation Logic', () => {
    const start = dayjs('2025-05-01');
    const end = dayjs('2025-05-05'); // 5 days duration (inclusive 1,2,3,4,5)

    it('calculateNextDateRange should shift forward by duration', () => {
      const { startDate, endDate } = calculateNextDateRange(start, end);
      // Diff is 4 days + 1 = 5 days.
      // New start: 05-01 + 5 = 05-06
      // New end: 05-05 + 5 = 05-10
      expect(startDate.format('YYYY-MM-DD')).toBe('2025-05-06');
      expect(endDate.format('YYYY-MM-DD')).toBe('2025-05-10');
    });

    it('calculatePrevDateRange should shift backward by duration', () => {
      const { startDate, endDate } = calculatePrevDateRange(start, end);
      // New start: 05-01 - 5 = 04-26
      // New end: 05-05 - 5 = 04-30
      expect(startDate.format('YYYY-MM-DD')).toBe('2025-04-26');
      expect(endDate.format('YYYY-MM-DD')).toBe('2025-04-30');
    });
  });

  describe('Disabled State Logic', () => {
    // Today is 2025-05-15, Yesterday is 2025-05-14

    it('isNextDateDisabled should be true if next range exceeds yesterday', () => {
      // Current range ending on yesterday (2025-05-14)
      const start = dayjs('2025-05-10');
      const end = dayjs('2025-05-14');
      // Next range would start 2025-05-15 (future/today) -> Disabled
      expect(isNextDateDisabled(start, end)).toBe(true);
    });

    it('isNextDateDisabled should be false if next range is within allowed past', () => {
      // Current range ending way back
      const start = dayjs('2025-01-01');
      const end = dayjs('2025-01-05');
      // Next range ends 2025-01-10 -> Safe
      expect(isNextDateDisabled(start, end)).toBe(false);
    });

    it('isPrevDateDisabled should be true if prev range starts before minDate', () => {
      const MIN_DATE = '2025-01-01';
      // Current range: 2025-01-02 to 2025-01-03 (2 days)
      const start = dayjs('2025-01-02');
      const end = dayjs('2025-01-03');
      // Prev range would be 2024-12-31 to 2025-01-01
      // Start (24-12-31) < MIN_DATE (25-01-01) -> Disabled
      expect(isPrevDateDisabled(start, end, MIN_DATE)).toBe(true);
    });

    it('isPrevDateDisabled should be false if prev range is valid', () => {
      const MIN_DATE = '2025-01-01';
      const start = dayjs('2025-02-01');
      const end = dayjs('2025-02-05');
      expect(isPrevDateDisabled(start, end, MIN_DATE)).toBe(false);
    });
  });

  describe('isAllTimeRange', () => {
    const MIN_DATE = '2025-01-01';

    it('should return true if range matches minDate and yesterday', () => {
      const start = dayjs(MIN_DATE);
      const end = dayjs('2025-05-14'); // Yesterday
      expect(isAllTimeRange(start, end, MIN_DATE)).toBe(true);
    });

    it('should return false if range does not match', () => {
      const start = dayjs(MIN_DATE);
      const end = dayjs('2025-05-13'); // Not yesterday
      expect(isAllTimeRange(start, end, MIN_DATE)).toBe(false);
    });
  });
});
