import Link from 'next/link';
import ArrowUpRightIcon from './icons/arrow-up-right.svg';

const GA_LINK =
  'https://analytics.google.com/analytics/web/?hl=ko#/p464197268/reports/intelligenthome';
const GOOGLE_SEARCH_CONSOLE_LINK =
  'https://search.google.com/search-console?utm_source=about-page&resource_id=https://www.handybus.co.kr/';
const NAVER_SEARCH_ADVISOR_LINK =
  'https://searchadvisor.naver.com/console/site/summary?site=https%3A%2F%2Fwww.handybus.co.kr';

const ExternalAnalysisTools = () => {
  return (
    <div className="w-246 flex flex-col gap-16">
      <p className="text-20 font-600 text-basic-black">외부 분석 도구</p>
      <div className="flex h-104 flex-col justify-center gap-8">
        <div className="flex w-full gap-8">
          <Link
            href={GA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-32 grow items-center justify-between gap-8 rounded-8 border border-basic-orange-100 bg-basic-orange-50 px-16 py-8 transition-colors hover:bg-basic-orange-100"
          >
            <span className="whitespace-nowrap text-16 font-500 text-basic-black">
              GA4
            </span>
            <ArrowUpRightIcon />
          </Link>
          <Link
            href={GOOGLE_SEARCH_CONSOLE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-32 grow items-center justify-between gap-8 rounded-8 border border-basic-blue-400 bg-basic-blue-100 px-16 py-8 transition-colors hover:bg-basic-blue-200"
          >
            <span className="whitespace-nowrap text-16 font-500 text-basic-black">
              서치 콘솔
            </span>
            <ArrowUpRightIcon />
          </Link>
        </div>
        <Link
          href={NAVER_SEARCH_ADVISOR_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-32 w-full items-center justify-between gap-8 rounded-8 border border-[#04c75b] bg-[#e6fff1] px-16 py-8 transition-colors hover:bg-[#d1ffe5]"
        >
          <span className="whitespace-nowrap text-16 font-500 text-basic-black">
            네이버 서치어드바이저
          </span>
          <ArrowUpRightIcon />
        </Link>
      </div>
    </div>
  );
};

export default ExternalAnalysisTools;
