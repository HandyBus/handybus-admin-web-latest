'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { conform, type CreateBusFormType } from './types/form.type';
import Input from '@/components/input/Input';
import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import Stringifier from '@/utils/stringifier.util';
import { usePostShuttleBus } from '@/services/shuttleOperation.service';
import { BusTypeEnum } from '@/types/shuttleBus.type';
import Heading from '@/components/text/Heading';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const NewBusPage = ({
  params: { eventId, dailyEventId, shuttleRouteId },
}: Props) => {
  const router = useRouter();

  const { control, handleSubmit } = useForm<CreateBusFormType>({
    defaultValues: {
      type: 'LARGE_BUS_45',
      name: '',
      number: '',
      phoneNumber: '',
    },
  });

  const { mutate: postBus } = usePostShuttleBus({
    onSuccess: () => {
      alert('버스가 추가되었습니다.');
      router.push(
        `/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
      );
    },
    onError: (error) => {
      alert('버스 추가에 실패했습니다');
      console.error(error);
    },
  });

  const onSubmit = useCallback(
    (data: CreateBusFormType) => {
      if (confirm('버스를 추가하시겠습니까?')) {
        postBus({
          eventId: Number(eventId),
          dailyEventId: Number(dailyEventId),
          shuttleRouteId: Number(shuttleRouteId),
          body: conform(data),
        });
      }
    },
    [router, eventId, dailyEventId, shuttleRouteId],
  );

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-white">
      <Heading>버스 추가하기</Heading>
      <form
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
        method="post"
      >
        <label>버스 이름</label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input value={value} setValue={onChange} />
          )}
        />
        <label>버스 번호</label>
        <Controller
          control={control}
          name="number"
          render={({ field: { onChange, value } }) => (
            <Input value={value} placeholder="00가 0000" setValue={onChange} />
          )}
        />
        <label>전화번호</label>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              placeholder="010-0000-0000"
              setValue={onChange}
            />
          )}
        />

        <label>버스 유형</label>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              value={value}
              className="flex flex-row flex-wrap gap-4"
              onChange={(s) => onChange(s)}
              aria-label="Server size"
            >
              {BusTypeEnum.options.map((plan) => (
                <Field key={plan} className="gap-2 flex items-center">
                  <Radio
                    value={plan}
                    className="group flex size-fit items-center justify-center rounded-lg bg-white p-4 transition-transform hover:outline hover:outline-blue-200 focus:outline focus:outline-blue-200 active:scale-[0.9] data-[checked]:bg-blue-400 data-[checked]:text-white"
                  >
                    <CheckIcon
                      className="invisible group-data-[checked]:visible"
                      size={18}
                    />
                    <Label>{Stringifier.busType(plan)}</Label>
                  </Radio>
                </Field>
              ))}
            </RadioGroup>
          )}
        />

        <button
          className="rounded-xl bg-blue-500 p-4 text-white transition-all hover:opacity-75 active:scale-95"
          type="submit"
        >
          버스 추가하기
        </button>
      </form>
    </main>
  );
};

export default NewBusPage;
