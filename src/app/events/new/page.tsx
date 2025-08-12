'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { type CreateEventFormData, conform } from './form.type';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import RegionInput from '@/components/input/RegionInput';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { Field, Label, RadioGroup, Radio } from '@headlessui/react';
import ImageFileInput from '@/components/input/ImageFileInput';
import RegionHubInput from '@/components/input/HubInput';
import Input from '@/components/input/Input';
import { getEvent, usePostEvent } from '@/services/event.service';
import Form from '@/components/form/Form';
import { EventTypeEnum } from '@/types/event.type';
import dayjs from 'dayjs';
import Toggle from '@/components/button/Toggle';
import { postShuttleDemandCoupon } from '@/utils/coupon.util';

const defaultValues = {
  name: '',
  imageUrl: '',
  regionId: '',
  regionHubId: '',
  type: 'CONCERT',
  dailyEvents: [],
  artistIds: [],
} satisfies CreateEventFormData;

const CreateEventForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<CreateEventFormData>({
    defaultValues,
  });

  const watch = useWatch({
    control,
    exact: false,
  });

  const {
    fields: dailyFields,
    append: appendDaily,
    remove: removeDaily,
  } = useFieldArray<CreateEventFormData>({
    control,
    name: 'dailyEvents',
  });

  const { mutateAsync: postEvent } = usePostEvent();

  const [isDemandCoupon, setIsDemandCoupon] = useState(true);

  const onSubmit = async (data: CreateEventFormData) => {
    if (!confirm('행사를 추가하시겠습니까?')) {
      return;
    }
    setIsSubmitting(true);
    try {
      const eventId = await postEvent(conform(data));
      const event = await getEvent(eventId);
      if (isDemandCoupon) {
        await postShuttleDemandCoupon(event);
      }
      alert('행사가 추가되었습니다.');
      router.push('/events');
    } catch (error) {
      console.error('Error creating events:', error);
      alert(
        '행사 추가에 실패했습니다, ' +
          (error instanceof Error && error.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.section>
          <Form.label>행사 이미지</Form.label>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <ImageFileInput
                type="concerts"
                value={value}
                setValue={(url) => onChange(url || null)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>행사명</Form.label>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                value={value}
                placeholder="IP 문제로 공식 명칭을 지양해 주세요. (e.g. 2025 SVT 9th 캐럿랜드 → 세븐틴 팬미팅)"
                setValue={onChange}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>행사장</Form.label>
          <Controller
            control={control}
            name="regionId"
            render={({ field: { onChange, value } }) => (
              <RegionInput
                value={value}
                setValue={(id) => onChange(id || null)}
              />
            )}
          />
          <Controller
            control={control}
            name="regionHubId"
            render={({ field: { onChange, value } }) => (
              <RegionHubInput
                hubType="EVENT_LOCATION"
                regionId={watch.regionId}
                value={value}
                setValue={(n) => onChange(n)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>
            날짜
            <button
              type="button"
              onClick={() =>
                appendDaily({
                  date: dayjs().startOf('day').toISOString(),
                })
              }
              className="w-fit text-basic-blue-400"
            >
              <PlusIcon />
            </button>
          </Form.label>
          <div className="flex w-full flex-col gap-4">
            {dailyFields.map((field, index) => (
              <Controller
                key={field.id}
                control={control}
                name={`dailyEvents.${index}.date` as const}
                render={({ field: { onChange, value } }) => (
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row items-center">
                      <Input
                        type="date"
                        className="w-full"
                        defaultValue={dayjs(value)
                          .tz('Asia/Seoul')
                          .startOf('day')
                          .format('YYYY-MM-DD')}
                        setValue={(str) => {
                          if (!str) {
                            return;
                          }
                          onChange(dayjs.tz(str, 'Asia/Seoul').toISOString());
                        }}
                      />
                      <button type="button" onClick={() => removeDaily(index)}>
                        <XIcon />
                      </button>
                    </div>
                  </div>
                )}
              />
            ))}
          </div>
        </Form.section>
        <Form.section>
          <Form.label>타입</Form.label>
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
                {EventTypeEnum.options.map((plan) => (
                  <Field key={plan} className="flex items-center gap-[2px]">
                    <Radio
                      value={plan}
                      className="group flex size-fit items-center justify-center rounded-8 bg-basic-white p-4 transition-transform hover:outline hover:outline-basic-blue-200 focus:outline focus:outline-basic-blue-200 active:scale-[0.9] data-[checked]:bg-basic-blue-400 data-[checked]:text-basic-white"
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
        </Form.section>
        <Form.section>
          <Form.label>수요조사 리워드 쿠폰</Form.label>
          <div>
            <Toggle
              value={isDemandCoupon}
              label="수요조사 리워드 쿠폰 생성하기"
              setValue={(v) => setIsDemandCoupon(v)}
            />
          </div>
        </Form.section>
        <Form.submitButton disabled={isSubmitting}>
          {isSubmitting ? '생성 중...' : '추가하기'}
        </Form.submitButton>
      </Form>
    </>
  );
};

export default CreateEventForm;
