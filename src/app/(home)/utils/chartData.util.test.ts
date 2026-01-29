import { describe, it, expect } from 'vitest';
import { processChartData } from './chartData.util';

describe('processChartData', () => {
  it('should return empty array if data is undefined', () => {
    expect(processChartData(undefined, '일간')).toEqual([]);
  });

  describe('Period: 일간 (Daily)', () => {
    it('should format dates correctly for daily data', () => {
      const data = [
        { date: '2025-01-01', value: 10 },
        { date: '2025-01-02', value: 20 },
        { date: '2025-01-03', value: 30 },
      ];
      const result = processChartData(data, '일간');

      // First item usually gets full format "MM월 DD일"
      expect(result[0].date).toBe('01월 01일');
      expect(result[1].date).toBe('2일');
      expect(result[2].date).toBe('3일');
    });

    it('should show Month/Date on 1st day of month', () => {
      const data = [
        { date: '2025-01-31', value: 10 },
        { date: '2025-02-01', value: 20 },
      ];
      const result = processChartData(data, '일간');

      // Index 0
      expect(result[0].date).toBe('01월 31일');
      // Index 1 (is 1st day) -> should show "2월 1일"
      expect(result[1].date).toBe('2월 1일');
    });
  });

  describe('Period: 주간 (Weekly)', () => {
    it('should aggregate data by week', () => {
      // 2025-01-01 (Wed), 2025-01-02 (Thu) -> Same week (Week 1 of 2025)
      // 2025-01-08 (Wed) -> Next week (Week 2 of 2025)
      const data = [
        { date: '2025-01-01', value: 10 },
        { date: '2025-01-02', value: 20 },
        { date: '2025-01-08', value: 30 },
      ];
      const result = processChartData(data, '주간');

      // Should have 2 entries
      expect(result).toHaveLength(2);

      // First entry: Week 1, sum = 30
      expect(result[0].value).toBe(30);
      // Format: index 0 -> "YY년 MM월 W주"
      // 2025-01-01 is in 1st week of Jan? Math.ceil(1/7) = 1
      expect(result[0].date).toContain('25년 01월 01주');

      // Second entry: Week 2, sum = 30
      expect(result[1].value).toBe(30);
      // Format: "M월 W주"
      expect(result[1].date).toBe('1월 2주');
    });
  });

  describe('Period: 월간 (Monthly) or others', () => {
    it('should aggregate data by month', () => {
      const data = [
        { date: '2025-01-01', value: 10 },
        { date: '2025-01-15', value: 20 }, // Same month
        { date: '2025-02-01', value: 30 }, // Next month
      ];
      const result = processChartData(data, '월간');

      expect(result).toHaveLength(2);

      // Jan: sum 30
      expect(result[0].value).toBe(30);
      // Index 0 format: "YY년 MM월"
      expect(result[0].date).toBe('25년 01월');

      // Feb: value 30
      expect(result[1].value).toBe(30);
      // Format: "M월"
      expect(result[1].date).toBe('2월');
    });

    it('should show year if month is January', () => {
      // Data spanning Dec to Jan
      const data = [
        { date: '2024-12-01', value: 10 },
        { date: '2025-01-01', value: 20 },
      ];
      const result = processChartData(data, '월간');

      // Dec
      expect(result[0].date).toBe('24년 12월');
      // Jan -> Should include Year
      // Logic: if month === 1 -> `${YY}년 ${M월}`
      // 2025-01 -> "25년 1월"
      expect(result[1].date).toBe('25년 1월');
    });
  });
});
