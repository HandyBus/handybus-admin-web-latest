'use client';

import { useCallback } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { type CreateEventFormData, conform } from './types/form.type';
import { useRouter } from 'next/navigation';
import ArtistInput from '@/components/input/ArtistInput';
import { Controller } from 'react-hook-form';
import RegionInput from '@/components/input/RegionInput';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button, Field, Label, RadioGroup, Radio } from '@headlessui/react';
import ImageFileInput from '@/components/input/ImageFileInput';
import RegionHubInput from '@/components/input/HubInput';
import Input from '@/components/input/Input';
import dayjs from 'dayjs';
import { today, toDateOnly } from '@/utils/date.util';
import { usePostEvent } from '@/services/shuttleOperation.service';
import Form from '@/components/form/Form';

const defaultValues = {
  name: '',
  imageUrl: '',
  regionId: 0,
  regionHubId: 0,
  type: 'CONCERT',
  dailyEvents: [],
  artistIds: [],
} satisfies CreateEventFormData;

const CreateEventForm = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<CreateEventFormData>({
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

  const {
    fields: concertArtistFields,
    append: appendArtist,
    remove: removeArtist,
  } = useFieldArray<CreateEventFormData>({
    control,
    name: 'artistIds',
  });

  const { mutate: postEvent } = usePostEvent({
    onSuccess: () => {
      alert('행사가 추가되었습니다.');
      router.push('/events');
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error;
      }
      console.error('Error creating events:', error);
      alert(
        '행사 추가에 실패했습니다, ' +
          (error instanceof Error && error.message),
      );
      throw error;
    },
  });

  const onSubmit = useCallback(
    async (data: CreateEventFormData) => {
      if (confirm('행사를 추가하시겠습니까?')) {
        postEvent(conform(data));
      }
    },
    [router, postEvent],
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.section>
        <Form.label>행사 이름</Form.label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              type="text"
              value={value}
              placeholder="셔틀 이름"
              setValue={onChange}
            />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label>장소</Form.label>
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
            onClick={() => appendDaily({ date: today() })}
            className="w-fit text-blue-500"
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
                      value={dayjs(value).format('YYYY-MM-DD')}
                      // TODO check timezone issue
                      setValue={(str) => onChange(toDateOnly(new Date(str)))}
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
              {['CONCERT', 'FESTIVAL'].map((plan) => (
                <Field key={plan} className="gap-2 flex items-center">
                  <Radio
                    value={plan}
                    className="group flex size-fit items-center justify-center rounded-lg bg-white p-4
                    transition-transform
                    hover:outline
                    hover:outline-blue-200
                    focus:outline
                    focus:outline-blue-200
                    active:scale-[0.9]
                    data-[checked]:bg-blue-400
                    data-[checked]:text-white
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
      </Form.section>
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
        <Form.label>
          아티스트{' '}
          <button
            type="button"
            onClick={() => appendArtist({ artistId: null })}
            className="w-fit text-blue-500"
          >
            <PlusIcon />
          </button>
        </Form.label>
        <div className="flex flex-col gap-4">
          {concertArtistFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <Controller
                control={control}
                name={`artistIds.${index}.artistId`}
                render={({ field: { onChange, value } }) => (
                  <ArtistInput
                    value={value}
                    setValue={(id) => onChange(id || null)}
                  />
                )}
              />
              <Button
                className="transition-colors hover:text-red-500"
                type="button"
                onClick={() => removeArtist(index)}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      </Form.section>
      <Form.submitButton>추가하기</Form.submitButton>
    </Form>
  );
};

export default CreateEventForm;
