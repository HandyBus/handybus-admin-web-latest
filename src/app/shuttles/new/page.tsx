'use client';

import { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import tw from 'tailwind-styled-components';
import { addShuttle } from '@/app/actions/shuttle.action';
import { type CreateShuttleFormType, conform } from './form.type';
import { useRouter } from 'next/navigation';

const Input = tw.input`
  rounded-lg
  border
  p-4
`;

const defaultValues = {
  name: '',
  regionID: 0,
  regionHubID: 0,
  type: 'CONCERT',
  dailyShuttles: [],
  detail: {
    name: '',
    image: '',
    artistIDs: [],
  },
} satisfies CreateShuttleFormType;

const NewShuttlePage = () => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<CreateShuttleFormType>({
    defaultValues,
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
    name: 'detail.artistIDs',
  });

  const onSubmit = useCallback(
    async (data: CreateShuttleFormType) => {
      if (confirm('셔틀을 추가하시겠습니까?') === false) return;
      try {
        const formattedData = conform(data);
        await addShuttle(formattedData);
        alert('셔틀이 추가되었습니다.');
        router.push('/shuttle');
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
      className="flex flex-col gap-16 bg-grey-50 rounded-lg p-16"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>
        셔틀 이름
        <Input {...register('name')} />
      </label>
      <label>
        장소
        <Input {...register('regionID')} />
      </label>

      <label>
        거점지
        <Input {...register('regionHubID')} />
      </label>

      <div>
        <label>날짜</label>
        <button
          type="button"
          onClick={() => appendDaily({ date: new Date(Date.now()) })}
          className="w-fit text-blue-500"
        >
          추가
        </button>
        <div className="flex flex-col gap-4">
          {dailyFields.length === 0 && <p>날짜를 추가해주세요.</p>}
          {dailyFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <Input
                type="date"
                {...register(`dailyShuttles.${index}.date` as const)}
              />
              <button type="button" onClick={() => removeDaily(index)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <label>
        타입
        <select {...register('type')}>
          <option value="CONCERT">콘서트</option>
          <option value="FESTIVAL">페스티벌</option>
        </select>
      </label>

      <label>
        (콘서트/페스티벌) 이름
        <Input {...register('detail.name')} />
      </label>
      <label>
        포스터 이미지 URL
        <Input {...register('detail.image')} type="url" />
      </label>
      <div>
        <label>아티스트 ID</label>
        <button
          type="button"
          onClick={() => appendArtist({ id: 0 })}
          className="w-fit text-blue-500"
        >
          추가
        </button>
        <div className="flex flex-col gap-4">
          {concertArtistFields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <Input
                type="number"
                {...register(`detail.artistIDs.${index}.id`, {
                  valueAsNumber: true,
                })}
              />
              <button type="button" onClick={() => removeArtist(index)}>
                삭제
              </button>
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

export default NewShuttlePage;
