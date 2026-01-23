import Link from 'next/link';
import ArrowRightIcon from './icons/arrow-right.svg';

const STATS_ITEMS = [
  {
    title: '(구) 성과 통계',
    desc: '유저참여현황/가입자/수요조사/예약/취소/매출/리뷰',
    href: '/statistics/olds',
  },
  {
    title: '유저 통계',
    desc: '성별/연령대/소셜로그인방식/마케팅동의여부/유저수/당일유저수',
    href: '/statistics/users',
  },
  {
    title: '수요조사 통계',
    desc: '시도별 수요조사 통계',
    href: '/statistics/demands',
  },
  {
    title: '리텐션 & 팬덤 통계',
    desc: '반복 이용과 충성도, 팬덤 별 경쟁력 분석',
    href: '/statistics/retention-and-fandoms',
  },
] as const;

const StatisticsInsights = () => {
  return (
    <div className="flex w-full flex-col gap-16">
      <p className="text-20 font-600 text-basic-black">통계 및 인사이트</p>
      <div className="flex w-full gap-16">
        {STATS_ITEMS.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex h-auto flex-1 flex-col items-center gap-12 rounded-8 border p-16 transition-colors ${'border-basic-grey-200 bg-basic-white hover:bg-basic-grey-50'}`}
          >
            <div className="flex h-32 w-full items-center justify-between gap-8">
              <span className="whitespace-nowrap text-18 font-500 text-basic-black">
                {item.title}
              </span>
              <div className="relative size-20">
                <ArrowRightIcon />
              </div>
            </div>
            <p
              className={`w-full whitespace-pre-wrap text-14 text-basic-grey-600`}
            >
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StatisticsInsights;
