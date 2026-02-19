import { useState, useCallback, useEffect } from 'react';
import { useGetEvent, usePutEvent } from '@/services/event.service';
import { toast } from 'react-toastify';
import type { EventSaleDateMetadata } from '../utils/reservation-chart.util';

interface UseSaleDateManagementParams {
  eventId: string;
}

/**
 * 선예매일/일반예매일 CRUD 관리를 위한 커스텀 훅
 *
 * @param params.eventId - 이벤트 ID
 * @returns 예매일 상태, 수정 모드, 저장 핸들러
 */
export const useSaleDateManagement = ({
  eventId,
}: UseSaleDateManagementParams) => {
  const [preSaleDate, setPreSaleDate] = useState<string | null>(null);
  const [generalSaleDate, setGeneralSaleDate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 이벤트 상세 조회 (metadata 포함)
  const { data: eventDetail } = useGetEvent(eventId);

  // 메타데이터에서 선예매일/일반예매일 초기값 설정
  useEffect(() => {
    if (eventDetail?.eventMetadata) {
      const metadata = eventDetail.eventMetadata as EventSaleDateMetadata;
      setPreSaleDate(metadata.preSaleDate ?? null);
      setGeneralSaleDate(metadata.generalSaleDate ?? null);
    } else {
      setPreSaleDate(null);
      setGeneralSaleDate(null);
    }
  }, [eventDetail]);

  // 메타데이터 저장
  const { mutate: putEvent, isPending: isSaving } = usePutEvent({
    onSuccess: () => {
      toast.success('예매일 정보가 저장되었습니다.');
    },
    onError: () => {
      toast.error('예매일 정보 저장에 실패했습니다.');
    },
  });

  const handleSave = useCallback(() => {
    if (!eventId) return;

    const existingMetadata =
      (eventDetail?.eventMetadata as Record<string, unknown>) ?? {};
    const updatedMetadata: Record<string, unknown> = {
      ...existingMetadata,
      preSaleDate,
      generalSaleDate,
    };

    putEvent({
      eventId,
      body: {
        metadata: updatedMetadata,
      } as unknown as { metadata: string },
    });
  }, [eventId, eventDetail, preSaleDate, generalSaleDate, putEvent]);

  const handleSaveAndClose = useCallback(() => {
    handleSave();
    setIsEditing(false);
  }, [handleSave]);

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const resetEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  return {
    preSaleDate,
    setPreSaleDate,
    generalSaleDate,
    setGeneralSaleDate,
    isEditing,
    isSaving,
    toggleEditing,
    resetEditing,
    handleSaveAndClose,
  };
};
