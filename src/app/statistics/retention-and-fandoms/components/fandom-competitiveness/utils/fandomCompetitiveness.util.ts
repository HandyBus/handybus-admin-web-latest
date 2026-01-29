import {
  DailyFandomActivityMetricsViewEntity,
  DailyFandomSnapshotMetricsViewEntity,
  MonthlyFandomCrossMetricsViewEntity,
} from '@/types/analytics.type';

export type FandomCompetitiveness = {
  rank: number;
  artist: string;
  fandomUserCount: number;
  userGrowthRate: number;
  reparticipationRate: number | string;
  rebookingRate: number | string;
  rebookingCycle: number | string;
  reparticipationCycle: number | string;
  reboardingCycle: number | string;
  inflowMix: { existing: number; new: number };
  newInflowChangeRate: number;
  crossInterest: { artist: string; percent: number };
  crossInterestDetails: { artist: string; percent: number }[];
};

export const hoursToDays = (hours: number) => {
  if (!hours) return 0;
  return parseFloat((hours / 24).toFixed(1));
};

export const safeRate = (numerator: number, denominator: number) => {
  if (!denominator || denominator === 0) return 0;
  return parseFloat(((numerator / denominator) * 100).toFixed(1));
};

export const safeGrowthRate = (current: number, previous: number) => {
  if (!previous || previous === 0) return 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};

export const calculateFandomCompetitiveness = (
  activityData: DailyFandomActivityMetricsViewEntity[] | undefined,
  snapshotData: DailyFandomSnapshotMetricsViewEntity[] | undefined,
  targetDate: string, // yesterday
  prevDate: string, // dayBeforeYesterday
  prev2Date: string, // twoDaysAgo
  crossMetricsData: MonthlyFandomCrossMetricsViewEntity[] | undefined,
): FandomCompetitiveness[] => {
  if (!snapshotData) return [];

  // 교차 지표용 데이터 필터링 (가장 최신 월 기준 - 전월 데이터 우선)
  let targetMonthCrossData: MonthlyFandomCrossMetricsViewEntity[] = [];
  if (crossMetricsData && crossMetricsData.length > 0) {
    // 데이터에 존재하는 월 리스트 (내림차순 정렬)
    const availableMonths = Array.from(
      new Set(crossMetricsData.map((d) => d.month)),
    ).sort((a, b) => (a < b ? 1 : -1));

    // 가장 최신 월 선택 (일반적으로 전월 데이터)
    if (availableMonths.length > 0) {
      const latestMonth = availableMonths[0];
      targetMonthCrossData = crossMetricsData.filter(
        (d) => d.month === latestMonth,
      );
    }
  }

  // 아티스트별 그룹화 (Snapshot 데이터 기준 - Activity가 없어도 행이 나오도록)
  const artistIds = Array.from(new Set(snapshotData.map((d) => d.artistId)));

  const data = artistIds.map((artistId) => {
    // 어제 날짜의 활동 데이터 찾기
    const activity = activityData?.find(
      (d) => d.artistId === artistId && d.date === targetDate,
    );

    // 어제(T), 그제(T-1), 그그제(T-2) 스냅샷 찾기
    const snapshotT = snapshotData.find(
      (d) => d.artistId === artistId && d.date === targetDate,
    );
    const snapshotTMinus1 = snapshotData.find(
      (d) => d.artistId === artistId && d.date === prevDate,
    );
    const snapshotTMinus2 = snapshotData.find(
      (d) => d.artistId === artistId && d.date === prev2Date,
    );

    const artistName =
      snapshotT?.artistName || activity?.artistName || 'Unknown';

    // 1. 팬덤 유저 수 (어제 기준)
    const fandomUserCount = snapshotT?.cumulativeFandomUserCount || 0;
    const fandomUserCountPrev = snapshotTMinus1?.cumulativeFandomUserCount || 0;

    // 2. 유저 증감률 ( (Total(T) - Total(T-1)) / Total(T-1) )
    const userGrowthRate = safeGrowthRate(fandomUserCount, fandomUserCountPrev);

    // 3. 활동 메트릭 (어제 기준)
    // Activity 데이터가 없으면 '-' (0이 아님)
    const reparticipationRate = activity
      ? safeRate(
          snapshotT?.cumulativeEventReparticipationUserCount || 0,
          snapshotT?.cumulativeEventParticipationUserCount || 0,
        )
      : '-';

    const reparticipationCycle = activity
      ? hoursToDays(activity.averageUserEventReparticipationHours || 0)
      : '-';

    const rebookingRate = activity
      ? safeRate(
          snapshotT?.cumulativeEventRebookingUserCount || 0,
          snapshotT?.cumulativeEventReservationUserCount || 0,
        )
      : '-';

    const rebookingCycle = activity
      ? hoursToDays(activity.averageUserEventRebookingHours || 0)
      : '-';

    const reboardingCycle = activity
      ? activity.averageUserReboardingDays || 0
      : '-';

    // 4. 유입 믹스 및 변화율
    // 믹스: "신규" = 30일 이동 유저 수 (신규 구성 비중의 대리 지표)
    const newUsersCount30d = snapshotT?.fandomNewUserRolling30dCount || 0;
    const newRatio = safeRate(newUsersCount30d, fandomUserCount);
    // 기존 Ratio는 (100 - newRatio)
    const existingRatio = parseFloat((100 - newRatio).toFixed(1));

    // 변화율: "일간 순수 신규" 증감률 (Total(T) - Total(T-1))
    const dailyNewUsersT = Math.max(0, fandomUserCount - fandomUserCountPrev);
    const fandomUserCountPrev2 =
      snapshotTMinus2?.cumulativeFandomUserCount || 0;
    const dailyNewUsersTMinus1 = Math.max(
      0,
      fandomUserCountPrev - fandomUserCountPrev2,
    );
    const newInflowChangeRate = safeGrowthRate(
      dailyNewUsersT,
      dailyNewUsersTMinus1,
    );

    // 5. 교차 지표 (월별 데이터 기반)
    // 해당 아티스트와 연관된 교차 데이터 필터링
    const myCrossData = targetMonthCrossData.filter(
      (d) => d.baseArtistId === artistId || d.targetArtistId === artistId,
    );

    // 비율 계산 및 정렬
    const formattedCrossData = myCrossData
      .map((d) => {
        const isBase = d.baseArtistId === artistId;
        const otherArtistName = isBase ? d.targetArtistName : d.baseArtistName;
        const percent = safeRate(d.overlapFandomCount, fandomUserCount);
        return { artist: otherArtistName, percent };
      })
      .filter((d) => d.percent > 0)
      .sort((a, b) => b.percent - a.percent);

    const crossInterest =
      formattedCrossData.length > 0
        ? formattedCrossData[0]
        : { artist: '-', percent: 0 };
    const crossInterestDetails = formattedCrossData;

    return {
      rank: 0, // 순위는 나중에 할당
      artist: artistName,
      fandomUserCount,
      userGrowthRate,
      reparticipationRate,
      rebookingRate,
      rebookingCycle,
      reparticipationCycle,
      reboardingCycle,
      inflowMix: { existing: existingRatio, new: newRatio },
      newInflowChangeRate,
      crossInterest,
      crossInterestDetails,
    };
  });

  // 순위 할당 (팬덤 규모 기준 기본 정렬)
  return data
    .sort((a, b) => b.fandomUserCount - a.fandomUserCount)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
};
