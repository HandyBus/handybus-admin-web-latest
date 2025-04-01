'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { conform, type CreateHubFormType } from './form.type';
import Input from '@/components/input/Input';
import CoordInput from '@/components/input/CoordInput';
import RegionInput from '@/components/input/RegionInput';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import { useGetRegions, usePostRegionHub } from '@/services/hub.service';
import { Region } from '@/types/region.type';
import Heading from '@/components/text/Heading';
import Form from '@/components/form/Form';
import MapGuidesAtNewEditPage from '../components/MapGuidesAtNewEditPage';
import Toggle from '@/components/button/Toggle';
import { putShuttleStop } from '@/services/shuttleStops.service';
import { getTags } from '../utils/getTags.util';

interface Props {
  searchParams: { latitude: string; longitude: string; address: string };
}

export interface TagStates {
  isEventDestination: boolean;
  isShuttleHub: boolean;
}

const NewHubPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const [tagStates, setTagStates] = useState<TagStates>({
    isEventDestination: false,
    isShuttleHub: false,
  });

  const { data: regions } = useGetRegions();
  const { control, handleSubmit } = useForm<CreateHubFormType>({
    defaultValues: {
      regionId: undefined,
      name: '',
      coord: {
        address: searchParams.address || '',
        latitude: parseFloat(searchParams.latitude) || 37.574187,
        longitude: parseFloat(searchParams.longitude) || 126.976882,
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

  const { mutateAsync: addHub } = usePostRegionHub();

  const onSubmit = useCallback(
    async (data: CreateHubFormType) => {
      const target = regions?.find((r) => r.regionId === data.regionId);
      const confirmMessage =
        recommended?.regionId === data.regionId || false
          ? `장소를 추가하시겠습니까?`
          : `선택한 주소 "${data.coord.address}"가 지역 "${target ? `${target.provinceFullName} ${target.cityFullName}` : '<오류: 알수 없는 위치>'}에 등록됩니다. 장소를 추가하시겠습니까?`;
      if (confirm(confirmMessage)) {
        try {
          const res = await addHub({
            regionId: data.regionId,
            body: conform(data),
          });
          await putShuttleStop({
            regionHubId: res.regionHubId,
            types: getTags(tagStates),
          });
          alert('장소가 추가되었습니다.');
          router.push('/locations');
        } catch (error) {
          alert('장소 추가에 실패했습니다.');
          console.error(error);
        }
      }
    },
    [recommended, router, regions, tagStates],
  );

  const handleTagToggle = (key: keyof TagStates) => {
    setTagStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <main>
      <Heading>장소 추가</Heading>
      <Form onSubmit={handleSubmit(onSubmit)} method="post">
        <Form.section>
          <Form.label required>장소 이름</Form.label>
          <Controller
            control={control}
            name={`name`}
            render={({ field: { onChange, value } }) => (
              <Input value={value} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>위치 및 좌표</Form.label>
          <MapGuidesAtNewEditPage />
          <Controller
            control={control}
            name={`coord`}
            render={({ field: { onChange, value } }) => (
              <CoordInput coord={value} setCoord={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>지역</Form.label>
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
        </Form.section>
        <Form.section>
          <Form.label>태그 선택</Form.label>
          <div className="flex flex-row gap-4">
            <Toggle
              label="행사장소"
              value={tagStates.isEventDestination}
              setValue={() => handleTagToggle('isEventDestination')}
            />
            <Toggle
              label="정류장"
              value={tagStates.isShuttleHub}
              setValue={() => handleTagToggle('isShuttleHub')}
            />
          </div>
        </Form.section>
        <Form.submitButton>추가하기</Form.submitButton>
      </Form>
    </main>
  );
};

export default NewHubPage;
