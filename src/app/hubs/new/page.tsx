'use client';

import { useRouter } from 'next/navigation';

import { useCallback, useMemo } from 'react';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { conform, type CreateHubFormType } from './types/form.type';
import Input from '@/components/input/Input';
import CoordInput from '@/components/input/CoordInput';
import RegionInput from '@/components/input/RegionInput';
import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/app/actions/regions.action';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { RegionType } from '@/types/region.type';
import { addHub } from '@/app/actions/hub.action';

const NewHubPage = () => {
  const router = useRouter();

  const { data: regions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => getRegions(),
  });

  const { control, handleSubmit } = useForm<CreateHubFormType>({
    defaultValues: {
      regionId: undefined,
      name: '',
      coord: {
        address: '',
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const address = useWatch({ control, name: 'coord.address' });

  const recommended: RegionType | undefined = useMemo(() => {
    if (!regions || !address) {
      return undefined;
    }
    return filterByFuzzy(
      regions,
      address,
      (t) => `${t.provinceShortName} ${t.cityFullName}`,
    ).at(0);
  }, [regions, address]);

  const onSubmit = useCallback(
    (data: CreateHubFormType) => {
      const confirmMessage =
        recommended?.regionId === data.regionId || false
          ? `거점지를 추가하시겠습니까?`
          : `선택한 주소 "${data.coord.address}"가 지역 "${recommended?.provinceFullName} ${recommended?.cityFullName}"에 등록됩니다. 거점지를 추가하시겠습니까?`;
      if (confirm(confirmMessage)) {
        addHub(data.regionId, conform(data))
          .then(() => {
            alert('거점지가 추가되었습니다.');
          })
          .catch((error) => {
            const stack =
              error instanceof Error ? error.stack : 'Unknown Error';
            alert(`거점지 추가에 실패했습니다. 스택: ${stack}`);
          })
          .finally(() => router.push('/hubs'));
      }
    },
    [recommended, router],
  );

  return (
    <main className="h-full w-full bg-white flex flex-col gap-16">
      <h2 className="text-24 font-500">거점지 정보</h2>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
        method="post"
      >
        <label>거점지 이름</label>
        <Controller
          control={control}
          name={`name`}
          render={({ field: { onChange, value } }) => (
            <Input value={value} setValue={onChange} />
          )}
        />
        <label>위치 및 좌표</label>
        <Controller
          control={control}
          name={`coord`}
          render={({ field: { onChange, value } }) => (
            <CoordInput coord={value} setCoord={onChange} />
          )}
        />
        <label>지역</label>
        <Controller
          control={control}
          name={`regionId`}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col gap-2 items-start">
              {recommended && (
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => {
                    onChange(recommended.regionId);
                  }}
                >
                  이 지역이 맞나요?: {recommended.provinceFullName}{' '}
                  {recommended.cityFullName}
                </button>
              )}
              {value}
              <RegionInput value={value} setValue={onChange} />
            </div>
          )}
        />
        <button type="submit">거점지 추가하기</button>
      </form>
    </main>
  );
};

export default NewHubPage;
