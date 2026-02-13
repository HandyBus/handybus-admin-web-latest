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
    vi.useFakeTimers();
    // 시스템 시간: 2024-02-09
    // -> 최신 데이터 날짜: 2024-02-08 (LOGIC상 -1일)
    // -> 이번 달 1일: 2024-02-01
    // -> 지난 달 1일: 2024-01-01
    vi.setSystemTime(new Date('2024-02-09T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('월간 유저 증감률과 유입 변화율이 올바르게 렌더링되어야 한다', () => {
    const mockSnapshotData = [
      // 이번 달 1일 (2024-02-01)
      {
        artistId: 'artist-1',
        artistName: 'Test Artist',
        date: '2024-02-01',
        cumulativeFandomUserCount: 120, // 증감률: (120-100)/100 = 20%
        fandomNewUserRolling30dCount: 40, // 유입 변화율: (40-20)/20 = 100%
        cumulativeEventReparticipationUserCount: 0,
        cumulativeEventParticipationUserCount: 0,
        cumulativeEventRebookingUserCount: 0,
        cumulativeEventReservationUserCount: 0,
      },
      // 지난 달 1일 (2024-01-01)
      {
        artistId: 'artist-1',
        artistName: 'Test Artist',
        date: '2024-01-01',
        cumulativeFandomUserCount: 100,
        fandomNewUserRolling30dCount: 20,
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
        date: '2024-02-01', // 이번 달 1일 (이제 모든 활동 지표에 사용됨)
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

    render(<FandomCompetitivenessSection />);

    // 아티스트 이름 확인
    expect(screen.getByText('Test Artist')).toBeDefined();

    // 1. 팬덤 유저 증감률 확인 : +20%
    // 텍스트 매칭이 복잡할 수 있으므로 contains로 확인
    const growthElements = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'td' && content.includes('20%');
    });
    // 증감률 컬럼이 있는지 확인 (단순 contains로는 다른 20%와 겹칠 수 있으니 주의)
    // 여기서는 간단히 값 존재 여부만 체크
    expect(growthElements.length).toBeGreaterThan(0);
    expect(growthElements[0].textContent).toContain('+20%');

    // 2. 신규 유저 유입 변화율 확인 : +100%
    const inflowChangeElements = screen.getAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' && content.includes('100%')
      );
    });
    // 변화율은 span으로 감싸져 있음 (+기호 포함)
    const inflowChange = inflowChangeElements.find((el) =>
      el.textContent?.includes('+100%'),
    );
    expect(inflowChange).toBeDefined();
  });
});
