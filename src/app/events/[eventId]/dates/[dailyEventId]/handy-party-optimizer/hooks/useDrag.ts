import { createMapDisplayData } from '../utils/optimizer.util';
import {
  CalculatedOptimalRouteData,
  ClusteredRouteResult,
} from '../types/handyPartyOptimizer.type';
import { useState } from 'react';

interface Props {
  setCalculatedData: (calculatedData: CalculatedOptimalRouteData[]) => void;
  calculatedData: CalculatedOptimalRouteData[];
  setClusteredData: (clusteredData: ClusteredRouteResult[]) => void;
}

const useDrag = ({
  setCalculatedData,
  calculatedData,
  setClusteredData,
}: Props) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // 드래그 앤 드롭 핸들러들
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
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

    let currentOrder = 1;
    // order 값 재정렬
    const reorderedResult = newResult.map((item, index) => ({
      ...item,
      index: index + 1,
      order: item.isSpacer ? null : currentOrder++,
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
    setDropIndex(null);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedIndex,
    dropIndex,
  };
};

export default useDrag;
