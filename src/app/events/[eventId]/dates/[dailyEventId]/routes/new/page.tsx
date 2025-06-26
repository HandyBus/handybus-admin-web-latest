'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import { useCallback, useMemo, useState } from 'react';
import DateInput from '@/components/input/DateInput';
import DateTimeInput from '@/components/input/DateTimeInput';
import { useGetEvent } from '@/services/event.service';
import { usePostShuttleRoute } from '@/services/shuttleRoute.service';
import { EventsViewEntity } from '@/types/event.type';
import Heading from '@/components/text/Heading';
import FormContainer from '@/components/form/Form';
import Callout from '@/components/text/Callout';
import NumberInput from '@/components/input/NumberInput';
import { discountPercent } from '../discountPercent.util';
import { CreateFormValues } from './form.type';
import {
  calculateUnionTimes,
  updateRouteFormValues,
} from '../utils/calculateRoute';
import { calculateRouteTimes } from '../utils/calculateRoute';
import { RouteHubData } from '../utils/calculateRoute';
import { extractHubs } from './utils/extractHubs';
import { transformToShuttleRouteRequest } from './utils/transformToShuttleRouteRequest';
import { validateShuttleRouteData } from './utils/validateShuttleRouteData';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId } = params;

  const { data: event, isPending, isError, error } = useGetEvent(eventId);

  const defaultDate = useMemo(() => {
    return event?.dailyEvents.find((de) => de.dailyEventId === dailyEventId)
      ?.date;
  }, [event, dailyEventId]);

  const defaultValues: CreateFormValues = useMemo(
    () => ({
      name: '',
      maxPassengerCount: 0,
      earlybirdDeadline: defaultDate ?? '',
      reservationDeadline: defaultDate ?? '',
      hasEarlybird: false,
      earlybirdPrice: {
        toDestination: 1000000,
        fromDestination: 1000000,
        roundTrip: 1000000,
      },
      regularPrice: {
        toDestination: 1000000,
        fromDestination: 1000000,
        roundTrip: 1000000,
      },
      shuttleRouteHubsFromDestination: [
        {
          regionId: null,
          regionHubId: null,
          latitude: null,
          longitude: null,
          arrivalTime: defaultDate ?? '',
        },
        {
          regionId: null,
          latitude: null,
          longitude: null,
          regionHubId: null,
          arrivalTime: defaultDate ?? '',
        },
      ],
      shuttleRouteHubsToDestination: [
        {
          regionId: null,
          regionHubId: null,
          latitude: null,
          longitude: null,
          arrivalTime: defaultDate ?? '',
        },
        {
          regionId: null,
          regionHubId: null,
          latitude: null,
          longitude: null,
          arrivalTime: defaultDate ?? '',
        },
      ],
    }),
    [defaultDate],
  );

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error! {error?.message}</div>;

  return (
    <Form
      event={event}
      params={params}
      defaultValues={defaultValues}
      defaultDate={defaultDate ?? ''}
    />
  );
};

export default Page;

interface FormProps extends Props {
  event: EventsViewEntity;
  defaultValues: CreateFormValues;
  defaultDate: string;
}

const Form = ({ params, defaultValues, defaultDate }: FormProps) => {
  const { eventId, dailyEventId } = params;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<CreateFormValues>({
    defaultValues,
  });

  const watchHasEarlybird = watch('hasEarlybird');
  const watchRegularPrice = watch('regularPrice');
  const watchEarlybirdPrice = watch('earlybirdPrice');

  const {
    fields: fromDestHubFields,
    append: appendFromDestHub,
    remove: removeFromDestHub,
    swap: swapFromDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsFromDestination',
  });

  const {
    fields: toDestHubFields,
    prepend: prependToDestHub,
    remove: removeToDestHub,
    swap: swapToDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsToDestination',
  });

  const { mutateAsync: postRoute } = usePostShuttleRoute();

  const onSubmit = async (data: CreateFormValues) => {
    if (
      !confirm(
        '추가하시겠습니까? 확인을 누르시면 가격은 더 이상 변경할 수 없습니다. ',
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { forwardHubs, returnHubs } = extractHubs(data);
      validateShuttleRouteData(forwardHubs, returnHubs);
      const shuttleRouteRequest = transformToShuttleRouteRequest(
        data,
        forwardHubs,
        returnHubs,
      );
      await postRoute({
        eventId,
        dailyEventId,
        body: shuttleRouteRequest,
      });
      alert('노선이 추가되었습니다.');
      router.push(`/events/${eventId}/dates/${dailyEventId}`);
    } catch (error) {
      setIsSubmitting(false);
      alert(
        '노선 추가 과정에서 오류가 발생했습니다.\n' +
          (error instanceof Error && error.message),
      );
    }
  };

  const handleMirrorHub = () => {
    const isConfirmed = confirm(
      '목적지행의 경유지들을 귀가행에 미러링하시겠습니까?\n\n주의: 기존에 귀가행에 있던 경유지들은 모두 삭제됩니다.\n미러링을 진행한 이후 시간 순서를 확인해주세요.',
    );
    if (!isConfirmed) {
      return;
    }
    const reversedToDestinationHubs = getValues(
      'shuttleRouteHubsToDestination',
    ).toReversed();
    setValue('shuttleRouteHubsFromDestination', reversedToDestinationHubs);
  };

  const handleCalculateRoute = useCallback(
    async (hubsArray: RouteHubData[]) => {
      const userConfirmed = confirm(
        '경로 소요 시간을 계산하시겠습니까?\n경로 소요 시간은 `출발시간`을 기준으로 카카오 지도 길찾기 결과를 통해 계산됩니다.\n기존에 설정해두었던 나머지 경유지의 시간은 변경됩니다.',
      );
      if (!userConfirmed) return;
      try {
        const result = await calculateRouteTimes('fromDestination', hubsArray);
        if (result) {
          updateRouteFormValues('fromDestination', result, setValue);
          alert('경로 소요 시간 계산이 완료되었습니다.');
        }
      } catch (error) {
        alert(
          '경로 소요 시간 계산 중 오류가 발생했습니다.\n' +
            (error instanceof Error ? error.message : '알 수 없는 오류'),
        );
      }
    },
    [],
  );

  const handleCalculateUnion = useCallback(
    async (hubsArray: RouteHubData[]) => {
      const userConfirmed = confirm(
        '경로 소요 시간을 계산하시겠습니까?\n경로 소요 시간은 `도착시간`을 기준으로 카카오 지도 길찾기 결과를 통해 계산됩니다.\n기존에 설정해두었던 나머지 경유지의 시간은 변경됩니다.',
      );
      if (!userConfirmed) return;
      try {
        const result = await calculateUnionTimes(hubsArray);
        if (result) {
          updateRouteFormValues('toDestination', result, setValue);
          alert('경로 소요 시간 계산이 완료되었습니다.');
        }
      } catch (error) {
        alert(
          '경로 소요 시간 계산 중 오류가 발생했습니다.\n' +
            (error instanceof Error ? error.message : '알 수 없는 오류'),
        );
      }
    },
    [],
  );

  return (
    <main>
      <Heading>노선 추가하기</Heading>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormContainer.section>
          <FormContainer.label htmlFor="name" required>
            노선 이름
          </FormContainer.label>
          <Input {...register('name')} placeholder="노선 이름을 입력해주세요" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </FormContainer.section>
        <FormContainer.section>
          <FormContainer.label htmlFor="maxPassengerCount" required>
            최대 승객 수
          </FormContainer.label>
          <Input
            type="number"
            {...register('maxPassengerCount', { valueAsNumber: true })}
          />
          {errors.maxPassengerCount && (
            <p className="text-red-500">{errors.maxPassengerCount.message}</p>
          )}
        </FormContainer.section>
        <FormContainer.section>
          <div className="flex items-baseline gap-20">
            <FormContainer.label required>가격</FormContainer.label>
            <div className="flex gap-8">
              <span className="text-14 text-blue-600">얼리버드 적용</span>
              <Input
                id="hasEarlybird"
                type="checkbox"
                className="w-fit"
                {...register('hasEarlybird')}
              />
            </div>
          </div>
          <Callout className="text-14">
            <b>주의: </b>얼리버드 적용 여부 및 얼리버드 마감일은 노선 추가 후{' '}
            <b className="text-red-500">변경이 불가</b>합니다.
          </Callout>
          <Callout className="text-14">
            <span className="text-red-500">
              가격을 0으로 설정할 경우 해당 방향은 개설되지 않습니다.
            </span>
            <br />
            ex) 왕복과 가는편 가격을 0으로 설정 -{'>'} 오는편 편도 노선으로
            개설됨
            <br />
            이때 왕복&가는편 또는 왕복&오는편 조합의 노선 개설은 불가합니다.
          </Callout>
          <article className="grid w-full grid-cols-2 gap-12">
            <div className="flex flex-col gap-8 rounded-[4px] p-8">
              <Heading.h5 backgroundColor="yellow">일반 가격</Heading.h5>
              <Controller
                control={control}
                name="reservationDeadline"
                render={({ field: { onChange, value } }) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="reservationDeadline"
                      className="block text-16 font-500"
                    >
                      예약 마감일
                    </label>
                    <DateInput value={value} setValue={onChange} />
                    {errors.reservationDeadline && (
                      <p className="text-red-500">
                        {errors.reservationDeadline.message}
                      </p>
                    )}
                  </div>
                )}
              />
              {/* Price inputs would need to be implemented as arrays */}
              <div className="flex flex-col gap-12">
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    왕복
                  </label>
                  <Controller
                    control={control}
                    name="regularPrice.roundTrip"
                    render={({ field: { onChange, value } }) => (
                      <NumberInput value={value ?? 0} setValue={onChange} />
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    가는편
                  </label>
                  <Controller
                    control={control}
                    name="regularPrice.toDestination"
                    render={({ field: { onChange, value } }) => (
                      <NumberInput value={value ?? 0} setValue={onChange} />
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    오는편
                  </label>
                  <Controller
                    control={control}
                    name="regularPrice.fromDestination"
                    render={({ field: { onChange, value } }) => (
                      <NumberInput value={value ?? 0} setValue={onChange} />
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className={`flex flex-col gap-8 rounded-[4px] p-8 ${watchHasEarlybird ? '' : 'bg-notion-grey'}`}
            >
              <Heading.h5 backgroundColor="blue">얼리버드 가격</Heading.h5>
              <label className="block text-16 font-500">예약 마감일</label>
              <Controller
                control={control}
                name="earlybirdDeadline"
                render={({ field: { onChange, value } }) => (
                  <>
                    <DateInput
                      disabled={!watchHasEarlybird}
                      value={value}
                      setValue={onChange}
                    />
                    {errors.reservationDeadline && (
                      <p className="text-red-500">
                        {errors.reservationDeadline.message}
                      </p>
                    )}
                  </>
                )}
              />
              <div className="flex flex-col gap-12">
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    왕복
                    <span className="ml-4 text-14 text-blue-500">
                      {discountPercent(
                        watchRegularPrice.roundTrip,
                        watchEarlybirdPrice.roundTrip,
                      )}
                    </span>
                  </label>
                  <Controller
                    control={control}
                    name="earlybirdPrice.roundTrip"
                    render={({ field: { onChange, value } }) => (
                      <NumberInput value={value ?? 0} setValue={onChange} />
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    가는편
                    <span className="ml-4 text-14 text-blue-500">
                      {discountPercent(
                        watchRegularPrice.toDestination,
                        watchEarlybirdPrice.toDestination,
                      )}
                    </span>
                  </label>
                  <Controller
                    control={control}
                    name="earlybirdPrice.toDestination"
                    render={({ field: { onChange, value } }) => (
                      <NumberInput value={value ?? 0} setValue={onChange} />
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    오는편
                    <span className="ml-4 text-14 text-blue-500">
                      {discountPercent(
                        watchRegularPrice.fromDestination,
                        watchEarlybirdPrice.fromDestination,
                      )}
                    </span>
                  </label>
                  <Controller
                    control={control}
                    name="earlybirdPrice.fromDestination"
                    render={({ field: { onChange, value } }) => (
                      <NumberInput value={value ?? 0} setValue={onChange} />
                    )}
                  />
                </div>
              </div>
            </div>
          </article>
        </FormContainer.section>
        <FormContainer.section>
          <FormContainer.label required>경유지</FormContainer.label>
          <Callout className="text-14">
            파란색으로 표시된 경유지는 행사 장소 근처 경유지에 해당합니다. (ex.
            인스파이어 아레나)
            <br />
            반드시 목적지행과 오는편 마다 두개 이상의 경유지를 입력해주세요.
            <br />
            경유지는 시간순서대로 입력해주세요.
            <br />
            경유지는 장소들 중 선택 가능합니다.
            <br />
            <br />
            <b>경로소요시간 계산하기</b>
            <br />
            정류장들을 모두 기입하고, <b>가는 편</b>의 경우 원하는{' '}
            <b>도착시간</b>을 입력하세요.
            <b> 오는 편</b>의 경우 원하는 <b>출발시간</b>을 입력해주세요.
            <br />
            카카오 지도 길찾기 결과를 통해 경로소요시간을 <b>자동 계산</b> 및
            반영합니다.
          </Callout>
          <section className="pb-12">
            <Heading.h5 backgroundColor="yellow" className="flex">
              가는편
              <button
                type="button"
                onClick={() =>
                  prependToDestHub({
                    regionId: null,
                    regionHubId: null,
                    arrivalTime: defaultDate,
                    latitude: null,
                    longitude: null,
                  })
                }
                className="ml-8 text-14 text-blue-500"
              >
                추가
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCalculateUnion(
                    getValues('shuttleRouteHubsToDestination'),
                  )
                }
                className="ml-auto block text-14 text-green-500 underline underline-offset-2"
              >
                경로 소요 시간 계산하기
              </button>
            </Heading.h5>
            <ul className="flex flex-col gap-8">
              {toDestHubFields.map((field, index) => {
                return (
                  <li
                    key={field.id}
                    className={`flex justify-between rounded-[6px] p-12 ${index === toDestHubFields.length - 1 ? 'bg-notion-blue' : 'bg-notion-grey/50'}`}
                  >
                    <h5 className="my-auto text-16 font-500">{index + 1}</h5>
                    <div className="w-[1px] rounded-full bg-grey-100" />
                    <div className="flex flex-col">
                      <label className="text-16 font-500">정류장</label>
                      <Controller
                        control={control}
                        name={`shuttleRouteHubsToDestination.${index}` as const}
                        render={({ field: { onChange, value } }) => (
                          <RegionHubInputSelfContained
                            hubType={
                              index === toDestHubFields.length - 1
                                ? 'DESTINATION'
                                : 'SHUTTLE_HUB'
                            }
                            regionId={value.regionId}
                            setRegionId={(regionId) =>
                              onChange({ ...value, regionId })
                            }
                            regionHubId={value.regionHubId}
                            setRegionHubId={(
                              regionHubId,
                              latitude,
                              longitude,
                            ) =>
                              onChange({
                                ...value,
                                regionHubId,
                                latitude,
                                longitude,
                              })
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="w-[1px] rounded-full bg-grey-100" />
                    <div className="flex flex-col gap-12">
                      <label className="text-16 font-500">시간</label>
                      <Controller
                        control={control}
                        name={
                          `shuttleRouteHubsToDestination.${index}.arrivalTime` as const
                        }
                        render={({ field: { onChange, value } }) => (
                          <DateTimeInput value={value} setValue={onChange} />
                        )}
                      />
                    </div>
                    <div className="w-[1px] rounded-full bg-grey-100" />
                    <div className="flex items-center gap-8">
                      <button
                        type="button"
                        onClick={() =>
                          index > 0 && swapToDestHub(index, index - 1)
                        }
                        disabled={
                          index === 0 || index === toDestHubFields.length - 1
                        }
                        className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
                      >
                        위로
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          index < toDestHubFields.length - 1 &&
                          swapToDestHub(index, index + 1)
                        }
                        disabled={
                          index === toDestHubFields.length - 1 ||
                          index === toDestHubFields.length - 2
                        }
                        className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
                      >
                        아래로
                      </button>
                      <button
                        type="button"
                        onClick={() => removeToDestHub(index)}
                        className="text-red-500 disabled:opacity-30"
                        disabled={index === toDestHubFields.length - 1}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          <section>
            <Heading.h5 backgroundColor="yellow" className="flex">
              오는편
              <button
                type="button"
                onClick={() =>
                  appendFromDestHub({
                    regionId: null,
                    regionHubId: null,
                    arrivalTime: defaultDate,
                    latitude: null,
                    longitude: null,
                  })
                }
                className="ml-8 text-14 text-blue-500"
              >
                추가
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCalculateRoute(
                    getValues('shuttleRouteHubsFromDestination'),
                  )
                }
                className="ml-auto block text-14 text-green-500 underline underline-offset-2"
              >
                경로 소요 시간 계산하기
              </button>
              <button
                type="button"
                onClick={handleMirrorHub}
                className="ml-4 block text-14 text-blue-500 underline underline-offset-2"
              >
                목적지행을 미러링하기
              </button>
            </Heading.h5>
            <ul className="flex flex-col gap-8">
              {fromDestHubFields.map((field, index) => {
                return (
                  <li
                    key={field.id}
                    className={`flex justify-between rounded-[6px] p-12 ${index === 0 ? 'bg-notion-blue' : 'bg-notion-grey/50'}`}
                  >
                    <h5 className="my-auto text-16 font-500">{index + 1}</h5>
                    <div className="w-[1px] rounded-full bg-grey-100" />
                    <div className="flex flex-col">
                      <label className="text-16 font-500">정류장</label>
                      <Controller
                        control={control}
                        name={
                          `shuttleRouteHubsFromDestination.${index}` as const
                        }
                        render={({ field: { onChange, value } }) => (
                          <RegionHubInputSelfContained
                            hubType={
                              index === 0 ? 'DESTINATION' : 'SHUTTLE_HUB'
                            }
                            regionId={value.regionId}
                            setRegionId={(regionId) =>
                              onChange({ ...value, regionId })
                            }
                            regionHubId={value.regionHubId}
                            setRegionHubId={(
                              regionHubId,
                              latitude,
                              longitude,
                            ) =>
                              onChange({
                                ...value,
                                regionHubId,
                                latitude,
                                longitude,
                              })
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="w-[1px] rounded-full bg-grey-100" />
                    <div className="flex flex-col gap-12">
                      <label className="text-16 font-500">시간</label>
                      <Controller
                        control={control}
                        name={
                          `shuttleRouteHubsFromDestination.${index}.arrivalTime` as const
                        }
                        render={({ field: { onChange, value } }) => (
                          <DateTimeInput value={value} setValue={onChange} />
                        )}
                      />
                    </div>
                    <div className="w-[1px] rounded-full bg-grey-100" />
                    <div className="flex items-center gap-8">
                      <button
                        type="button"
                        onClick={() =>
                          index > 0 && swapFromDestHub(index, index - 1)
                        }
                        disabled={index === 0 || index === 1}
                        className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
                      >
                        위로
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          index < fromDestHubFields.length - 1 &&
                          swapFromDestHub(index, index + 1)
                        }
                        disabled={
                          index === fromDestHubFields.length - 1 || index === 0
                        }
                        className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
                      >
                        아래로
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromDestHub(index)}
                        className="text-red-500 disabled:opacity-30"
                        disabled={index === 0}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </FormContainer.section>
        <FormContainer.submitButton disabled={isSubmitting}>
          {isSubmitting ? '처리 중...' : '추가하기'}
        </FormContainer.submitButton>
      </FormContainer>
    </main>
  );
};
