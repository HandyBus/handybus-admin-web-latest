import { useMemo } from 'react';
import Heading from '@/components/text/Heading';
import {
  CalculatedOptimalRouteData,
  ClusteredRouteResult,
} from '../types/handyPartyOptimizer.type';
import HandyPartyMap from './HandyPartyMap';

const colorClasses = [
  'bg-basic-blue-200',
  'bg-basic-red-200',
  'bg-green-200',
  'bg-brand-primary-200',
  'bg-basic-blue-400',
  'bg-basic-red-400',
  'bg-green-400',
  'bg-brand-primary-400',
  'bg-basic-blue-600',
  'bg-basic-red-600',
  'bg-green-600',
  'bg-basic-grey-600',
];
interface Props {
  calculatedData: CalculatedOptimalRouteData[];
  clusteredData: ClusteredRouteResult[];
  draggedIndex: number | null;
  dropIndex: number | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
}

const CalculatedDataAndMapView = ({
  calculatedData,
  clusteredData,
  draggedIndex,
  dropIndex,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
}: Props) => {
  const reservationIdColorMap = useMemo(() => {
    const reservationIdCounts = new Map<string, number>();

    // 각 reservationId의 개수를 계산
    calculatedData.forEach((item) => {
      if (item.reservationId) {
        const count = reservationIdCounts.get(item.reservationId) || 0;
        reservationIdCounts.set(item.reservationId, count + 1);
      }
    });

    const multipleReservationIds = Array.from(reservationIdCounts)
      .filter(([, count]) => count >= 2)
      .map(([id]) => id);

    // 경로 순서 재조정시 색상이 새로 적용되지 않게 정렬 후 배정
    const colorMap = new Map<string, string>();
    multipleReservationIds.sort().forEach((id, index) => {
      colorMap.set(id, colorClasses[index % colorClasses.length]);
    });

    return colorMap;
  }, [calculatedData]);

  return (
    <div className="flex w-full gap-8">
      <div className="mt-4 max-h-[67vh] flex-1 overflow-y-scroll">
        <Heading.h4 className="overflow-hidden text-ellipsis whitespace-nowrap">
          경로 순서 (드래그로 순서 조정 가능)
        </Heading.h4>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {calculatedData.map((item, index) => {
            const textColor =
              item.reservationId &&
              reservationIdColorMap.get(item.reservationId!);

            return (
              <div
                key={`${item.address}-${index}`}
                className={`border-gray-200 flex cursor-pointer items-center justify-between border-b py-4 transition-all duration-200 ${
                  draggedIndex === index
                    ? 'bg-basic-blue-50 scale-95 opacity-50'
                    : 'hover:bg-gray-50'
                } ${
                  draggedIndex !== null &&
                  dropIndex === index &&
                  draggedIndex !== dropIndex
                    ? 'bg-basic-blue-100 opacity-50'
                    : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex-1">
                  {item.isSpacer ? (
                    <span className="text-basic-blue-600 flex w-full items-center justify-center font-500">
                      호차구분 (호차별 5인 이하)
                    </span>
                  ) : (
                    <>
                      <span className={`text-basic-blue-600 font-500`}>
                        {item.order}.
                      </span>
                      <span className={`pl-4 text-14 font-600 ${textColor}`}>
                        {'예약 ID: ' + item.reservationId}
                      </span>
                      <span className="pl-4">{item.address}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        <HandyPartyMap clusteredData={clusteredData} />
      </div>
    </div>
  );
};

export default CalculatedDataAndMapView;
