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
import useChangeMaxPassengerCountOfMultipleShuttleRoutes from '../hooks/useChangeMaxPassengerCountOfMultipleShuttleRoutes';
import NumberInput from '@/components/input/NumberInput';

interface Props {
  eventId: string;
  dailyEventId: string;
  selectedShuttleRoutes: AdminShuttleRoutesViewEntity[];
  clearSelectedShuttleRoutes: () => void;
}

const ChangeMaxPassengerCountDialog = ({
  eventId,
  dailyEventId,
  selectedShuttleRoutes,
  clearSelectedShuttleRoutes,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { changeMaxPassengerCountOfMultipleShuttleRoutes } =
    useChangeMaxPassengerCountOfMultipleShuttleRoutes();
  const [newMaxPassengerCount, setNewMaxPassengerCount] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (newMaxPassengerCount <= 0) {
      return;
    }

    setIsSubmitting(true);

    const shuttleRouteIdList = selectedShuttleRoutes.map(
      (r) => r.shuttleRouteId,
    );

    await changeMaxPassengerCountOfMultipleShuttleRoutes({
      eventId,
      dailyEventId,
      shuttleRouteIds: shuttleRouteIdList,
      maxPassengerCount: newMaxPassengerCount,
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
        선택한 노선 최대 승객 수 수정하기
      </BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 rounded-16 bg-basic-white p-24">
          <DialogTitle className="text-26 font-700">
            최대 승객 수 수정하기
          </DialogTitle>
          <Description>선택한 노선의 최대 승객 수를 수정합니다.</Description>
          <div className="space-y-8">
            <NumberInput
              value={newMaxPassengerCount}
              setValue={setNewMaxPassengerCount}
              placeholder="최대 승객 수를 입력하세요"
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
                disabled={newMaxPassengerCount <= 0 || isSubmitting}
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

export default ChangeMaxPassengerCountDialog;
