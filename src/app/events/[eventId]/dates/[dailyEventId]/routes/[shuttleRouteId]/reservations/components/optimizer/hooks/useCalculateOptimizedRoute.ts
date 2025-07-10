import { useState } from 'react';
import {
  CalculatedData,
  ClusteredRouteResult,
  TripTypeWithRoundTrip,
} from '../types/optimizer.type';
import { RegionHubsViewEntity } from '@/types/hub.type';
import {
  calculateOptimalPath,
  createMapDisplayData,
} from '../utils/optimizer.util';

interface Props {
  eventPlace: RegionHubsViewEntity | null;
  rawCalculatedData: CalculatedData[];
  tripType: TripTypeWithRoundTrip;
  setCalculatedData: (calculatedData: CalculatedData[]) => void;
  setClusteredData: (clusteredData: ClusteredRouteResult[]) => void;
}

const useCalculateOptimizedRoute = ({
  eventPlace,
  rawCalculatedData,
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
      if (!rawCalculatedData?.length) {
        alert('승객 명단이 없습니다.');
        return;
      }
      if (!tripType) {
        alert('여정방향을 선택해주세요.');
        return;
      }

      const calculatedData = await calculateOptimalPath({
        rawCalculatedData,
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
