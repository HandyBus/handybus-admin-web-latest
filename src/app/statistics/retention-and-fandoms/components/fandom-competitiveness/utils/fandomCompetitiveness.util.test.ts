import { describe, it, expect } from 'vitest';
import { calculateFandomCompetitiveness } from './fandomCompetitiveness.util';
import {
  DailyFandomActivityMetricsViewEntity,
  DailyFandomSnapshotMetricsViewEntity,
} from '@/types/analytics.type';

describe('팬덤 경쟁력 계산 로직', () => {
  const thisMonthFirst = '2024-02-01'; // 이번 달 1일 (모든 지표의 기준)
  const lastMonthFirst = '2024-01-01'; // 지난 달 1일 (비교 기준)

  const mockActivity: DailyFandomActivityMetricsViewEntity[] = [
    {
      date: '2024-02-01', // 이번 달 1일 (모든 활동 지표의 기준)
      artistId: 'A1',
      artistName: 'Artist A',
      reservationUserCount: 0,
      participationUserCount: 0,
      eventReparticipationUserCount: 0,
      eventRebookingUserCount: 0,
      averageUserEventReparticipationHours: 24, // 1일
      averageUserEventRebookingHours: 48, // 2일
      averageUserReboardingDays: 5,
    },
    {
      date: '2024-02-08', // 최신 데이터 (무시되어야 함)
      artistId: 'A1',
      artistName: 'Artist A',
      reservationUserCount: 0,
      participationUserCount: 0,
      eventReparticipationUserCount: 0,
      eventRebookingUserCount: 0,
      averageUserEventReparticipationHours: 999, // 무시되어야 함
      averageUserEventRebookingHours: 999, // 무시되어야 함
      averageUserReboardingDays: 999, // 무시되어야 함
    },
  ];

  const mockSnapshot: DailyFandomSnapshotMetricsViewEntity[] = [
    // This Month 1st (모든 지표 기준)
    {
      date: '2024-02-01',
      artistId: 'A1',
      artistName: 'Artist A',
      cumulativeFandomUserCount: 1000,
      fandomNewUserRolling30dCount: 100, // 신규 비중 10% (100/1000)
      cumulativeEventParticipationUserCount: 500,
      cumulativeEventReparticipationUserCount: 50, // 재참여율 10%
      cumulativeEventReservationUserCount: 200,
      cumulativeEventRebookingUserCount: 40, // 재예매율 20%
      createdAt: '',
      updatedAt: '',
    },
    // Last Month 1st (비교 기준)
    {
      date: '2024-01-01',
      artistId: 'A1',
      artistName: 'Artist A',
      cumulativeFandomUserCount: 900, // 증감률: (1000-900)/900 = 11.1%
      fandomNewUserRolling30dCount: 50, // 유입 변화율: (100-50)/50 = 100%
      cumulativeEventParticipationUserCount: 0,
      cumulativeEventReparticipationUserCount: 0,
      cumulativeEventReservationUserCount: 0,
      cumulativeEventRebookingUserCount: 0,
      createdAt: '',
      updatedAt: '',
    },
    // 최신 데이터 스냅샷 (무시되어야 함)
    {
      date: '2024-02-08',
      artistId: 'A1',
      artistName: 'Artist A',
      cumulativeFandomUserCount: 1050,
      fandomNewUserRolling30dCount: 110,
      cumulativeEventParticipationUserCount: 600,
      cumulativeEventReparticipationUserCount: 60,
      cumulativeEventReservationUserCount: 300,
      cumulativeEventRebookingUserCount: 60,
      createdAt: '',
      updatedAt: '',
    },
  ];

  const mockCrossMetrics = [
    // 최신 월 데이터 (2024-01-01) - 계산에 사용되어야 함
    {
      month: '2024-01-01',
      baseArtistId: 'A1',
      baseArtistName: 'Artist A',
      targetArtistId: 'B1',
      targetArtistName: 'Artist B',
      overlapFandomCount: 150, // 150/1000 = 15%
      createdAt: '',
      updatedAt: '',
    },
    {
      month: '2024-01-01',
      baseArtistId: 'C1',
      baseArtistName: 'Artist C',
      targetArtistId: 'A1', // A1이 target인 경우
      targetArtistName: 'Artist A',
      overlapFandomCount: 50, // 50/1000 = 5%
      createdAt: '',
      updatedAt: '',
    },
  ];

  it('모든 메트릭이 이번 달 1일 데이터를 기준으로 계산되어야 한다', () => {
    const result = calculateFandomCompetitiveness(
      mockActivity,
      mockSnapshot,
      thisMonthFirst,
      lastMonthFirst,
      mockCrossMetrics,
    );

    expect(result).toHaveLength(1);
    const artist = result[0];

    expect(artist.artist).toBe('Artist A');

    // 1. 팬덤 유저 수 (이번 달 1일 기준)
    expect(artist.fandomUserCount).toBe(1000); // 1050(최신)이 아님

    // 2. 유저 증감률 ( (1000-900)/900 * 100 = 11.11... -> 11.1 )
    expect(artist.userGrowthRate).toBe(11.1);

    // 3. 재참여율 ( 50 / 500 * 100 = 10.0 ) - 이번 달 1일 기준
    expect(artist.reparticipationRate).toBe(10.0); // 최신이 아님

    // 4. 재예매율 ( 40 / 200 * 100 = 20.0 ) - 이번 달 1일 기준
    expect(artist.rebookingRate).toBe(20.0); // 최신이 아님

    // 5. 활동 주기 - 이번 달 1일 기준
    expect(artist.reparticipationCycle).toBe(1.0); // 999가 아님
    expect(artist.rebookingCycle).toBe(2.0); // 999가 아님
    expect(artist.reboardingCycle).toBe(5); // 999가 아님

    // 6. 유입 믹스 (이번 달 1일 기준)
    // 신규(Rolling30): 100, 전체: 1000 -> 10%
    expect(artist.inflowMix.new).toBe(10.0);
    expect(artist.inflowMix.existing).toBe(90.0);

    // 7. 신규 유입 변화율 (월간 Rolling30 비교)
    // 이번 달 1일 Rolling30 = 100
    // 지난 달 1일 Rolling30 = 50
    // 변화율 = (100 - 50) / 50 * 100 = 100%
    expect(artist.newInflowChangeRate).toBe(100.0);

    // 8. 교차 지표
    expect(artist.crossInterest.artist).toBe('Artist B');
    expect(artist.crossInterest.percent).toBe(15.0);
  });

  it('교차 지표가 0%인 데이터는 필터링되어야 한다', () => {
    const zeroCrossMetrics = [
      {
        month: '2024-01-01',
        baseArtistId: 'A1',
        baseArtistName: 'Artist A',
        targetArtistId: 'E1',
        targetArtistName: 'Artist E',
        overlapFandomCount: 0, // 0% 겹침
        createdAt: '',
        updatedAt: '',
      },
    ];

    const result = calculateFandomCompetitiveness(
      mockActivity,
      mockSnapshot,
      thisMonthFirst,
      lastMonthFirst,
      zeroCrossMetrics,
    );

    const artist = result[0];

    // 상세 내역에서 제외되어 빈 배열이어야 함
    expect(artist.crossInterest.artist).toBe('-');
    expect(artist.crossInterest.percent).toBe(0);
    expect(artist.crossInterestDetails).toHaveLength(0);
  });

  it('활동 데이터가 없어도 스냅샷 기준으로 행이 생성되고, 관련 지표는 "-"로 표시되어야 한다', () => {
    // Activity Data is empty
    const result = calculateFandomCompetitiveness(
      [],
      mockSnapshot,
      thisMonthFirst,
      lastMonthFirst,
      undefined,
    );

    expect(result).toHaveLength(1);
    const artist = result[0];

    // Snapshot based metrics should exist
    expect(artist.artist).toBe('Artist A');
    expect(artist.fandomUserCount).toBe(1000); // 2월 1일 기준
    expect(artist.userGrowthRate).toBe(11.1);

    // Activity based metrics should be '-'
    expect(artist.reparticipationRate).toBe('-');
    expect(artist.rebookingRate).toBe('-');
    expect(artist.reparticipationCycle).toBe('-');
    expect(artist.rebookingCycle).toBe('-');
    expect(artist.reboardingCycle).toBe('-');
  });

  it('데이터가 없을 경우 빈 배열을 반환해야 한다 (Snapshot도 없는 경우)', () => {
    const result = calculateFandomCompetitiveness(
      [],
      [],
      thisMonthFirst,
      lastMonthFirst,
      undefined,
    );
    expect(result).toEqual([]);
  });
});
