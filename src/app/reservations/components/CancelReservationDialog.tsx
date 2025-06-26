import BlueButton from '@/components/link/BlueButton';
import { usePutCancelReservation } from '@/services/reservation.service';

interface Props {
  reservationId: string;
}

const CancelReservationDialog = ({ reservationId }: Props) => {
  const { mutateAsync: putCancelReservation } = usePutCancelReservation();

  const handleCancel = async () => {
    if (!confirm('정말 예약취소 처리하시겠습니까?')) return;
    try {
      await putCancelReservation(reservationId);
      alert('예약취소 처리가 완료되었습니다.');
    } catch (error) {
      alert(`오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n` + error);
    }
  };

  return (
    <BlueButton onClick={handleCancel} type="button">
      예약 취소처리
    </BlueButton>
  );
};

export default CancelReservationDialog;
