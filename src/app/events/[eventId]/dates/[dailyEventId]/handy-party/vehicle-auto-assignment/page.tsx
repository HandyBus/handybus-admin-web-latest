'use client';

import Loading from '@/components/loading/Loading';
import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import useCreateCurrentTimeLog from './hooks/createCurrentTimeLog';
import { useVehicleAutoAssignment } from './hooks/useVehicleAutoAssignment';
import { useEventInfo } from './hooks/useEventInfo';
import { useInputText } from './hooks/useInputText';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const VehicleAutoAssignmentPage = ({
  params: { eventId, dailyEventId },
}: Props) => {
  const { logText, createCurrentTimeLog } = useCreateCurrentTimeLog();
  const { inputText, handleInputChange } = useInputText();

  const {
    eventInfo,
    shuttleRoutes,
    isLoadingShuttleRoutes,
    isErrorShuttleRoutes,
  } = useEventInfo({
    eventId,
    dailyEventId,
  });

  const {
    isProcessing,
    isLoadingReservations,
    isErrorReservations,
    handyPartyReservations,
    handleAutoAssignment,
  } = useVehicleAutoAssignment({
    eventId,
    dailyEventId,
    shuttleRoutes,
    dailyEventDate: eventInfo?.date ?? '',
    createCurrentTimeLog,
  });

  if (isLoadingShuttleRoutes || isLoadingReservations) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (isErrorShuttleRoutes || isErrorReservations) {
    throw new Error('데이터 불러오지 못했습니다.');
  }
  if (handyPartyReservations.length === 0) {
    return (
      <div>
        <Heading.h1>일자별 행사 핸디팟 자동 배차하기</Heading.h1>
        <p>핸디팟 예약이 없습니다.</p>
      </div>
    );
  }
  return (
    <main className="flex flex-col gap-28">
      <section>
        <Heading.h1>일자별 행사 핸디팟 자동 배차하기</Heading.h1>
        <Callout>
          행사명 : {eventInfo?.eventName}
          <br />
          행사장소 : {eventInfo?.eventLocationName}
          <br />
          일자 : {eventInfo?.date}
          <br />
          <br />
          유효한 예약이 존재하는 핸디팟 노선만 보여집니다. (PaymentStatus: 예약
          완료, CancelStatus: 취소되지 않음) <br />
          노선을 클릭해 최적 경로를 산출 및 재조정하세요. 모든 노선을 작업하고
          나면 엑셀 추출 버튼이 활성화됩니다. <br />
          partyId 시작 번호를 설정하고 엑셀명단을 다운로드 받으세요.
        </Callout>
      </section>

      <section>
        <div className="flex items-baseline gap-4">
          <Heading.h4>
            {' '}
            타다 시트 데이터 입력창 (Excel 시트를 복붙하세요)
          </Heading.h4>
          <button
            className="disabled:text-gray-500 rounded-lg bg-blue-500 px-8 text-white active:bg-blue-400 disabled:cursor-not-allowed disabled:bg-grey-300"
            disabled={inputText.length === 0 || isProcessing}
            onClick={() => handleAutoAssignment(inputText)}
          >
            {isProcessing ? '처리중...' : '시작하기'}
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder={PLACEHOLDER_TEXT}
          className="border-gray-300 h-320 w-full resize-y rounded-md border p-8 "
        />
      </section>

      <section>
        <Heading.h4>결과</Heading.h4>
        <div className="h-320 resize-y overflow-y-auto rounded-md border p-8">
          {logText?.length > 0 ? (
            logText.map((log, index) => (
              <p
                key={`${log}-${index}`}
                ref={(el) => {
                  if (el && index === logText.length - 1) {
                    el.scrollIntoView();
                  }
                }}
              >
                {log}
              </p>
            ))
          ) : (
            <p>결과가 없습니다. &apos;시작하기&apos; 버튼을 눌러주세요.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default VehicleAutoAssignmentPage;

const PLACEHOLDER_TEXT = `지원 형식:
1. Excel 복사 (탭 구분): 타다 시트 데이터를 복사하세요.

예시:
동북권	고양종합운동장	오는편	2025-06-13 23:00	010-8602-3159	서울 도봉구 노해로 42길	37.6485362	127.0287503	8	3	52.0 	90.7 	23:00				24,000	서울38자8147	010-8602-3159
동북권	고양종합운동장	오는편	2025-06-13 23:00	010-8602-3159	서울 도봉구 노해로 42길	37.6485362	127.0287503	8	3	52.0 	90.7 	23:00				24,000	서울38자8147	010-8602-3159
동북권	고양종합운동장	오는편	2025-06-13 23:00	010-2223-1515	서울 도봉구 도봉로 948	37.6884439	127.0460563	8	4	52.0 	90.7 	23:00				24,000	서울38자8147	010-2223-1515
동북권	고양종합운동장	오는편	2025-06-13 23:00	010-2485-6564	서울 도봉구 도봉로 948	37.6884439	127.0460563	8	4	52.0 	90.7 	23:00				24,000	서울38자8147	010-2485-6564
동북권	고양종합운동장	오는편	2025-06-13 23:00	010-6643-1435	서울 성북구 동소문로 106	37.5926047	127.0171767	8	2	52.0 	90.7 	23:00				24,000	서울38자8147	010-6643-1435
동탄	고양종합운동장	오는편	2025-06-13 23:00	010-9929-0827	경기 화성시 동탄대로24길 199	37.2063147	127.1169647	9	2	84.0 	108.8 	23:00				26,000	경기32바9539	010-9929-0827
동탄	고양종합운동장	오는편	2025-06-13 23:00	010-5694-0156	경기 화성시 동탄대로 6길 50	37.1672551	127.1123456	9	6	84.0 	108.8 	23:00				26,000	경기32바9539	010-5694-0156
동탄	고양종합운동장	오는편	2025-06-13 23:00	010-4022-2654	경기 화성시 동탄대로 9길19	37.1738864	127.10414	9	5	84.0 	108.8 	23:00				26,000	경기32바9539	010-4022-2654
동탄	고양종합운동장	오는편	2025-06-13 23:00	010-7153-6396	경기 화성시 동탄순환대로 20길 69	37.1862691	127.1276458	9	3	84.0 	108.8 	23:00				26,000	경기32바9539	010-7153-6396`;
