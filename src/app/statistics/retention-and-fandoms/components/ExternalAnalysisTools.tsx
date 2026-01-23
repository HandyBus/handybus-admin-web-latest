import Image from 'next/image';

const ExternalAnalysisTools = () => {
  return (
    <div className="w-246 flex flex-col gap-16">
      <p className="text-20 font-600 text-basic-black">외부 분석 도구</p>
      <div className="flex h-104 flex-col justify-center gap-8">
        <div className="flex w-full gap-8">
          <a
            href="#"
            className="relative flex h-32 grow items-center justify-between rounded-8 border border-basic-orange-100 bg-basic-orange-50 px-16 py-8"
          >
            <span className="text-16 font-500 text-basic-black">GA4</span>
            <Image
              src="/icons/chevron-right-sm.svg"
              alt="arrow"
              width={16}
              height={16}
              className="-rotate-45"
            />
          </a>
          <a
            href="#"
            className="relative flex h-32 grow items-center justify-between rounded-8 border border-basic-blue-400 bg-basic-blue-100 px-16 py-8"
          >
            <span className="text-16 font-500 text-basic-black">서치 콘솔</span>
            <Image
              src="/icons/chevron-right-sm.svg"
              alt="arrow"
              width={16}
              height={16}
              className="-rotate-45"
            />
          </a>
        </div>
        <a
          href="#"
          className="relative flex h-32 w-full items-center justify-between rounded-8 border border-[#04c75b] bg-[#e6fff1] px-16 py-8"
        >
          <span className="text-16 font-500 text-basic-black">
            네이버 서치어드바이저
          </span>
          <Image
            src="/icons/chevron-right-sm.svg"
            alt="arrow"
            width={16}
            height={16}
            className="-rotate-45"
          />
        </a>
      </div>
    </div>
  );
};

export default ExternalAnalysisTools;
