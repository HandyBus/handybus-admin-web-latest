'use client';

import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { BulkRouteFormValues } from '../../form.type';
import Form from '@/components/form/Form';
import Heading from '@/components/text/Heading';
import RegionHubInputWithDropdown from '@/components/input/RegionHubInputWithDropdown';
import DateTimeInput from '@/components/input/DateTimeInput';
import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

interface Props {
  index: number;
}

const HubsSection = ({ index }: Props) => {
  const { control } = useFormContext<BulkRouteFormValues>();
  const [destinationHub, toDestinationArrivalTime, regularPrice] = useWatch({
    control,
    name: [
      'destinationHub',
      'toDestinationArrivalTime',
      `routes.${index}.regularPrice`,
    ],
  });

  const {
    fields: toDestinationHubsFields,
    remove: removeToDestinationHub,
    insert: insertToDestinationHub,
  } = useFieldArray({
    control,
    name: `routes.${index}.toDestinationHubs`,
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
    name: `routes.${index}.toDestinationArrivalTimes`,
  });

  const {
    remove: removeFromDestinationArrivalTime,
    insert: insertFromDestinationArrivalTime,
  } = useFieldArray({
    control,
    name: `routes.${index}.fromDestinationArrivalTimes`,
  });

  // 기본 날짜는 첫 번째 선택된 daily event의 날짜를 사용
  // HubsSection은 노선 편집 시 사용되므로, 실제 daily event 날짜는 제출 시 calculateArrivalTime에서 처리됨
  // 여기서는 toDestinationArrivalTime의 시간 부분만 사용하여 기본값 설정
  const baseDate = useMemo(() => {
    if (toDestinationArrivalTime) {
      // toDestinationArrivalTime은 HH:mm 형식이므로, 오늘 날짜에 시간을 적용
      const [hours, minutes] = toDestinationArrivalTime.split(':').map(Number);
      return dayjs()
        .set('hour', hours)
        .set('minute', minutes)
        .set('second', 0)
        .set('millisecond', 0)
        .toISOString();
    }
    return dayjs().toISOString();
  }, [toDestinationArrivalTime]);

  const handleAddToDestinationHub = useCallback(() => {
    const insertIndex = Math.max(0, toDestinationHubsFields.length - 1);
    insertToDestinationHub(insertIndex, {
      regionId: null,
      regionHubId: null,
      latitude: null,
      longitude: null,
    });
    insertToDestinationArrivalTime(insertIndex, { time: baseDate });
    insertFromDestinationArrivalTime(insertIndex, { time: baseDate });
  }, [
    toDestinationHubsFields.length,
    insertToDestinationHub,
    insertToDestinationArrivalTime,
    insertFromDestinationArrivalTime,
    baseDate,
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

  const showToDestinationHubs = useMemo(() => {
    return regularPrice?.toDestination > 0 || regularPrice?.roundTrip > 0;
  }, [regularPrice?.toDestination, regularPrice?.roundTrip]);

  const showFromDestinationHubs = useMemo(() => {
    return regularPrice?.fromDestination > 0 || regularPrice?.roundTrip > 0;
  }, [regularPrice?.fromDestination, regularPrice?.roundTrip]);

  return (
    <div className="flex flex-col gap-8">
      <Form.label required>경유지</Form.label>
      <article className="pb-12">
        <Heading.h5 backgroundColor="yellow" className="flex">
          행사장행
          <button
            type="button"
            onClick={handleAddToDestinationHub}
            className="ml-8 text-14 text-basic-blue-400 disabled:opacity-30"
            disabled={!showToDestinationHubs}
          >
            추가
          </button>
        </Heading.h5>
        {showToDestinationHubs ? (
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
                          `routes.${index}.toDestinationHubs.${hubIndex}` as const
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
                            disabled={
                              regularPrice?.toDestination === 0 &&
                              regularPrice?.roundTrip === 0
                            }
                          />
                        )}
                      />
                    )}
                  </div>
                  <Controller
                    control={control}
                    name={
                      `routes.${index}.toDestinationArrivalTimes.${hubIndex}.time` as const
                    }
                    render={({ field: { onChange, value } }) => (
                      <DateTimeInput
                        value={value}
                        setValue={(time) => onChange(time)}
                        disabled={
                          regularPrice?.toDestination === 0 &&
                          regularPrice?.roundTrip === 0
                        }
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
        ) : (
          <div className="text-14 text-basic-grey-600">
            행사장행 또는 왕복 가격이 없기에 경유지가 설정되지 않습니다.
          </div>
        )}
      </article>
      <article className="pb-12">
        <Heading.h5
          backgroundColor="yellow"
          className="flex items-baseline gap-12"
        >
          귀가행
        </Heading.h5>
        {showFromDestinationHubs ? (
          <ul className="flex flex-col gap-8">
            {fromDestinationHubsFields.map((field, hubIndex) => {
              const reversedHubIndex =
                fromDestinationHubsFields.length - 1 - hubIndex;
              const isDestinationHub =
                reversedHubIndex === fromDestinationHubsFields.length - 1;
              return (
                <li
                  key={field.id}
                  className={`grid grid-cols-[20px_1fr_1fr] items-center justify-items-center gap-12 rounded-[6px] p-12 ${isDestinationHub ? 'bg-basic-blue-100' : 'bg-basic-grey-100/50'}`}
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
                          `routes.${index}.toDestinationHubs.${reversedHubIndex}` as const
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
                            disabled={
                              regularPrice?.fromDestination === 0 &&
                              regularPrice?.roundTrip === 0
                            }
                          />
                        )}
                      />
                    )}
                  </div>
                  <Controller
                    control={control}
                    name={
                      `routes.${index}.fromDestinationArrivalTimes.${hubIndex}.time` as const
                    }
                    render={({ field: { onChange, value } }) => (
                      <DateTimeInput
                        value={value}
                        setValue={(time) => onChange(time)}
                        disabled={
                          regularPrice?.fromDestination === 0 &&
                          regularPrice?.roundTrip === 0
                        }
                      />
                    )}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-14 text-basic-grey-600">
            귀가행 또는 왕복 가격이 없기에 경유지가 설정되지 않습니다.
          </div>
        )}
      </article>
    </div>
  );
};

export default HubsSection;
