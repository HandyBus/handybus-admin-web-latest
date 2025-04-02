'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { conform, type EditHubFormType } from './form.type';
import Input from '@/components/input/Input';
import CoordInput from '@/components/input/CoordInput';
import RegionInput from '@/components/input/RegionInput';
import { filterByFuzzy } from '@/utils/fuzzy.util';
import {
  useGetRegionHub,
  useGetRegions,
  usePutRegionHub,
} from '@/services/hub.service';
import { Region } from '@/types/region.type';
import Heading from '@/components/text/Heading';
import Form from '@/components/form/Form';
import { RegionHub } from '@/types/hub.type';
import MapGuidesAtNewEditPage from '@/app/locations/components/MapGuidesAtNewEditPage';
import Toggle from '@/components/button/Toggle';
import { putShuttleStop } from '@/services/shuttleStops.service';
import { TagStates } from '@/app/locations/location.type';
import { getTags } from '@/app/locations/utils/getTags.util';

interface Props {
  params: { regionId: string; hubId: string };
}

const EditHubPage = ({ params }: Props) => {
  const {
    data: regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    error: regionsError,
  } = useGetRegions();

  const {
    data: hub,
    isPending: isHubPending,
    isError: isHubError,
    error: hubError,
  } = useGetRegionHub(params.regionId, params.hubId);

  return (
    <>
      <Heading>장소 수정하기</Heading>
      {(isRegionsPending || isHubPending) && <div>Loading...</div>}
      {(isRegionsError || isHubError) && (
        <div>Error: {regionsError?.message || hubError?.message}</div>
      )}
      {regions && hub && <EditForm regions={regions} hub={hub} />}
    </>
  );
};

export default EditHubPage;

interface EditFormProps {
  regions: Region[];
  hub: RegionHub;
}

const EditForm = ({ regions, hub }: EditFormProps) => {
  const router = useRouter();
  const [tagStates, setTagStates] = useState<TagStates>({
    isEventDestination: hub.eventDestination,
    isShuttleHub: hub.shuttleHub,
  });
  const defaultValues = {
    regionId: hub.regionId,
    name: hub.name,
    coord: {
      address: hub.address,
      latitude: hub.latitude,
      longitude: hub.longitude,
    },
  } satisfies EditHubFormType;

  const { control, handleSubmit } = useForm<EditHubFormType>({
    defaultValues,
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

  const { mutateAsync: putHub } = usePutRegionHub({
    onError: (error) => {
      alert(`장소 수정에 실패했습니다.`);
      console.error(error);
    },
  });

  const handleTagToggle = (key: keyof TagStates) => {
    setTagStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const onSubmit = useCallback(
    async (data: EditHubFormType) => {
      const target = regions?.find((r) => r.regionId === data.regionId);
      const confirmMessage =
        recommended?.regionId === data.regionId || false
          ? `장소를 수정하시겠습니까?`
          : `선택한 주소 "${data.coord.address}"가 지역 "${target ? `${target.provinceFullName} ${target.cityFullName}` : '<오류: 알수 없는 위치>'}에 등록됩니다. 장소를 수정하시겠습니까?`;
      if (confirm(confirmMessage)) {
        await putHub({
          regionId: data.regionId,
          regionHubId: hub.regionHubId,
          body: conform(data),
        });
        await putShuttleStop({
          regionHubId: hub.regionHubId,
          types: getTags(tagStates),
        });
        alert('장소가 수정되었습니다.');
        router.push('/locations');
      }
    },
    [recommended, router, regions, tagStates],
  );

  return (
    <main>
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
        <Form.submitButton>수정하기</Form.submitButton>
      </Form>
    </main>
  );
};
