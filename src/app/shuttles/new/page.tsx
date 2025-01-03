'use client';

import { useCallback } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { addShuttle } from '@/app/actions/shuttle.action';
import { type CreateShuttleFormType, conform } from './types/form.type';
import { useRouter } from 'next/navigation';
import ArtistInput from '@/components/input/ArtistInput';
import { Controller } from 'react-hook-form';
import RegionInput from '@/components/input/RegionInput';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button, Field, Label, RadioGroup, Radio } from '@headlessui/react';
import ImageFileInput from '@/components/input/ImageFileInput';
import HubInput from '@/components/input/HubInput';
import Input from '@/components/input/Input';
import dayjs from 'dayjs';
import { today, toDateOnly } from '@/utils/date.util';

const defaultValues = {
  name: '',
  regionId: 0,
  regionHubId: 0,
  type: 'CONCERT',
  dailyShuttles: [],
  detail: {
    name: '',
    image: '',
    artistIds: [],
  },
} satisfies CreateShuttleFormType;

const ShuttleForm = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<CreateShuttleFormType>({
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
  } = useFieldArray<CreateShuttleFormType>({
    control,
    name: 'dailyShuttles',
  });

  const {
    fields: concertArtistFields,
    append: appendArtist,
    remove: removeArtist,
  } = useFieldArray<CreateShuttleFormType>({
    control,
    name: 'detail.artistIds',
  });

  const onSubmit = useCallback(
    async (data: CreateShuttleFormType) => {
      if (confirm('셔틀을 추가하시겠습니까?') === false) return;
      try {
        await addShuttle(conform(data));
        alert('셔틀이 추가되었습니다.');
        router.push('/shuttles');
      } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          throw error;
        }
        console.error('Error adding shuttle:', error);
        alert('셔틀 추가에 실패했습니다');
        throw error;
      }
    },
    [router],
  );

  return (
    <form
      className="flex flex-col gap-8
      [&>label]:p-16 [&>label]:rounded-lg [&>label]:bg-grey-50
      [&>label]:flex [&>label]:flex-col [&>label]:gap-4
      "
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>셔틀 이름</label>
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
      <label>장소</label>
      <Controller
        control={control}
        name="regionId"
        render={({ field: { onChange, value } }) => (
          <RegionInput value={value} setValue={(id) => onChange(id || null)} />
        )}
      />
      <label>거점지</label>
      <Controller
        control={control}
        name="regionHubId"
        render={({ field: { onChange, value } }) => (
          <HubInput
            regionId={watch.regionId}
            value={value}
            setValue={(n) => onChange(n)}
          />
        )}
      />
      <div className="flex flex-col gap-4 bg-grey-50 p-16 rounded-lg">
        <header>
          <label>날짜</label>
          <button
            type="button"
            onClick={() => appendDaily({ date: today() })}
            className="w-fit text-blue-500"
          >
            <PlusIcon />
          </button>
        </header>
        <div className="flex flex-col gap-4 w-full">
          {dailyFields.length === 0 && <p>날짜를 추가해주세요.</p>}
          {dailyFields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`dailyShuttles.${index}.date` as const}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col w-full">
                  <div className="flex flex-row w-full items-center">
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
      </div>
      <label>타입</label>
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
      <label>(콘서트/페스티벌) 이름</label>
      <Controller
        control={control}
        name="detail.name"
        render={({ field: { onChange, value } }) => (
          <Input
            type="text"
            value={value}
            setValue={onChange}
            placeholder="콘서트/페스티벌 이름"
          />
        )}
      />
      <label>포스터 이미지 URL</label>
      <Controller
        control={control}
        name="detail.image"
        render={({ field: { onChange, value } }) => (
          <ImageFileInput
            type="concerts"
            value={value}
            setValue={(url) => onChange(url || null)}
          />
        )}
      />
      <div className="flex flex-col gap-4 bg-grey-50 p-16 rounded-lg">
        <header>
          <label>아티스트</label>
          <button
            type="button"
            onClick={() => appendArtist({ artistId: 0 })}
            className="w-fit text-blue-500"
          >
            <PlusIcon />
          </button>
        </header>
        <div className="flex flex-col gap-4">
          {concertArtistFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <Controller
                control={control}
                name={`detail.artistIds.${index}.artistId`}
                render={({ field: { onChange, value } }) => (
                  <ArtistInput
                    value={value}
                    setValue={(id) => onChange(id || null)}
                  />
                )}
              />
              <Button
                className="hover:text-red-500 transition-colors"
                type="button"
                onClick={() => removeArtist(index)}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 rounded-lg p-8 text-white hover:bg-blue-600"
      >
        추가하기
      </button>
    </form>
  );
};

export default ShuttleForm;
