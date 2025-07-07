import { useState } from 'react';
import {
  CalculatedData,
  ClusteredRouteResult,
  SingleSideTripType,
} from '../types/optimizer.type';
import { RegionHubsViewEntity } from '@/types/hub.type';
import { parseInputData } from '../utils/parseInputData.util';
import {
  OptimalPathCalculator,
  createMapDisplayData,
} from '../utils/optimizer.util';

interface Props {
  eventPlace: RegionHubsViewEntity | null;
  inputText: string;
  tripType: SingleSideTripType;
  setCalculatedData: (calculatedData: CalculatedData[]) => void;
  setClusteredData: (clusteredData: ClusteredRouteResult[]) => void;
}

const useCalculateOptimizedRoute = ({
  eventPlace,
  inputText,
  tripType,
  setCalculatedData,
  setClusteredData,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateOptimizedRoute = async () => {
    try {
      setIsLoading(true);

      if (!eventPlace) {
        alert('행사장소를 선택해주세요.');
        return;
      }
      if (!inputText.trim()) {
        alert('주소 데이터를 입력해주세요.');
        return;
      }
      if (!tripType) {
        alert('여정방향을 선택해주세요.');
        return;
      }

      const parsed = parseInputData({ text: inputText, tripType });
      if (parsed.length === 0) {
        alert('유효한 주소 데이터가 없습니다.');
        return;
      }

      const calculatedData = await OptimalPathCalculator({
        addressData: parsed,
        eventPlace,
        tripType,
      });
      const clusteredData = createMapDisplayData({
        calculatedData,
      });

      setCalculatedData(calculatedData);
      setClusteredData(clusteredData);
    } catch (error) {
      console.error('최적 경로 계산 중 오류 발생:', error);
      alert(
        '최적 경로 계산 중 오류가 발생했습니다.\n' +
          (error instanceof Error ? error.message : '알 수 없는 오류'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCalculateOptimizedRoute,
    isLoading,
  };
};

export default useCalculateOptimizedRoute;
