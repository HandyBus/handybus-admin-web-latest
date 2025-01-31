'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/components/input/Input';
import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import Stringifier from '@/utils/stringifier.util';
import {
  useGetShuttleBus,
  usePutShuttleBus,
} from '@/services/shuttleOperation.service';
import { BusTypeEnum } from '@/types/shuttleBus.type';
import Heading from '@/components/text/Heading';
import Form from '@/components/form/Form';
import { conform, EditBusFormType } from './types/form.type';
import { CustomError } from '@/services/custom-error';

interface Props {
  params: {
    eventId: string;
    dailyEventId: string;
    shuttleRouteId: string;
    busId: string;
  };
}

const EditBusPage = ({ params }: Props) => {
  const {
    data: bus,
    isPending: isBusPending,
    isError: isBusError,
    error: busError,
  } = useGetShuttleBus(
    Number(params.eventId),
    Number(params.dailyEventId),
    Number(params.shuttleRouteId),
    Number(params.busId),
  );

  const defaultValues = useMemo(() => {
    return {
      type: bus?.busType ?? '',
      name: bus?.busName ?? '',
      number: bus?.busNumber ?? '',
      phoneNumber: bus?.busDriverPhoneNumber ?? '',
      openChatLink: bus?.openChatLink ?? '',
    } as EditBusFormType;
  }, [bus]);

  return (
    <>
      {isBusPending && <div>Loading...</div>}
      {isBusError && <div>Error: {busError.message}</div>}
      {bus && <EditForm defaultValues={defaultValues} params={params} />}
    </>
  );
};

export default EditBusPage;

interface EditFormProps {
  defaultValues: EditBusFormType;
  params: {
    eventId: string;
    dailyEventId: string;
    shuttleRouteId: string;
    busId: string;
  };
}

const EditForm = ({ defaultValues, params }: EditFormProps) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<EditBusFormType>({
    defaultValues: defaultValues,
  });

  const { mutate: putBus } = usePutShuttleBus({
    onSuccess: () => {
      alert('버스가 수정되었습니다.');
      router.push(
        `/events/${params.eventId}/dates/${params.dailyEventId}/routes/${params.shuttleRouteId}`,
      );
    },
    onError: (error: CustomError) => {
      alert('버스 수정에 실패했습니다\n' + error.message);
    },
  });

  const onSubmit = useCallback(
    (data: EditBusFormType) => {
      if (confirm('버스를 수정하시겠습니까?')) {
        putBus({
          eventId: Number(params.eventId),
          dailyEventId: Number(params.dailyEventId),
          shuttleRouteId: Number(params.shuttleRouteId),
          shuttleBusId: Number(params.busId),
          body: conform(data),
        });
      }
    },
    [params],
  );

  return (
    <main>
      <Heading>버스 수정하기</Heading>
      <Form
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
        method="put"
      >
        <Form.section>
          <Form.label>버스 이름</Form.label>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input value={value} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>버스 번호</Form.label>
          <Controller
            control={control}
            name="number"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder="00가 0000"
                setValue={onChange}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>전화번호</Form.label>
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
        </Form.section>
        <Form.section>
          <Form.label>버스 유형</Form.label>
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
        </Form.section>
        <Form.section>
          <Form.label>오픈채팅방 링크</Form.label>
          <Controller
            control={control}
            name="openChatLink"
            render={({ field: { onChange, value } }) => (
              <Input value={value} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.submitButton>추가하기</Form.submitButton>
      </Form>
    </main>
  );
};
