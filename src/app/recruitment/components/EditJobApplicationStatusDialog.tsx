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
import { ChevronDownIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import Stringifier from '@/utils/stringifier.util';
import {
  JobApplicationResponseModel,
  JobApplicationStatus,
  JobApplicationStatusEnum,
} from '@/types/recruitment.type';
import { usePutJobApplication } from '@/services/recruitment.service';

interface Props {
  jobApplication: JobApplicationResponseModel;
}

const EditJobApplicationStatusDialog = ({ jobApplication }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ status: JobApplicationStatus }>({
    defaultValues: {
      status: jobApplication.status,
    },
  });

  const options = useMemo(() => {
    return JobApplicationStatusEnum.options;
  }, []);

  const { mutate: putJobApplication } = usePutJobApplication();

  const onSubmit = async (data: { status: JobApplicationStatus }) => {
    putJobApplication(
      {
        jobApplicationId: jobApplication.id,
        body: data,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (error) => {
          alert(`지원서 상태 수정에 실패했습니다.\n${error}`);
        },
      },
    );
  };

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>상태 변경</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 rounded-16 bg-basic-white p-24">
          <DialogTitle className="text-26 font-700">
            지원서 상태 수정
          </DialogTitle>
          <Description>
            지원서 상태를 수정합니다. 지원자에게 알림이 가지 않으며 내부
            기록용입니다.
          </Description>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-256 flex-row items-center justify-between rounded-8 border border-basic-grey-100 bg-basic-white p-8">
              {Stringifier.jobApplicationStatus(jobApplication.status)}
            </div>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <List
                  value={value}
                  setValue={onChange}
                  toLabel={Stringifier.jobApplicationStatus}
                  toId={(v) => v}
                  values={options}
                />
              )}
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
                className={`bg-basic-blue-400 transition-all ${
                  isSubmitting ? '' : 'hover:scale-95 active:scale-90'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={isSubmitting}
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

export default EditJobApplicationStatusDialog;

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
        className="flex w-256 flex-row items-center justify-between rounded-8 border border-basic-grey-100 bg-basic-white p-8 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      >
        {toLabel(value)}
        <ChevronDownIcon />
      </ListboxButton>
      <ListboxOptions
        className="w-[var(--button-width)] origin-top rounded-8 border border-basic-grey-100 bg-basic-white"
        anchor="bottom"
      >
        {values.map((v) => (
          <ListboxOption
            key={toId(v)}
            value={v}
            className="p-8 data-[focus]:bg-basic-blue-100"
          >
            {toLabel(v)}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
