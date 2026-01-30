import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useElasticityMetricsData } from './useElasticityMetricsData';

// 타입 모킹
interface ComparisonQueryProps {
  queryKey: string[];
  fetcher: (startDate: string, endDate: string) => Promise<unknown>;
  currentStartDate: string;
  currentEndDate: string;
  prevStartDate: string;
  prevEndDate: string;
  enabled: boolean;
}

// useComparisonQuery 모킹
const mockUseComparisonQuery = vi.fn();

vi.mock('@/app/(home)/hooks/useComparisonQuery', () => ({
  useComparisonQuery: (props: ComparisonQueryProps) =>
    mockUseComparisonQuery(props),
}));

// 종속성이 있는 실제 임포트 실패를 방지하기 위해 서비스 모킹
vi.mock('@/services/analytics.service', () => ({
  getDailyExploreMetrics: vi.fn(),
  getWeeklyExploreMetrics: vi.fn(),
  getMonthlyExploreMetrics: vi.fn(),
  getDailyCoreMetrics: vi.fn(),
  getWeeklyCoreMetrics: vi.fn(),
  getMonthlyCoreMetrics: vi.fn(),
}));

describe('useElasticityMetricsData', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 오늘 날짜 고정: 2025-01-01
    vi.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const setupMockData = (
    scenario: 'positive' | 'negative' | 'zero' | 'mixed',
  ) => {
    // 메트릭 데이터 생성 헬퍼
    const createMetric = (val: number, date: string) => [
      {
        pageReachUserCount: val,
        participationUserCount: val,
        date,
        week: date,
        month: date,
      },
    ];

    mockUseComparisonQuery.mockImplementation(
      ({ queryKey }: ComparisonQueryProps) => {
        const key = queryKey[0] as string;

        // --- 일간 데이터 모킹 ---
        // 필요한 데이터: 현재(T), 이전(T-1), 전전(T-2)
        // Elasticity(T) = (CoreT/CoreT-1) / (ExploreT/ExploreT-1)
        // Elasticity(T-1) = (CoreT-1/CoreT-2) / (ExploreT-1/ExploreT-2)

        // 계산하기 쉬운 값으로 정의합니다.
        // 시나리오: 양의 성장
        // T: Core 440, Explore 200
        // T-1: Core 200, Explore 200
        // T-2: Core 100, Explore 200

        // T vs T-1: Core 성장 440/200 = 2.2, Explore 1 => Elast(T) = 2.2
        // T-1 vs T-2: Core 성장 200/100 = 2.0, Explore 1 => Elast(T-1) = 2.0
        // 변화율: (2.2 - 2.0) / 2.0 = 0.1 = 10%

        let tCore = 0,
          tExplore = 0;
        let tm1Core = 0,
          tm1Explore = 0;
        let tm2Core = 0,
          tm2Explore = 0;

        if (scenario === 'positive') {
          tCore = 440;
          tExplore = 200;
          tm1Core = 200;
          tm1Explore = 200;
          tm2Core = 100;
          tm2Explore = 200;
        } else if (scenario === 'negative') {
          // T: Core 180, Explore 200
          // T-1: Core 200, Explore 200
          // T-2: Core 100, Explore 200

          // T vs T-1: Core 0.9, Explore 1 => Elast(T) = 0.9
          // T-1 vs T-2: Core 2.0, Explore 1 => Elast(T-1) = 2.0
          // 변화율: (0.9 - 2.0) / 2.0 = -1.1 / 2 = -0.55 = -55%
          tCore = 180;
          tExplore = 200;
          tm1Core = 200;
          tm1Explore = 200;
          tm2Core = 100;
          tm2Explore = 200;
        }

        // queryKey 식별자에 따른 매핑

        // 최근 (현재 vs 이전)
        if (key.includes('daily-core') && !key.includes('-pre')) {
          // 현재(T)와 이전(T-1) 반환
          return {
            currentData: createMetric(tCore, '2025-01-01'),
            prevData: createMetric(tm1Core, '2024-12-31'),
          };
        }
        if (key.includes('daily-explore') && !key.includes('-pre')) {
          // 현재(T)와 이전(T-1) 반환
          return {
            currentData: createMetric(tExplore, '2025-01-01'),
            prevData: createMetric(tm1Explore, '2024-12-31'),
          };
        }

        // 이전 (이전 vs 전전) - 새로 추가된 호출
        // 참고: 훅에서는 'cardPreStartDate'를 현재로 사용합니다.
        // 따라서 여기서 'currentData'는 실질적으로 T-1 (위 로직의 Prev)에 해당하고, 'prevData'는 T-2에 해당합니다.
        if (key.includes('daily-core-elasticity-card-pre')) {
          return {
            // 이 특정 쿼리에 대해 훅 로직에서 currentData는 무시됩니다.
            // 구조 분해 할당에서 prevData만 추출합니다: const { prevData: prePreDailyCore } ...
            // 하지만 useComparisonQuery는 둘 다 반환합니다.
            // 훅은 current=PreDate, prev=PrePreDate로 호출합니다.
            // 따라서 여기서 'prevData'는 T-2입니다.
            currentData: createMetric(tm1Core, '2024-12-31'),
            prevData: createMetric(tm2Core, '2024-12-30'),
          };
        }
        if (key.includes('daily-explore-elasticity-card-pre')) {
          return {
            currentData: createMetric(tm1Explore, '2024-12-31'),
            prevData: createMetric(tm2Explore, '2024-12-30'),
          };
        }

        // 주간/월간도 필요한 경우 유사한 로직 가정, 또는 기본값 반환
        return { currentData: [], prevData: [] };
      },
    );
  };

  it('should calculate positive percentage change correctly for Daily DAU', () => {
    setupMockData('positive');

    const { result } = renderHook(() =>
      useElasticityMetricsData({
        currentStartDate: '2025-01-01',
        currentEndDate: '2025-01-01',
        selectedUnit: '일간',
      }),
    );

    const dauMetric = result.current.processedMetrics.find(
      (m) => m.id === 'elasticityDAU',
    );

    // Elasticity(T) = 2.2
    // Elasticity(T-1) = 2.0
    // 변화율 = (2.2 - 2.0) / 2.0 = 0.1 = 10.0%

    expect(dauMetric).toBeDefined();
    expect(dauMetric?.value).toBe('2.20');
    expect(dauMetric?.percentage).toBe('10.0%');
  });

  it('should calculate negative percentage change correctly for Daily DAU', () => {
    setupMockData('negative');

    const { result } = renderHook(() =>
      useElasticityMetricsData({
        currentStartDate: '2025-01-01',
        currentEndDate: '2025-01-01',
        selectedUnit: '일간',
      }),
    );

    const dauMetric = result.current.processedMetrics.find(
      (m) => m.id === 'elasticityDAU',
    );

    // Elasticity(T) = 0.9
    // Elasticity(T-1) = 2.0
    // 변화율 = (0.9 - 2.0) / 2.0 = -0.55 = -55.0%

    expect(dauMetric).toBeDefined();
    expect(dauMetric?.value).toBe('0.90');
    expect(dauMetric?.percentage).toBe('-55.0%');
  });

  it('should handle division by zero (previous elasticity 0) gracefully', () => {
    // T-1 탄력성을 0으로 설정
    // T-1: Core 100, CorePrev(T-2) 100 => Growth 1
    // T-1: Explore 100, ExplorePrev(T-2) 1000 => Growth 0.1
    // Elast(T-1) = 1 / 0.1 = 10.

    // 0으로 설정

    mockUseComparisonQuery.mockImplementation(() => {
      // PrePre에 대해 빈 데이터 또는 0 반환
      return {
        currentData: [{ pageReachUserCount: 100, participationUserCount: 100 }],
        prevData: [{ pageReachUserCount: 0, participationUserCount: 0 }],
      };
    });

    const { result } = renderHook(() =>
      useElasticityMetricsData({
        currentStartDate: '2025-01-01',
        currentEndDate: '2025-01-01',
        selectedUnit: '일간',
      }),
    );

    const dauMetric = result.current.processedMetrics.find(
      (m) => m.id === 'elasticityDAU',
    );

    // PrevData가 0이면 탄력성 계산은 0을 반환합니다 (내부적으로 0 나누기 방지 또는 0 반환).
    // calculatePercentage는 'previous === 0'일 때 '-'를 반환하는지 확인합니다.

    expect(dauMetric?.percentage).toBe('-');
  });
});
