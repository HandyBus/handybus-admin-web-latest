const STATS_ITEMS = [
  {
    title: '(구) 성과 통계',
    desc: 'GMV, 전환율, 활성 유저 등',
    isActive: false,
  },
  {
    title: '유저 통계',
    desc: 'GMV, 전환율, 활성 유저 등',
    isActive: false,
  },
  {
    title: '수요조사 통계',
    desc: 'GMV, 전환율, 활성 유저 등',
    isActive: false,
  },
  {
    title: '팬덤 & 리텐션 인사이트',
    desc: '재참여율 & 팬덤 파워 분석',
    isActive: true,
  },
];

const StatisticsInsights = () => {
  return (
    <div className="flex w-full flex-col gap-16">
      <p className="text-20 font-600 text-basic-black">통계 및 인사이트</p>
      <div className="flex w-full gap-16">
        {STATS_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`w-246 flex h-104 flex-col items-center gap-12 rounded-8 border p-16 ${
              item.isActive
                ? 'border-basic-grey-200 bg-basic-white'
                : 'border-basic-grey-200 bg-basic-white'
            }`}
          >
            <div className="flex h-32 w-full items-center justify-between">
              <span className="text-18 font-500 text-basic-black">
                {item.title}
              </span>
              <div className="relative size-20">
                {/* Placeholder for icon, assuming generic chart icon */}
                <div className="size-full rounded-full bg-basic-grey-200" />
              </div>
            </div>
            <p
              className={`w-full whitespace-pre-wrap text-14 ${
                item.isActive
                  ? 'text-basic-grey-600'
                  : 'text-basic-grey-600 opacity-0'
              }`}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsInsights;
