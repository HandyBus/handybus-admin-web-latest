'use client';

import { useMemo, useState } from 'react';
import Heading from '@/components/text/Heading';
import {
  ClusteredRouteResult,
  CalculatedData,
  SingleSideTripType,
} from './types/optimizer.type';
import { useGetRegionHubs } from '@/services/hub.service';
import { RegionHubsViewEntity } from '@/types/hub.type';
import Loading from '@/components/loading/Loading';
import useDrag from './hooks/useDrag';
import CalculatedDataAndMapView from './components/CalculatedDataAndMapView';
import EventPlaceSelect from './components/EventPlaceSelect';
import useCalculateOptimizedRoute from './hooks/useCalculateOptimizedRoute';

const RouteOptimizer = () => {
  const [calculatedData, setCalculatedData] = useState<CalculatedData[]>([]);
  const [clusteredData, setClusteredData] = useState<ClusteredRouteResult[]>(
    [],
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [tripType, setTripType] =
    useState<SingleSideTripType>('FROM_DESTINATION');
  const [eventPlace, setEventPlace] = useState<RegionHubsViewEntity | null>(
    null,
  );

  const { data } = useGetRegionHubs({
    options: {
      page: undefined,
      usageType: ['EVENT_LOCATION'],
    },
  });

  const eventLocationHubs = useMemo(
    () => data?.pages.flatMap((page) => page.regionHubs),
    [data],
  );

  const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useDrag({
      setDraggedIndex,
      draggedIndex,
      setCalculatedData,
      calculatedData,
      setClusteredData,
    });

  const { handleCalculateOptimizedRoute, isLoading } =
    useCalculateOptimizedRoute({
      eventPlace,
      inputText,
      tripType,
      setCalculatedData,
      setClusteredData,
    });

  if (!data) throw new Error('행사장소 데이터가 없습니다.');
  return (
    <div className="p-4">
      <Heading>핸디팟 최적 경로 계산기</Heading>
      <div className="bg-gray-50 mb-8 rounded-lg p-4">
        <div className="mb-8">
          <Heading.h4> 주소 데이터 (Excel 복사 붙여넣기 지원)</Heading.h4>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={PLACEHOLDER_TEXT}
            className="p-3 border-gray-300 h-160 w-full resize-y rounded-md border "
          />
        </div>

        <div className="flex gap-12 pb-16">
          <Heading.h5 className="whitespace-nowrap">여정방향</Heading.h5>
          <select
            className="rounded-md border border-grey-300 p-4"
            value={tripType as string}
            onChange={(e) => setTripType(e.target.value as SingleSideTripType)}
          >
            <option value="TO_DESTINATION">가는 편</option>
            <option value="FROM_DESTINATION">오는 편</option>
          </select>
          <Heading.h5 className="whitespace-nowrap">행사장소</Heading.h5>
          <EventPlaceSelect
            eventPlace={eventPlace}
            setEventPlace={setEventPlace}
            eventLocationHubs={eventLocationHubs}
          />
        </div>

        <div className="flex gap-12">
          <button
            onClick={handleCalculateOptimizedRoute}
            className="rounded-lg bg-red-500 p-4 text-white transition-colors disabled:cursor-not-allowed disabled:bg-grey-200"
            disabled={!eventPlace || !inputText || isLoading}
          >
            최적 경로 계산하기
          </button>{' '}
          <div className="text-gray-600 mt-4">
            <p>
              <strong>현재 적용된 데이터:</strong> {calculatedData.length}개
              주소
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Heading.h4>최적 경로 계산중...</Heading.h4>
          <Loading />
        </div>
      )}
      {!isLoading && calculatedData.length > 0 && (
        <CalculatedDataAndMapView
          calculatedData={calculatedData}
          clusteredData={clusteredData}
          draggedIndex={draggedIndex}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
        />
      )}
    </div>
  );
};

export default RouteOptimizer;

const PLACEHOLDER_TEXT = `지원 형식:
1. Excel 복사 (탭 구분): 주소	좌표1	좌표2 (위도/경도 순서 자동 감지)

예시:
서울 도봉구 도봉로170길 2 도봉역	127.0448981	37.6752038
서울 도봉구 마들로 835	127.050721	37.684371
서울특별시 노원구 중계로14나길 41(중계동, 한신빌라트)	127.0763583	37.649542`;
