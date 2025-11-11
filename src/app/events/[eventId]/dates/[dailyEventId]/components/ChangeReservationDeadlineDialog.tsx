'use client';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useState } from 'react';
import BlueButton from '@/components/link/BlueButton';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import useChangeReservationDeadlineOfMultipleShuttleRoutes from '../hooks/useChangeReservationDeadlineOfMultipleShuttleRoutes';
import DateInput from '@/components/input/DateInput';

interface Props {
  eventId: string;
  dailyEventId: string;
  selectedShuttleRoutes: AdminShuttleRoutesViewEntity[];
  clearSelectedShuttleRoutes: () => void;
}

const ChangeReservationDeadlineDialog = ({
  eventId,
  dailyEventId,
  selectedShuttleRoutes,
  clearSelectedShuttleRoutes,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { changeReservationDeadlineOfMultipleShuttleRoutes } =
    useChangeReservationDeadlineOfMultipleShuttleRoutes();
  const [newReservationDeadline, setNewReservationDeadline] = useState<
    string | undefined
  >(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!newReservationDeadline) {
      return;
    }

    setIsSubmitting(true);

    const shuttleRouteIdList = selectedShuttleRoutes.map(
      (r) => r.shuttleRouteId,
    );

    await changeReservationDeadlineOfMultipleShuttleRoutes({
      eventId,
      dailyEventId,
      shuttleRouteIds: shuttleRouteIdList,
      reservationDeadline: newReservationDeadline,
    });
    clearSelectedShuttleRoutes();
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <>
      <BlueButton
        onClick={() => setIsOpen(true)}
        className="text-14"
        disabled={selectedShuttleRoutes.length === 0}
      >
        선택한 노선 예약 마감일 수정하기
      </BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 rounded-16 bg-basic-white p-24">
          <DialogTitle className="text-26 font-700">
            예약 마감일 수정하기
          </DialogTitle>
          <Description>선택한 노선의 예약 마감일을 수정합니다.</Description>
          <div className="space-y-8">
            <DateInput
              value={newReservationDeadline}
              setValue={(value) =>
                setNewReservationDeadline(value ?? undefined)
              }
            />
            <div className="flex justify-end gap-4 text-basic-white [&>button]:rounded-8 [&>button]:px-16 [&>button]:py-4">
              <button
                type="button"
                className="bg-basic-grey-400 transition-all hover:scale-95 active:scale-90"
                onClick={() => setIsOpen(false)}
              >
                이 창 닫기
              </button>
              <button
                onClick={handleSubmit}
                className={`bg-basic-blue-400 transition-all ${
                  isSubmitting ? '' : 'hover:scale-95 active:scale-90'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={newReservationDeadline === undefined || isSubmitting}
              >
                수정
              </button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default ChangeReservationDeadlineDialog;
