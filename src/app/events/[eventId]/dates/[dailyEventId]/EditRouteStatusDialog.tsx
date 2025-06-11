'use client';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { useMemo, useState } from 'react';
import BlueButton from '@/components/link/BlueButton';
import {
  ArrowDownIcon,
  ChevronDownIcon,
  MessageSquareWarningIcon,
} from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Stringifier from '@/utils/stringifier.util';
import {
  AdminShuttleRoutesViewEntity,
  ShuttleRouteStatus,
  ShuttleRouteStatusEnum,
} from '@/types/shuttleRoute.type';
import { usePutShuttleRoute } from '@/services/shuttleRoute.service';

interface Props {
  shuttleRoute: AdminShuttleRoutesViewEntity;
}

const EditRouteStatusDialog = ({ shuttleRoute }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ status: ShuttleRouteStatus }>({
    defaultValues: {
      status: shuttleRoute.status,
    },
  });

  const status = useWatch({ control, name: 'status' });

  const isAdvancedFrom = useMemo(() => {
    return (
      shuttleRoute.status === 'CANCELLED' || shuttleRoute.status === 'ENDED'
    );
  }, [shuttleRoute]);

  const isAdvancedTo = useMemo(() => {
    return status === 'CANCELLED';
  }, [status]);

  const options = useMemo(() => {
    if (shuttleRoute.status === 'CANCELLED' || shuttleRoute.status === 'ENDED')
      return [];
    return ShuttleRouteStatusEnum.options.filter(
      (s) => s !== 'INACTIVE' && s !== 'ENDED',
    );
  }, [shuttleRoute.status]);

  const { mutate: putShuttleRoute } = usePutShuttleRoute({
    onSuccess: () => {
      alert('노선 상태가 수정되었습니다.');
      setIsOpen(false);
      window.location.reload();
    },
    onError: (error) => {
      alert(`노선 상태 수정에 실패했습니다.\n${error}`);
    },
  });

  const onSubmit = async (data: { status: ShuttleRouteStatus }) => {
    if (!confirm('노선 상태를 수정하시겠습니까?')) return;
    putShuttleRoute({
      eventId: shuttleRoute.eventId,
      dailyEventId: shuttleRoute.dailyEventId,
      shuttleRouteId: shuttleRoute.shuttleRouteId,
      body: data,
    });
  };

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>노선 상태 수정</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 rounded-xl bg-white p-24">
          <DialogTitle className="text-26 font-700">노선 상태 수정</DialogTitle>
          <Description>노선 상태를 수정합니다.</Description>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-256 flex-row items-center justify-between rounded-lg border border-grey-100 bg-white p-8">
              {Stringifier.shuttleRouteStatus(shuttleRoute.status)}
            </div>
            {isAdvancedFrom && (
              <p className="text-12 font-600 text-red-500">
                더이상 상태를 변경할 수 없습니다.
              </p>
            )}
            <ArrowDownIcon />
            <Controller
              control={control}
              name={`status`}
              render={({ field: { onChange, value } }) => (
                <>
                  <List
                    value={value}
                    setValue={onChange}
                    toLabel={Stringifier.shuttleRouteStatus}
                    toId={(v) => v}
                    values={options}
                    disabled={
                      shuttleRoute.status === 'CANCELLED' ||
                      shuttleRoute.status === 'ENDED'
                    }
                  />
                  {isAdvancedTo && (
                    <p className="text-12 font-600 text-red-500">
                      <MessageSquareWarningIcon className="inline" /> 주의: 이
                      행위는 되돌릴 수 없습니다.
                      <br />
                      해당 노선 예약자 모두 예약 취소 및 환불 처리됩니다.
                    </p>
                  )}
                </>
              )}
            />
            <div className="flex justify-end gap-4 text-white [&>button]:rounded-lg [&>button]:px-16 [&>button]:py-4">
              <button
                type="button"
                className="bg-grey-400 transition-all hover:scale-95 active:scale-90"
                onClick={() => setIsOpen(false)}
              >
                이 창 닫기
              </button>
              <button
                className={`bg-blue-400 transition-all ${
                  isSubmitting ? '' : 'hover:scale-95 active:scale-90'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={
                  shuttleRoute.status === 'CANCELLED' ||
                  shuttleRoute.status === 'ENDED' ||
                  isSubmitting
                }
              >
                수정
              </button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default EditRouteStatusDialog;

interface ListProps<T> {
  value: T;
  values: readonly T[];
  setValue: (t: T) => void;
  toLabel: (t: T) => string;
  toId: (t: T) => string;
  disabled?: boolean;
}

const List = <T,>({
  value,
  values,
  setValue,
  toLabel,
  toId,
  disabled,
}: ListProps<T>) => {
  return (
    <Listbox value={value} onChange={setValue} disabled={disabled}>
      <ListboxButton
        className="flex w-256 flex-row items-center justify-between rounded-lg border border-grey-100 bg-white p-8 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      >
        {toLabel(value)}
        <ChevronDownIcon />
      </ListboxButton>
      <ListboxOptions
        className="w-[var(--button-width)] origin-top rounded-lg border border-grey-100 bg-white"
        anchor="bottom"
      >
        {values.map((v) => (
          <ListboxOption
            key={toId(v)}
            value={v}
            className="p-8 data-[focus]:bg-blue-100"
          >
            {toLabel(v)}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
