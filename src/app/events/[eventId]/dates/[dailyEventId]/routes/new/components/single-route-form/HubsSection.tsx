'use client';

import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { MultiRouteFormValues } from '../../form.type';
import Form from '@/components/form/Form';
import Heading from '@/components/text/Heading';
import RegionHubInputWithDropdown from '@/components/input/RegionHubInputWithDropdown';
import DateTimeInput from '@/components/input/DateTimeInput';
import { useCallback, useMemo } from 'react';
import {
  RouteHubData,
  calculateRouteTimes,
  calculateUnionTimes,
  updateRouteFormValues,
} from '../../../utils/calculateRoute';

interface Props {
  index: number;
  dailyEventDate: string;
}

const HubsSection = ({ index, dailyEventDate }: Props) => {
  const { control, setValue } = useFormContext<MultiRouteFormValues>();
  const [
    destinationHub,
    toDestinationHubs,
    toDestinationArrivalTimes,
    fromDestinationArrivalTimes,
  ] = useWatch({
    control,
    name: [
      'destinationHub',
      `shuttleRoutes.${index}.toDestinationHubs`,
      `shuttleRoutes.${index}.toDestinationArrivalTimes`,
      `shuttleRoutes.${index}.fromDestinationArrivalTimes`,
    ],
  });

  const fromDestinationHubs = useMemo(
    () => toDestinationHubs?.toReversed() || [],
    [toDestinationHubs],
  );

  const {
    fields: toDestinationHubsFields,
    remove: removeToDestinationHub,
    insert: insertToDestinationHub,
  } = useFieldArray({
    control,
    name: `shuttleRoutes.${index}.toDestinationHubs`,
  });

  const fromDestinationHubsFields = useMemo(
    () => toDestinationHubsFields?.toReversed() || [],
    [toDestinationHubsFields],
  );

  const {
    remove: removeToDestinationArrivalTime,
    insert: insertToDestinationArrivalTime,
  } = useFieldArray({
    control,
    name: `shuttleRoutes.${index}.toDestinationArrivalTimes`,
  });

  const {
    remove: removeFromDestinationArrivalTime,
    insert: insertFromDestinationArrivalTime,
  } = useFieldArray({
    control,
    name: `shuttleRoutes.${index}.fromDestinationArrivalTimes`,
  });

  const handleAddToDestinationHub = useCallback(() => {
    const insertIndex = Math.max(0, toDestinationHubsFields.length - 1);
    insertToDestinationHub(insertIndex, {
      regionId: null,
      regionHubId: null,
      latitude: null,
      longitude: null,
    });
    insertToDestinationArrivalTime(insertIndex, { time: dailyEventDate });
    insertFromDestinationArrivalTime(insertIndex, { time: dailyEventDate });
  }, [
    toDestinationHubsFields.length,
    insertToDestinationHub,
    insertToDestinationArrivalTime,
    insertFromDestinationArrivalTime,
    dailyEventDate,
  ]);

  const handleRemoveToDestinationHub = useCallback(
    (hubIndex: number) => {
      removeToDestinationHub(hubIndex);
      removeToDestinationArrivalTime(hubIndex);
      removeFromDestinationArrivalTime(hubIndex);
    },
    [
      removeToDestinationHub,
      removeToDestinationArrivalTime,
      removeFromDestinationArrivalTime,
    ],
  );

  // 가는편 경유지 시간 계산
  const handleCalculateToDestinationArrivalTimes = useCallback(
    async (hubsArray: RouteHubData[]) => {
      const result = await calculateUnionTimes(hubsArray);
      if (result) {
        updateRouteFormValues('toDestination', result, setValue, index);
      }
    },
    [setValue, index],
  );

  // 오는편 경유지 시간 계산
  const handleCalculateFromDestinationArrivalTimes = useCallback(
    async (hubsArray: RouteHubData[]) => {
      const result = await calculateRouteTimes('fromDestination', hubsArray);
      if (result) {
        updateRouteFormValues('fromDestination', result, setValue, index);
      }
    },
    [setValue, index],
  );

  const convertToRouteHubData = useCallback(
    (
      hubs: ({
        regionId: string | null;
        regionHubId: string | null;
        latitude: number | null;
        longitude: number | null;
      } | null)[],
      arrivalTimes: {
        time: string;
      }[],
    ) =>
      hubs
        .filter(
          (
            hub,
          ): hub is {
            regionId: string;
            regionHubId: string;
            latitude: number;
            longitude: number;
          } =>
            !!hub?.regionId &&
            !!hub?.regionHubId &&
            !!hub?.latitude &&
            !!hub?.longitude,
        )
        .map((hub, hubIndex) => ({
          regionId: hub.regionId,
          regionHubId: hub.regionHubId,
          latitude: hub.latitude,
          longitude: hub.longitude,
          arrivalTime: arrivalTimes[hubIndex]?.time || '',
        })),
    [],
  );

  const handleCalculateArrivalTimes = useCallback(async () => {
    const userConfirmed = confirm(
      '경로 소요 시간을 계산하시겠습니까?\n경로 소요 시간은 도착지의 시간을 기준으로 카카오 지도 길찾기 결과를 통해 계산됩니다.\n기존에 설정해두었던 나머지 경유지의 시간은 변경됩니다.',
    );
    if (!userConfirmed) {
      return;
    }
    const toDestinationHubsData = convertToRouteHubData(
      toDestinationHubs,
      toDestinationArrivalTimes,
    );
    const fromDestinationHubsData = convertToRouteHubData(
      fromDestinationHubs,
      fromDestinationArrivalTimes,
    );
    try {
      await handleCalculateToDestinationArrivalTimes(toDestinationHubsData);
    } catch (error) {
      alert(
        '가는편 경로 소요 시간 계산 중 오류가 발생했습니다.\n' +
          (error instanceof Error ? error.message : '알 수 없는 오류'),
      );
      return;
    }
    try {
      await handleCalculateFromDestinationArrivalTimes(fromDestinationHubsData);
    } catch (error) {
      alert(
        '오는편 경로 소요 시간 계산 중 오류가 발생했습니다.\n' +
          (error instanceof Error ? error.message : '알 수 없는 오류'),
      );
      return;
    }
    alert('경로 소요 시간 계산이 완료되었습니다.');
  }, [
    toDestinationHubs,
    toDestinationArrivalTimes,
    fromDestinationHubs,
    fromDestinationArrivalTimes,
    handleCalculateToDestinationArrivalTimes,
    handleCalculateFromDestinationArrivalTimes,
    convertToRouteHubData,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <Form.label required>경유지</Form.label>
      <article className="pb-12">
        <Heading.h5 backgroundColor="yellow" className="flex">
          가는편
          <button
            type="button"
            onClick={handleAddToDestinationHub}
            className="ml-8 text-14 text-basic-blue-400"
          >
            추가
          </button>
          <button
            type="button"
            onClick={handleCalculateArrivalTimes}
            className="ml-auto text-14 text-basic-blue-400"
          >
            경로 소요 시간 계산
          </button>
        </Heading.h5>
        <ul className="flex flex-col gap-8">
          {toDestinationHubsFields.map((field, hubIndex) => {
            const isDestinationHub =
              hubIndex === toDestinationHubsFields.length - 1;
            return (
              <li
                key={field.id}
                className={`grid grid-cols-[20px_1fr_1fr_50px] items-center justify-items-center gap-12 rounded-[6px] p-12 ${isDestinationHub ? 'bg-basic-blue-100' : 'bg-basic-grey-100/50'}`}
              >
                <h5 className="text-16 font-600 text-basic-grey-700">
                  {hubIndex + 1}
                </h5>
                <div className="flex flex-col">
                  {isDestinationHub ? (
                    <div className="flex items-center gap-8 rounded-[4px] bg-basic-grey-100 p-8">
                      <span className="text-14 text-basic-grey-600">
                        {destinationHub?.name || '도착지가 선택되지 않음'}
                      </span>
                      <span className="text-12 text-basic-blue-400">
                        (자동 설정)
                      </span>
                    </div>
                  ) : (
                    <Controller
                      control={control}
                      name={
                        `shuttleRoutes.${index}.toDestinationHubs.${hubIndex}` as const
                      }
                      render={({ field: { onChange, value } }) => (
                        <RegionHubInputWithDropdown
                          hubType="SHUTTLE_HUB"
                          regionId={value?.regionId ?? null}
                          setRegionId={(regionId) =>
                            onChange({ ...value, regionId })
                          }
                          regionHubId={value?.regionHubId ?? null}
                          setRegionHubId={(regionHub) =>
                            onChange({
                              ...value,
                              regionHubId: regionHub.regionHubId,
                              latitude: regionHub.latitude,
                              longitude: regionHub.longitude,
                            })
                          }
                        />
                      )}
                    />
                  )}
                </div>
                <Controller
                  control={control}
                  name={
                    `shuttleRoutes.${index}.toDestinationArrivalTimes.${hubIndex}` as const
                  }
                  render={({ field: { onChange, value } }) => (
                    <DateTimeInput
                      value={value.time}
                      setValue={(time) => onChange({ ...value, time })}
                    />
                  )}
                />
                <div className="flex flex-col items-center justify-center gap-8">
                  <button
                    type="button"
                    onClick={() => handleRemoveToDestinationHub(hubIndex)}
                    className="text-basic-red-500 disabled:opacity-30"
                    disabled={isDestinationHub}
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </article>
      <article className="pb-12">
        <Heading.h5
          backgroundColor="yellow"
          className="flex items-baseline gap-12"
        >
          오는편{' '}
          <span className="text-12 font-400 text-basic-blue-400">
            (미러링 보장)
          </span>
        </Heading.h5>
        <ul className="flex flex-col gap-8">
          {fromDestinationHubsFields.map((field, hubIndex) => {
            const reversedHubIndex =
              fromDestinationHubsFields.length - 1 - hubIndex;
            const isDestinationHub =
              reversedHubIndex === fromDestinationHubsFields.length - 1;
            return (
              <li
                key={field.id}
                className={`grid grid-cols-[20px_1fr_1fr_50px] items-center justify-items-center gap-12 rounded-[6px] p-12 ${isDestinationHub ? 'bg-basic-blue-100' : 'bg-basic-grey-100/50'}`}
              >
                <h5 className="text-16 font-600 text-basic-grey-700">
                  {hubIndex + 1}
                </h5>
                <div className="flex flex-col">
                  {isDestinationHub ? (
                    <div className="flex items-center gap-8 rounded-[4px] bg-basic-grey-100 p-8">
                      <span className="text-14 text-basic-grey-600">
                        {destinationHub?.name || '도착지가 선택되지 않음'}
                      </span>
                      <span className="text-12 text-basic-blue-400">
                        (자동 설정)
                      </span>
                    </div>
                  ) : (
                    <Controller
                      control={control}
                      name={
                        `shuttleRoutes.${index}.toDestinationHubs.${reversedHubIndex}` as const
                      }
                      render={({ field: { onChange, value } }) => (
                        <RegionHubInputWithDropdown
                          hubType="SHUTTLE_HUB"
                          regionId={value?.regionId ?? null}
                          regionHubId={value?.regionHubId ?? null}
                          setRegionId={(regionId) =>
                            onChange({ ...value, regionId })
                          }
                          setRegionHubId={(regionHub) =>
                            onChange({
                              ...value,
                              regionHubId: regionHub.regionHubId,
                              latitude: regionHub.latitude,
                              longitude: regionHub.longitude,
                            })
                          }
                          disabled
                        />
                      )}
                    />
                  )}
                </div>
                <Controller
                  control={control}
                  name={
                    `shuttleRoutes.${index}.fromDestinationArrivalTimes.${hubIndex}` as const
                  }
                  render={({ field: { onChange, value } }) => (
                    <DateTimeInput
                      value={value.time}
                      setValue={(time) => onChange({ ...value, time })}
                    />
                  )}
                />
              </li>
            );
          })}
        </ul>
      </article>
    </div>
  );
};

export default HubsSection;
