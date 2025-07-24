import HandyPartyMap from './HandyPartyMap';
import { ClusteredRouteResult, CalculatedData } from '../types/optimizer.type';
import Heading from '@/components/text/Heading';

interface Props {
  calculatedData: CalculatedData[];
  clusteredData: ClusteredRouteResult[];
  draggedIndex: number | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
}

const CalculatedDataAndMapView = ({
  calculatedData,
  clusteredData,
  draggedIndex,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
}: Props) => {
  return (
    <div className="flex w-full gap-8">
      <div className="mt-4 max-h-[67vh] flex-1 overflow-y-scroll">
        <Heading.h4 className="overflow-hidden text-ellipsis whitespace-nowrap">
          경로 순서 (드래그로 순서 조정 가능)
        </Heading.h4>
        {calculatedData.map((item, index) => (
          <div
            key={`${item.address}-${index}`}
            className={`p-3 border-gray-200 flex cursor-pointer items-center justify-between border-b transition-all duration-200 ${
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
            <div className="flex-1">
              <span className="font-semibold text-blue-600">{item.order}.</span>
              <span className="ml-2">{item.address}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1">
        <HandyPartyMap clusteredData={clusteredData} />
      </div>
    </div>
  );
};

export default CalculatedDataAndMapView;
