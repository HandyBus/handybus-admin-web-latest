import { useMemo } from 'react';
import Heading from '@/components/text/Heading';
import { CalculatedOptimalRouteData } from '../types/handyPartyOptimizer.type';
import HandyPartyMap from './HandyPartyMap';
import { ClusteredRouteResult } from '../types/optimizer.type';

const colorClasses = [
  'bg-blue-200',
  'bg-red-200',
  'bg-green-200',
  'bg-primary-200',
  'bg-blue-400',
  'bg-red-400',
  'bg-green-400',
  'bg-primary-400',
  'bg-blue-600',
  'bg-red-600',
  'bg-green-600',
  'bg-grey-600',
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
                    ? 'scale-95 bg-blue-50 opacity-50'
                    : 'hover:bg-gray-50'
                } ${
                  draggedIndex !== null &&
                  dropIndex === index &&
                  draggedIndex !== dropIndex
                    ? 'bg-blue-100 opacity-50'
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
                    <span className="flex w-full items-center justify-center font-500 text-blue-600">
                      호차구분 (호차별 5인 이하)
                    </span>
                  ) : (
                    <>
                      <span className={`font-500 text-blue-600`}>
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
