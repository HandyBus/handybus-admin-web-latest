'use client';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import React, { useCallback, useMemo, useState } from 'react';
import BlueButton from '@/components/link/BlueButton';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import {
  ArrowDownIcon,
  ChevronDownIcon,
  MessageSquareWarningIcon,
} from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Stringifier from '@/utils/stringifier.util';
import {
  PutReservationBody,
  usePutReservation,
} from '@/services/shuttleOperation.service';
import {
  HandyStatus,
  HandyStatusEnum,
  ReservationViewEntity,
} from '@/types/reservation.type';

interface Props {
  response: ReservationViewEntity;
  defaultHandyStatus?: HandyStatus;
}

function EditHandyStatusDialog({ response, defaultHandyStatus }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { control, handleSubmit } = useForm<{ handyStatus: HandyStatus }>({
    defaultValues: {
      handyStatus: defaultHandyStatus ?? 'ACCEPTED',
    },
  });

  const handyStatus = useWatch({ control, name: 'handyStatus' });

  const isAdvancedFrom = useMemo(() => {
    return response.handyStatus !== 'SUPPORTED';
  }, [response]);

  const isAdvancedTo = useMemo(() => {
    return handyStatus === 'SUPPORTED' || handyStatus === 'NOT_SUPPORTED';
  }, [handyStatus]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { mutate: putReservation } = usePutReservation({
    onSuccess: () => {
      alert('핸디 상태가 수정되었습니다.');
      closeDialog();
    },
    onError: (error) => {
      alert('핸디 상태 수정에 실패했습니다.');
      console.error(error);
    },
  });

  const onSubmit = useCallback(
    async (input: PutReservationBody) => {
      putReservation({
        reservationId: response.reservationId,
        body: input,
      });
    },
    [response, closeDialog],
  );

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>핸디 승인 및 거절</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 bg-white p-24 rounded-xl">
          <DialogTitle className="font-700 text-26">
            핸디 지원 상태 수정
          </DialogTitle>
          <Description>핸디 지원 상태를 수정합니다.</Description>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-8 bg-white rounded-lg border border-grey-100 w-256 justify-between flex flex-row items-center">
              {Stringifier.handyStatus(response.handyStatus)}
            </div>
            {isAdvancedFrom && (
              <p className="text-red-500 font-600 text-12">
                <MessageSquareWarningIcon className="inline" /> 주의: 변경 전
                상태가 &#39;{Stringifier.handyStatus(response.handyStatus)}
                &#39;인 작업은 일반적이지 않습니다.
              </p>
            )}
            <ArrowDownIcon />
            <Controller
              control={control}
              name={`handyStatus`}
              render={({ field: { onChange, value } }) => (
                <>
                  <List
                    value={value}
                    setValue={onChange}
                    toLabel={Stringifier.handyStatus}
                    toId={(v) => v}
                    values={HandyStatusEnum.options}
                  />
                  {isAdvancedTo && (
                    <p className="text-red-500 font-600 text-12">
                      <MessageSquareWarningIcon className="inline" /> 주의: 변경
                      후 상태가 &#39;{Stringifier.handyStatus(value)}&#39;인
                      작업은 일반적이지 않습니다.
                    </p>
                  )}
                </>
              )}
            />
            <div className="flex gap-4 justify-end [&>button]:rounded-lg [&>button]:px-16 [&>button]:py-4 text-white">
              <button
                type="button"
                className="bg-grey-400 hover:scale-95 active:scale-90 transition-all"
                onClick={closeDialog}
              >
                이 창 닫기
              </button>
              <button
                type="submit"
                className="bg-blue-400 hover:scale-95 active:scale-90 transition-all"
              >
                수정
              </button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
}

export default EditHandyStatusDialog;

interface ListProps<T> {
  value: T;
  values: readonly T[];
  setValue: (t: T) => void;
  toLabel: (t: T) => string;
  toId: (t: T) => string;
}

const List = <T,>({ value, values, setValue, toLabel, toId }: ListProps<T>) => {
  return (
    <Listbox value={value} onChange={setValue}>
      <ListboxButton className="p-8 bg-white rounded-lg border border-grey-100 w-256 justify-between flex flex-row items-center">
        {toLabel(value)}
        <ChevronDownIcon />
      </ListboxButton>
      <ListboxOptions
        className="bg-white rounded-lg border border-grey-100 w-[var(--button-width)] origin-top"
        anchor="bottom"
      >
        {values.map((v) => (
          <ListboxOption
            key={toId(v)}
            value={v}
            className="data-[focus]:bg-blue-100 p-8"
          >
            {toLabel(v)}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
