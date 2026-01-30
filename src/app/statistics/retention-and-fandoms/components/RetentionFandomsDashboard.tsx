'use client';

import RetentionLoyaltySection from './retention-and-loyalty/components/RetentionLoyaltySection';
import FandomCompetitivenessSection from './fandom-competitiveness/components/FandomCompetitivenessSection';

const RetentionFandomsDashboard = () => {
  return (
    <div className="flex w-full flex-col gap-32 pb-40">
      {/* Header Section */}
      <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-24 font-700 text-basic-black">
            리텐션 & 팬덤 통계
          </h1>
          <p className="mt-8 text-16 text-basic-grey-600">
            서비스의 재방문율과 팬덤의 성장 추이를 분석합니다.
          </p>
        </div>
      </div>

      <RetentionLoyaltySection />
      <div className="h-24" />
      <FandomCompetitivenessSection />
    </div>
  );
};

export default RetentionFandomsDashboard;
