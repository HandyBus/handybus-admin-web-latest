'use client';

import BlueButton from '@/components/link/BlueButton';
import {
  AddressData,
  calculateOptimalRouteExample,
  RouteResult,
  ClusteredRouteResult,
  createMapDisplayData,
} from './utils/optimalPathCalculator.util';
import { useState } from 'react';
import TadaMap from './components/TadaMap';
import Heading from '@/components/text/Heading';
import { addressData } from './const/addressData.const';

const RouteOptimizer = () => {
  const [result, setResult] = useState<RouteResult[]>([]);
  const [clusteredData, setClusteredData] = useState<ClusteredRouteResult[]>(
    [],
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [inputData, setInputData] = useState<AddressData[]>(addressData);
  const [inputText, setInputText] = useState<string>('');
  const [parseError, setParseError] = useState<string>('');

  const parseInputData = (text: string): AddressData[] => {
    const lines = text
      .trim()
      .split('\n')
      .filter((line) => line.trim());
    const results: AddressData[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      try {
        // 탭 구분 형식 (Excel 복사)
        if (line.includes('\t')) {
          const parts = line.split('\t');
          if (parts.length >= 3) {
            const address = parts[0].trim();
            const coord1 = Number(parts[1].trim());
            const coord2 = Number(parts[2].trim());

            if (!isNaN(coord1) && !isNaN(coord2) && address) {
              // 좌표 범위로 위도/경도 자동 감지
              // 위도는 일반적으로 -90~90, 경도는 -180~180
              // 한국의 경우 위도는 33~43, 경도는 124~132 범위
              let latitude, longitude;
              if (
                coord1 >= 33 &&
                coord1 <= 43 &&
                coord2 >= 124 &&
                coord2 <= 132
              ) {
                // coord1이 위도, coord2가 경도인 경우 (주소, 위도, 경도)
                latitude = coord1;
                longitude = coord2;
              } else if (
                coord2 >= 33 &&
                coord2 <= 43 &&
                coord1 >= 124 &&
                coord1 <= 132
              ) {
                // coord1이 경도, coord2가 위도인 경우 (주소, 경도, 위도)
                latitude = coord2;
                longitude = coord1;
              } else {
                // 범위 밖이면 기본적으로 첫 번째가 위도, 두 번째가 경도로 처리
                latitude = coord1;
                longitude = coord2;
              }

              results.push({
                address,
                longitude,
                latitude,
                tripType: 'fromDestination',
              });
              continue;
            }
          }
        }

        throw new Error(`라인 ${i + 1}: 올바르지 않은 형식입니다.`);
      } catch (error) {
        throw new Error(
          `라인 ${i + 1}: ${error instanceof Error ? error.message : '파싱 오류'}`,
        );
      }
    }

    return results;
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    setParseError('');
  };

  const handleApplyData = () => {
    try {
      if (!inputText.trim()) {
        setParseError('데이터를 입력해주세요.');
        return;
      }

      const parsed = parseInputData(inputText);
      if (parsed.length === 0) {
        setParseError('유효한 데이터가 없습니다.');
        return;
      }

      setInputData(parsed);
      setResult([]);
      setClusteredData([]);
      setParseError('');
      alert(`${parsed.length}개의 주소가 성공적으로 적용되었습니다.`);
    } catch (error) {
      setParseError(
        error instanceof Error
          ? error.message
          : '데이터 파싱 중 오류가 발생했습니다.',
      );
    }
  };

  const handleResetData = () => {
    setInputData(addressData);
    setInputText('');
    setResult([]);
    setClusteredData([]);
    setParseError('');
  };

  const handleClick = async () => {
    const result = await calculateOptimalRouteExample(
      inputData,
      'fromDestination',
    );
    setResult(result.optimalRoute);
    setClusteredData(result.clusteredData);
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newResult = [...result];
    const draggedItem = newResult[draggedIndex];

    // 드래그된 아이템을 제거
    newResult.splice(draggedIndex, 1);

    // 새로운 위치에 삽입
    newResult.splice(dropIndex, 0, draggedItem);

    // order 값 재정렬
    const reorderedResult = newResult.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setResult(reorderedResult);

    // 클러스터링 데이터도 업데이트
    const updatedClusteredData = createMapDisplayData(
      reorderedResult,
      inputData,
    );
    setClusteredData(updatedClusteredData);

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="p-4">
      <Heading>타다 노선 최적 경로 계산기</Heading>
      <div className="bg-gray-50 mb-8 rounded-lg p-4">
        <div className="mb-8">
          <Heading.h4> 주소 데이터 (Excel 복사 붙여넣기 지원)</Heading.h4>
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholderText}
            className="p-3 border-gray-300 h-160 w-full resize-y rounded-md border "
          />
        </div>

        {parseError && (
          <div className="p-3 mb-4 rounded-md border border-red-200 bg-red-50">
            <p className="text-sm text-red-600">{parseError}</p>
          </div>
        )}

        <div className="flex gap-8">
          <button
            onClick={handleApplyData}
            className="py-2 rounded-md bg-blue-500 px-4 text-white transition-colors hover:bg-blue-600"
          >
            데이터 적용
          </button>
          <button
            onClick={handleResetData}
            className="py-2 bg-gray-500 border-gray-300 rounded-md border px-4 transition-colors hover:bg-grey-100"
          >
            기본 데이터로 초기화
          </button>
        </div>

        <div className="text-gray-600 mt-4">
          <p>
            <strong>현재 적용된 데이터:</strong> {inputData.length}개 주소
          </p>
        </div>
      </div>

      <BlueButton onClick={handleClick} className="mt-20">
        최적 경로 계산하기
      </BlueButton>

      <div className="flex w-full gap-8">
        <div className="mt-4 max-h-[67vh] flex-1 overflow-y-scroll">
          {result.map((item, index) => (
            <div
              key={`${item.address}-${index}`}
              className={`p-3 border-gray-200 flex cursor-move items-center justify-between border-b transition-all duration-200 ${
                draggedIndex === index
                  ? 'scale-95 bg-blue-50 opacity-50'
                  : 'hover:bg-gray-50'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              {/* 드래그 핸들 */}
              <div className="mr-3 flex items-center">
                <div className="gap-1 text-gray-400 hover:text-gray-600 flex cursor-grab flex-col active:cursor-grabbing">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                </div>
              </div>

              <div className="flex-1">
                <span className="font-semibold text-blue-600">
                  {item.order}.
                </span>
                <span className="ml-2">{item.address}</span>
              </div>
            </div>
          ))}
        </div>

        {result.length > 0 && (
          <div className="flex-1">
            <TadaMap
              addressData={inputData}
              routeResult={result}
              clusteredData={clusteredData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteOptimizer;

const placeholderText = `지원 형식:
1. Excel 복사 (탭 구분): 주소	좌표1	좌표2 (위도/경도 순서 자동 감지)

예시:
서울 도봉구 도봉로170길 2 도봉역	127.0448981	37.6752038
서울 도봉구 마들로 835	127.050721	37.684371
서울특별시 노원구 중계로14나길 41(중계동, 한신빌라트)	127.0763583	37.649542`;
