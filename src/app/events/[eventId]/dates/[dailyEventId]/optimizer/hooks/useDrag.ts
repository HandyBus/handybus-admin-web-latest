import { createMapDisplayData } from '../utils/optimizer.util';
import { ClusteredRouteResult, CalculatedData } from '../types/optimizer.type';

interface Props {
  setDraggedIndex: (index: number | null) => void;
  draggedIndex: number | null;
  setCalculatedData: (calculatedData: CalculatedData[]) => void;
  calculatedData: CalculatedData[];
  setClusteredData: (clusteredData: ClusteredRouteResult[]) => void;
}

const useDrag = ({
  setDraggedIndex,
  draggedIndex,
  setCalculatedData,
  calculatedData,
  setClusteredData,
}: Props) => {
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

    const newResult = [...calculatedData];
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

    setCalculatedData(reorderedResult);

    // 클러스터링 데이터도 업데이트
    const updatedClusteredData = createMapDisplayData({
      calculatedData: reorderedResult,
    });
    setClusteredData(updatedClusteredData);

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};

export default useDrag;
