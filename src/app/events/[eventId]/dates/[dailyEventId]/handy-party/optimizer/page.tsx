'use client';

import Heading from '@/components/text/Heading';
import { useState, useRef } from 'react';
import Callout from '@/components/text/Callout';
import EventPlaceSelect from './components/EventPlaceSelect';
import Loading from '@/components/loading/Loading';
import CalculatedDataAndMapView from './components/CalculatedDataAndMapView';
import useDrag from './hooks/useDrag';
import {
  HANDY_PARTY_MAP_STATE_STORAGE_KEY,
  HANDY_PARTY_OPTIMIZER_MESSAGES,
} from './constants/handyPartyOptimizer.constant';
import useHandyPartyReservations from './hooks/useHandyPartyReservations';
import useOptimalRouteCalculation from './hooks/useOptimalRouteCalculation';
import useExcelDownload from './hooks/useExcelDownload';
import { RegionHubsViewEntity } from '@/types/hub.type';
import {
  CalculatedOptimalRouteData,
  ClusteredRouteResult,
  HandyPartyReservationExcelData,
  HandyPartyRoute,
} from './types/handyPartyOptimizer.type';
import { toast } from 'react-toastify';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const HandyPartyOptimizerPage = ({
  params: { eventId, dailyEventId },
}: Props) => {
  const [eventPlace, setEventPlace] = useState<RegionHubsViewEntity | null>(
    null,
  );
  const [optimizedRouteDataList, setOptimizedRouteDataList] = useState<
    CalculatedOptimalRouteData[]
  >([]);
  const [clusteredRouteDataList, setClusteredRouteDataList] = useState<
    ClusteredRouteResult[]
  >([]);
  const [savedHandyPartyReservationList, setSavedHandyPartyReservationList] =
    useState<HandyPartyReservationExcelData[]>([]);
  const [completedRouteIdSet, setCompletedRouteIdSet] = useState<Set<string>>(
    new Set(),
  );
  const [initialPartyId, setInitialPartyId] = useState<number>(0);
  const currentPartyIdRef = useRef<number>(initialPartyId);

  const {
    handyPartyReservationList,
    availableHandyPartyRouteList,
    isReservationsLoading,
    isReservationsError,
    handyPartyEventInformation,
  } = useHandyPartyReservations({
    eventId,
    dailyEventId,
    checkedRouteIds: completedRouteIdSet,
  });

  const { isCalculating, handleCalculateOptimalRoute } =
    useOptimalRouteCalculation();

  const {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedIndex,
    dropIndex,
  } = useDrag({
    calculatedData: optimizedRouteDataList,
    setCalculatedData: setOptimizedRouteDataList,
    setClusteredData: setClusteredRouteDataList,
  });

  const { handleExcelDownload } = useExcelDownload({
    eventInformation: handyPartyEventInformation,
  });

  const handleCalculateRoute = async (route: HandyPartyRoute) => {
    localStorage.removeItem(HANDY_PARTY_MAP_STATE_STORAGE_KEY);
    const result = await handleCalculateOptimalRoute(
      route,
      eventPlace,
      handyPartyReservationList,
    );
    if (result) {
      setOptimizedRouteDataList(result.optimizedRouteDataList);
      setClusteredRouteDataList(result.clusteredRouteDataList);
    }
  };

  const handleSaveCurrentWork = () => {
    try {
      const currentShuttleRouteId = optimizedRouteDataList[0]?.shuttleRouteId;
      const filteredPrevData = savedHandyPartyReservationList.filter(
        (item) => item.shuttleRouteId !== currentShuttleRouteId,
      );

      const usedPartyIds = new Set(
        filteredPrevData.map((item) => item.partyId),
      );
      const findNextAvailablePartyId = (startId: number): number => {
        let nextId = startId;
        while (usedPartyIds.has(nextId)) {
          nextId += 1;
        }
        return nextId;
      };

      const nextAvailablePartyId = findNextAvailablePartyId(initialPartyId);
      currentPartyIdRef.current = nextAvailablePartyId;

      let currentOrder = 1;
      let previousAddress = '';
      const currentWork: HandyPartyReservationExcelData[] =
        optimizedRouteDataList.reduce((acc, item) => {
          if (item.isSpacer) {
            currentPartyIdRef.current = findNextAvailablePartyId(
              currentPartyIdRef.current + 1,
            );
            currentOrder = 1;
            previousAddress = '';
            return acc;
          }

          if (!item.isSpacer) {
            if (previousAddress !== item.address && previousAddress !== '') {
              currentOrder += 1;
            }

            acc.push({
              reservationId: item.reservationId!,
              shuttleRouteId: item.shuttleRouteId!,
              shuttleName: item.shuttleName!,
              name: item.name!,
              nickname: item.nickname!,
              phoneNumber: item.phoneNumber!,
              tripType: item.tripType!,
              address: item.address!,
              latitude: item.latitude!,
              longitude: item.longitude!,
              partyId: currentPartyIdRef.current,
              order: currentOrder,
            });

            previousAddress = item.address!;
          }
          return acc;
        }, [] as HandyPartyReservationExcelData[]);

      const partyCountMap = currentWork.reduce(
        (acc, item) => {
          acc[item.partyId] = (acc[item.partyId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const hasOverMaxPartySize = Object.values(partyCountMap).some(
        (count) => count >= 6,
      );
      if (hasOverMaxPartySize) {
        throw new Error(
          HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.OVER_MAX_PARTY_SIZE,
        );
      }

      setSavedHandyPartyReservationList([...filteredPrevData, ...currentWork]);

      if (currentWork.length > 0) {
        const newCompletedRouteIds = new Set(completedRouteIdSet);
        newCompletedRouteIds.add(currentWork[0].shuttleRouteId);
        setCompletedRouteIdSet(newCompletedRouteIds);
      }

      toast.success(HANDY_PARTY_OPTIMIZER_MESSAGES.SUCCESS.WORK_SAVED);
      setOptimizedRouteDataList([]);
      setClusteredRouteDataList([]);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  if (isReservationsLoading || !handyPartyEventInformation) return <Loading />;
  if (isReservationsError)
    throw new Error(HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.DATA_FETCH_ERROR);
  return (
    <div>
      <Heading.h1 className="whitespace-nowrap">
        일자별 행사 핸디팟 최적 경로 계산기
      </Heading.h1>
      <Callout>
        행사명 : {handyPartyEventInformation?.eventName}
        <br />
        행사장소 : {handyPartyEventInformation?.eventLocationName}
        <br />
        일자 : {handyPartyEventInformation?.dailyEventDate}
        <br />
        <br />
        유효한 예약이 존재하는 핸디팟 노선만 보여집니다. (PaymentStatus: 예약
        완료, CancelStatus: 취소되지 않음) <br />
        노선을 클릭해 최적 경로를 산출 및 재조정하세요. 모든 노선을 작업하고
        나면 엑셀 추출 버튼이 활성화됩니다. <br />
        partyId 시작 번호를 설정하고 엑셀명단을 다운로드 받으세요.
      </Callout>

      <div className="mt-24" />
      <Heading.h3>핸디팟 노선 목록</Heading.h3>

      <section className="mt-4 flex items-center gap-8">
        <Heading.h4 className="whitespace-nowrap">행사장소</Heading.h4>
        <EventPlaceSelect
          eventPlace={eventPlace}
          setEventPlace={setEventPlace}
          placeholder="경로를 계산할 기준(행사장소)을 선택해주세요. 목록에는 행사 장소와 상세주소가 표시됩니다"
        />
        <Heading.h5 className="whitespace-nowrap">
          partyId 시작 번호:
        </Heading.h5>
        <input
          className="w-64"
          type="number"
          value={initialPartyId}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0) {
              setInitialPartyId(value);
              currentPartyIdRef.current = value;
            }
          }}
        />
        <button
          className="whitespace-nowrap rounded-full border border-basic-grey-300 bg-basic-blue-200 px-8 active:bg-basic-blue-100 disabled:cursor-not-allowed disabled:bg-basic-grey-100 disabled:opacity-50 disabled:active:bg-basic-grey-100"
          onClick={() => handleExcelDownload(savedHandyPartyReservationList)}
        >
          엑셀추출하기
        </button>
      </section>

      <div className="mt-4 flex w-full flex-wrap gap-8">
        {availableHandyPartyRouteList?.map((route, index) => (
          <button
            key={route.shuttleRouteId}
            className={`rounded-full border border-basic-grey-300 bg-basic-grey-100 px-8 active:bg-basic-grey-50 ${
              route.isChecked
                ? 'bg-brand-primary-300 active:bg-brand-primary-200'
                : ''
            } ${optimizedRouteDataList[0]?.shuttleRouteId === route.shuttleRouteId ? 'bg-basic-blue-200 active:bg-basic-blue-100' : ''}`}
            onClick={() => handleCalculateRoute(route)}
          >
            {index + 1 + ` ${route.shuttleName}`}
          </button>
        ))}
      </div>

      {isCalculating && (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center">
          <Heading.h4>최적 경로 계산중...</Heading.h4>
          <Loading />
        </div>
      )}
      {!isCalculating && optimizedRouteDataList.length > 0 && (
        <>
          <div className="mt-24 flex items-center gap-8">
            <Heading.h3>최적 경로 재조정하기</Heading.h3>
            <button
              className="text-ellipsis whitespace-nowrap rounded-full border border-basic-grey-300 bg-basic-blue-200 px-8 active:bg-basic-blue-100 disabled:cursor-not-allowed disabled:bg-basic-grey-100 disabled:opacity-50 disabled:active:bg-basic-grey-100"
              disabled={optimizedRouteDataList.length === 0}
              onClick={() => handleSaveCurrentWork()}
            >
              현재 작업 저장하기
            </button>
          </div>
          <CalculatedDataAndMapView
            calculatedData={optimizedRouteDataList}
            clusteredData={clusteredRouteDataList}
            draggedIndex={draggedIndex}
            dropIndex={dropIndex}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
          />
        </>
      )}
    </div>
  );
};

export default HandyPartyOptimizerPage;
