'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { conform, type CreateHubFormType } from './types/form.type';
import Input from '@/components/input/Input';
import CoordInput from '@/components/input/CoordInput';
import RegionInput from '@/components/input/RegionInput';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { useGetRegions, usePostRegionHub } from '@/services/location.service';
import { Region } from '@/types/region';
import Heading from '@/components/text/Heading';

const NewHubPage = () => {
  const router = useRouter();

  const { data: regions } = useGetRegions();

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

  const recommended: Region | undefined = useMemo(() => {
    if (!regions || !address) {
      return undefined;
    }
    return filterByFuzzy(
      regions,
      address,
      (t) => `${t.provinceShortName} ${t.cityFullName}`,
    ).at(0);
  }, [regions, address]);

  const { mutate: addHub } = usePostRegionHub({
    onSuccess: () => {
      alert('거점지가 추가되었습니다.');
      router.push('/hubs');
    },
    onError: (error) => {
      alert(`거점지 추가에 실패했습니다.`);
      console.error(error);
    },
  });

  const onSubmit = useCallback(
    (data: CreateHubFormType) => {
      const target = regions?.find((r) => r.regionId === data.regionId);
      const confirmMessage =
        recommended?.regionId === data.regionId || false
          ? `거점지를 추가하시겠습니까?`
          : `선택한 주소 "${data.coord.address}"가 지역 "${target ? `${target.provinceFullName} ${target.cityFullName}` : '<오류: 알수 없는 위치>'}에 등록됩니다. 거점지를 추가하시겠습니까?`;
      if (confirm(confirmMessage)) {
        addHub({ regionId: data.regionId, body: conform(data) });
      }
    },
    [recommended, router, regions],
  );

  return (
    <main>
      <Heading>거점지 추가</Heading>
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
            <div className="gap-2 flex flex-col items-start">
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
