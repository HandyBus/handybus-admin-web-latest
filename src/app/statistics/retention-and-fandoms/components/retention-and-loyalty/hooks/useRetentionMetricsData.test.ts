import { describe, it, expect } from 'vitest';
import {
  hoursToDays,
  safeRate,
  calculateDailyMetrics,
  calculateSingleDayMetrics,
} from './useRetentionMetricsData';
import {
  DailyRetentionMetricsReadModel,
  DailyCoreMetricsViewEntity,
} from '@/types/analytics.type';

describe('통계 데이터 가공 로직 테스트', () => {
  // 1. Helper Functions Test
  describe('hoursToDays (시간 -> 일 변환)', () => {
    it('0 또는 undefined 입력 시 0을 반환해야 한다', () => {
      expect(hoursToDays(0)).toBe(0);
      expect(hoursToDays(undefined as unknown as number)).toBe(0);
    });

    it('시간을 일 단위로 정확히 변환해야 한다 (24시간 -> 1.0일)', () => {
      expect(hoursToDays(24)).toBe(1.0);
      expect(hoursToDays(12)).toBe(0.5);
      expect(hoursToDays(36)).toBe(1.5);
    });

    it('소수점 첫째 자리까지 반올림해야 한다', () => {
      // 10시간 / 24 = 0.41666... -> 0.4
      expect(hoursToDays(10)).toBe(0.4);
    });
  });

  describe('safeRate (비율 계산)', () => {
    it('분모가 0이거나 없을 때 0을 반환해야 한다 (Divide by Zero 방지)', () => {
      expect(safeRate(100, 0)).toBe(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(safeRate(100, undefined as any)).toBe(0);
    });

    it('백분율을 정확히 계산해야 한다', () => {
      expect(safeRate(10, 100)).toBe(10.0);
      expect(safeRate(50, 200)).toBe(25.0);
    });

    it('소수점 첫째 자리까지 반올림해야 한다', () => {
      // 1/3 * 100 = 33.333... -> 33.3
      expect(safeRate(1, 3)).toBe(33.3);
    });
  });

  // 2. calculateDailyMetrics Test
  describe('calculateDailyMetrics (일별 차트 데이터 계산)', () => {
    const mockRetention: DailyRetentionMetricsReadModel[] = [
      {
        date: '2024-01-01',
        eventReparticipationUserCount: 10,
        averageUserEventReparticipationHours: 24,
        eventRebookingUserCount: 5,
        averageUserEventRebookingHours: 48,
        averageUserReboardingDays: 3,
        cumulativeEventReparticipationUserCount: 100,
        cumulativeEventRebookingUserCount: 50,
      },
      {
        date: '2024-01-02',
        eventReparticipationUserCount: 20,
        averageUserEventReparticipationHours: 12,
        eventRebookingUserCount: 10,
        averageUserEventRebookingHours: 24,
        averageUserReboardingDays: 2,
        cumulativeEventReparticipationUserCount: 200,
        cumulativeEventRebookingUserCount: 100,
      },
    ];

    const mockCore: DailyCoreMetricsViewEntity[] = [
      {
        date: '2024-01-01',
        participationUserCount: 100,
        reservationUserCount: 50,
        demandUserCount: 0,
        firstParticipationUserCount: 50,
        firstReservationUserCount: 25,
        firstDemandUserCount: 0,
        dailyCoreMetricsByEvent: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        date: '2024-01-02',
        participationUserCount: 200,
        reservationUserCount: 100,
        demandUserCount: 0,
        firstParticipationUserCount: 100,
        firstReservationUserCount: 50,
        firstDemandUserCount: 0,
        dailyCoreMetricsByEvent: [],
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      },
    ];

    it('정상적인 데이터가 입력되었을 때 모든 지표가 정확히 계산되어야 한다', () => {
      const result = calculateDailyMetrics(mockRetention, mockCore);

      expect(result).toHaveLength(2);

      // 1월 1일 검증
      expect(result[0].date).toBe('2024-01-01');
      expect(result[0].reparticipationRate).toBe(10.0); // 10/100 * 100
      expect(result[0].reparticipationCycle).toBe(1.0); // 24/24
      expect(result[0].rebookingRate).toBe(10.0); // 5/50 * 100
      expect(result[0].rebookingCycle).toBe(2.0); // 48/24

      // 1월 2일 검증
      expect(result[1].date).toBe('2024-01-02');
      expect(result[1].reparticipationRate).toBe(10.0); // 20/200 * 100
      expect(result[1].reparticipationCycle).toBe(0.5); // 12/24
    });

    it('Core 데이터가 누락된 경우 안전하게 0으로 처리되어야 한다', () => {
      const result = calculateDailyMetrics(mockRetention, []); // Core 데이터 없음

      expect(result).toHaveLength(2);
      expect(result[0].reparticipationRate).toBe(0); // 분모 0 -> 0%
      expect(result[0].rebookingRate).toBe(0); // 분모 0 -> 0%

      // 주기는 Retention 데이터만 있으면 계산 가능
      expect(result[0].reparticipationCycle).toBe(1.0);
    });

    it('빈 배열 입력 시 빈 배열을 반환해야 한다', () => {
      expect(calculateDailyMetrics([], [])).toEqual([]);
    });
  });

  // 3. calculateSingleDayMetrics Test
  describe('calculateSingleDayMetrics (단일 지표 카드 데이터 계산)', () => {
    const singleRetention: DailyRetentionMetricsReadModel = {
      date: '2024-01-01',
      eventReparticipationUserCount: 30,
      averageUserEventReparticipationHours: 36,
      eventRebookingUserCount: 15,
      averageUserEventRebookingHours: 72,
      averageUserReboardingDays: 5,
      cumulativeEventReparticipationUserCount: 300,
      cumulativeEventRebookingUserCount: 150,
    };

    const singleCore: DailyCoreMetricsViewEntity = {
      date: '2024-01-01',
      participationUserCount: 100,
      reservationUserCount: 50,
      demandUserCount: 0,
      firstParticipationUserCount: 50,
      firstReservationUserCount: 25,
      firstDemandUserCount: 0,
      dailyCoreMetricsByEvent: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('단일 객체에 대해 정확한 계산을 수행해야 한다', () => {
      const result = calculateSingleDayMetrics(singleRetention, singleCore);

      expect(result.reparticipationRate).toBe(30.0); // 30/100 * 100
      expect(result.reparticipationCycle).toBe(1.5); // 36/24
      expect(result.rebookingRate).toBe(30.0); // 15/50 * 100
      expect(result.rebookingCycle).toBe(3.0); // 72/24
      expect(result.reboardingCycle).toBe(5);
    });

    it('데이터가 undefined일 때 모든 필드가 0인 객체를 반환해야 한다', () => {
      const result = calculateSingleDayMetrics(undefined, undefined);

      expect(result).toEqual({
        reparticipationRate: 0,
        reparticipationCycle: 0,
        rebookingRate: 0,
        rebookingCycle: 0,
        reboardingCycle: 0,
      });
    });
  });
});
