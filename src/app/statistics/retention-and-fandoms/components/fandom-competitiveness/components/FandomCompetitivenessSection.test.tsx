import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FandomCompetitivenessSection from './FandomCompetitivenessSection';

// 서비스 Mocking
const mockUseGetDailyFandomActivityMetrics = vi.fn();
const mockUseGetDailyFandomSnapshotMetrics = vi.fn();
const mockUseGetMonthlyFandomCrossMetrics = vi.fn();

vi.mock('@/services/analytics.service', () => ({
  useGetDailyFandomActivityMetrics: (...args: unknown[]) =>
    mockUseGetDailyFandomActivityMetrics(...args),
  useGetDailyFandomSnapshotMetrics: (...args: unknown[]) =>
    mockUseGetDailyFandomSnapshotMetrics(...args),
  useGetMonthlyFandomCrossMetrics: (...args: unknown[]) =>
    mockUseGetMonthlyFandomCrossMetrics(...args),
}));

// ResizeObserver Mocking (컴포넌트 크기 측정 시 필요)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('FandomCompetitivenessSection', () => {
  beforeEach(() => {
    // 고정 날짜 설정: 2024-05-15 (수요일)
    // 오늘: 2024-05-15
    // 어제 (대상): 2024-05-14
    // 그저께 (이전): 2024-05-13
    // 2일 전 (이전2): 2024-05-12
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-02-20'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders new user inflow change rate correctly when data exists', () => {
    // Mock 데이터 설정
    // 시나리오:
    // T-2 (2024-02-18): 100명
    // T-1 (2024-02-19): 110명 (일간 신규 = 10명)
    // T   (2024-02-20): 125명 (일간 신규 = 15명)
    // 성장률 = (15 - 10) / 10 * 100 = 50%
    // 가급적 util 테스트와 일관성을 유지하기 위해 2024-02-20을 대상일로 사용합니다.

    const mockSnapshotData = [
      {
        artistId: 'artist-1',
        artistName: 'Test Artist',
        date: '2024-02-18', // T-2
        cumulativeFandomUserCount: 100,
        fandomNewUserRolling30dCount: 30,
        cumulativeEventReparticipationUserCount: 0,
        cumulativeEventParticipationUserCount: 0,
        cumulativeEventRebookingUserCount: 0,
        cumulativeEventReservationUserCount: 0,
      },
      {
        artistId: 'artist-1',
        artistName: 'Test Artist',
        date: '2024-02-19', // T-1
        cumulativeFandomUserCount: 110,
        fandomNewUserRolling30dCount: 35,
        cumulativeEventReparticipationUserCount: 0,
        cumulativeEventParticipationUserCount: 0,
        cumulativeEventRebookingUserCount: 0,
        cumulativeEventReservationUserCount: 0,
      },
      {
        artistId: 'artist-1',
        artistName: 'Test Artist',
        date: '2024-02-20', // T (Target)
        cumulativeFandomUserCount: 125,
        fandomNewUserRolling30dCount: 40,
        cumulativeEventReparticipationUserCount: 0,
        cumulativeEventParticipationUserCount: 0,
        cumulativeEventRebookingUserCount: 0,
        cumulativeEventReservationUserCount: 0,
      },
    ];

    const mockActivityData = [
      {
        artistId: 'artist-1',
        artistName: 'Test Artist',
        date: '2024-02-20',
        averageUserEventReparticipationHours: 0,
        averageUserEventRebookingHours: 0,
        averageUserReboardingDays: 0,
      },
    ];

    mockUseGetDailyFandomActivityMetrics.mockReturnValue({
      data: mockActivityData,
      isLoading: false,
    });

    mockUseGetDailyFandomSnapshotMetrics.mockReturnValue({
      data: mockSnapshotData,
      isLoading: false,
    });

    mockUseGetMonthlyFandomCrossMetrics.mockReturnValue({
      data: [],
      isLoading: false,
    });

    // FandomCompetitivenessSection의 날짜를 조정해야 합니다.
    // 컴포넌트 하드코딩:
    // startDate: '2024-02-12',
    // endDate: 어제(yesterday) 날짜 (YYYY-MM-DD 형식)
    //
    // 시스템 시간이 2024-02-20인 경우:
    // 어제 = 2024-02-19
    // 컴포넌트 코드상:
    // const today = dayjs();
    // const yesterday = today.subtract(1, 'day');
    // ...

    // 대상일(Target Date)을 2024-02-20으로 설정하려면 '어제'가 2024-02-20이어야 합니다.
    // 따라서 '오늘'은 2024-02-21로 설정해야 합니다.

    // 시스템 시간을 2024-02-21로 설정합니다.
    vi.setSystemTime(new Date('2024-02-21'));

    render(<FandomCompetitivenessSection />);

    // 아티스트 이름이 렌더링되는지 확인
    expect(screen.getByText('Test Artist')).toBeDefined();

    // Check for "Test Artist"

    // 시나리오 요약:
    // 대상일 (어제, 2월 20일): 125명
    // 이전 (2월 19일): 110명
    // 전전 (2월 18일): 100명
    // 일간 신규 T: 15명
    // 일간 신규 T-1: 10명
    // 비율: (15-10)/10 = 50%

    // 기대 결과: "+50%"
    // 텍스트가 여러 부분으로 나뉘어 렌더링될 수 있으므로 포함 여부를 확인합니다.
    // 컴포넌트 렌더링 예: <span>+</span>50% 등
    // 실제 코드: {row.newInflowChangeRate > 0 ? '+' : ''}{row.newInflowChangeRate}%

    const changeRateElement = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' && content.includes('50%')
      );
    });
    expect(changeRateElement).toBeDefined();
    expect(changeRateElement.textContent).toContain('+50%');
  });
});
