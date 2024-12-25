'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { conform, type CreateBusFormType } from './types/form.type';
import Input from '@/components/input/Input';
import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import { addBus } from '@/app/actions/bus.action';

interface Props {
  params: { shuttle_id: string; daily_id: string; route_id: string };
}

const NewBusPage = ({ params: { shuttle_id, daily_id, route_id } }: Props) => {
  const router = useRouter();

  const { control, handleSubmit } = useForm<CreateBusFormType>({
    defaultValues: {
      type: 'BUS_45',
      name: '',
      number: '',
      phoneNumber: '',
      openChatLink: '',
    },
  });

  const onSubmit = useCallback(
    (data: CreateBusFormType) => {
      if (confirm('버스를 추가하시겠습니까?')) {
        addBus(
          Number(shuttle_id),
          Number(daily_id),
          Number(route_id),
          conform(data),
        )
          .then(() => {
            alert('버스가 추가되었습니다.');
            router.push(
              `/shuttles/${shuttle_id}/dates/${daily_id}/routes/${route_id}`,
            );
          })
          .catch((e) => {
            alert('버스 추가에 실패했습니다');
            console.error(e);
          });
      }
    },
    [router, shuttle_id, daily_id, route_id],
  );

  return (
    <main className="h-full w-full bg-white flex flex-col gap-16">
      <h2 className="text-24 font-500">거점지 정보</h2>
      <form
        className="flex flex-col"
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
        <label>오픈채팅 링크</label>
        <Controller
          control={control}
          name="openChatLink"
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              placeholder="https://open.kakao.com/..."
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
              className="flex flex-row gap-4"
              onChange={(s) => onChange(s)}
              aria-label="Server size"
            >
              {['BUS_45', 'SEATER_12', 'SEATER_28'].map((plan) => (
                <Field key={plan} className="flex items-center gap-2">
                  <Radio
                    value={plan}
                    className="group flex size-fit items-center p-4 justify-center rounded-lg bg-white
                    data-[checked]:bg-blue-400
                    data-[checked]:text-white
                    transition-transform
                    hover:outline
                    focus:outline
                    hover:outline-blue-200
                    focus:outline-blue-200
                    active:scale-[0.9]
                    "
                  >
                    <CheckIcon
                      className="invisible group-data-[checked]:visible"
                      size={18}
                    />
                    <Label>{plan}</Label>
                  </Radio>
                </Field>
              ))}
            </RadioGroup>
          )}
        />

        <button type="submit">버스 추가하기</button>
      </form>
    </main>
  );
};

export default NewBusPage;
