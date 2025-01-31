'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { type CreateShuttleRouteForm } from './form.type';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import { useMemo } from 'react';
import DateInput from '@/components/input/DateInput';
import DateTimeInput from '@/components/input/DateTimeInput';
import {
  useGetEvent,
  usePostShuttleRoute,
} from '@/services/shuttleOperation.service';
import { EventsViewEntity } from '@/types/event.type';
import { conform } from './conform.util';
import Heading from '@/components/text/Heading';
import FormContainer from '@/components/form/Form';
import Callout from '@/components/text/Callout';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId } = params;

  const {
    data: event,
    isPending,
    isError,
    error,
  } = useGetEvent(Number(eventId));

  const defaultDate = useMemo(() => {
    return event?.dailyEvents.find(
      (de) => de.dailyEventId === Number(dailyEventId),
    )?.date;
  }, [event, dailyEventId]);

  const defaultValues: CreateShuttleRouteForm = useMemo(
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
          regionHubId: null,
          arrivalTime: defaultDate ?? '',
        },
        {
          regionHubId: null,
          arrivalTime: defaultDate ?? '',
        },
      ],
      shuttleRouteHubsToDestination: [
        {
          regionHubId: null,
          arrivalTime: defaultDate ?? '',
        },
        {
          regionHubId: null,
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
  defaultValues: CreateShuttleRouteForm;
  defaultDate: string;
}

const Form = ({ params, defaultValues, defaultDate }: FormProps) => {
  const { eventId, dailyEventId } = params;
  const router = useRouter();
  console.log('defaultValues', defaultValues);
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateShuttleRouteForm>({
    // resolver: zodResolver(CreateShuttleRouteRequestSchema),
    defaultValues,
  });

  const watchHasEarlybird = watch('hasEarlybird');

  const watchRegularPrice = watch('regularPrice');

  const watchEarlybirdPrice = watch('earlybirdPrice');

  const {
    fields: fromDestHubFields,
    append: appendFromDestHub,
    remove: removeFromDestHub,
    // update: updateHub,
    swap: swapFromDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsFromDestination',
  });

  const {
    fields: toDestHubFields,
    prepend: prependToDestHub,
    remove: removeToDestHub,
    // update: updateHub,
    swap: swapToDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsToDestination',
  });

  const { mutate: postRoute } = usePostShuttleRoute({
    onSuccess: () => {
      alert('등록에 성공했습니다.');
      router.push(`/events/${eventId}/dates/${dailyEventId}`);
    },
    onError: (error) => {
      alert(
        '오류가 발생했습니다.\n' + (error instanceof Error && error.message),
      );
    },
  });

  const onSubmit = async (data: CreateShuttleRouteForm) => {
    if (!confirm('수정하시겠습니까?')) return;
    try {
      const shuttleRouteHubs = conform(data);
      postRoute({
        eventId: Number(eventId),
        dailyEventId: Number(dailyEventId),
        body: shuttleRouteHubs,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'arrivalTime is not validated'
      )
        alert('거점지들의 시간순서가 올바르지 않습니다. 확인해주세요.');
    }
  };

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
            <b>주의: </b>가격은 노선 추가 후{' '}
            <b className="text-red-500">변경이 불가</b>합니다.
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
                    목적지행
                  </label>
                  <Input
                    {...register('regularPrice.toDestination', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    귀가행
                  </label>
                  <Input
                    type="number"
                    {...register('regularPrice.fromDestination', {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    왕복
                  </label>
                  <Input
                    type="number"
                    {...register('regularPrice.roundTrip', {
                      valueAsNumber: true,
                    })}
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
                    목적지행
                    <span className="ml-4 text-14 text-blue-500">
                      {discountPercent(
                        watchRegularPrice.toDestination,
                        watchEarlybirdPrice.toDestination,
                      )}
                    </span>
                  </label>
                  <Input
                    type="number"
                    {...register('earlybirdPrice.toDestination', {
                      valueAsNumber: true,
                    })}
                    disabled={!watchHasEarlybird}
                  />
                </div>

                <div className="flex flex-col items-start gap-8">
                  <label className="block break-keep text-16 font-500">
                    귀가행
                    <span className="ml-4 text-14 text-blue-500">
                      {discountPercent(
                        watchRegularPrice.fromDestination,
                        watchEarlybirdPrice.fromDestination,
                      )}
                    </span>
                  </label>
                  <Input
                    type="number"
                    {...register('earlybirdPrice.fromDestination', {
                      valueAsNumber: true,
                    })}
                    disabled={!watchHasEarlybird}
                  />
                </div>

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
                  <Input
                    type="number"
                    {...register('earlybirdPrice.roundTrip', {
                      valueAsNumber: true,
                    })}
                    disabled={!watchHasEarlybird}
                  />
                </div>
              </div>
            </div>
          </article>
        </FormContainer.section>

        <FormContainer.section>
          <FormContainer.label>경유지</FormContainer.label>
          <Callout className="text-14">
            파란색으로 표시된 경유지는 행사 장소 근처 경유지에 해당합니다. (ex.
            인스파이어 아레나)
            <br />
            반드시 목적지행과 귀가행 마다 두개 이상의 경유지를 입력해주세요.
            <br />
            경유지는 시간순서대로 입력해주세요.
            <br />
            경유지는 거점지들 중 선택 가능합니다.
          </Callout>
          <section className="pb-12">
            <Heading.h5 backgroundColor="yellow">
              목적지행
              <button
                type="button"
                onClick={() =>
                  prependToDestHub({
                    regionHubId: 0,
                    arrivalTime: defaultDate,
                  })
                }
                className="ml-8 text-14 text-blue-500"
              >
                추가
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
                      <label className="text-16 font-500">거점지</label>
                      <Controller
                        control={control}
                        name={
                          `shuttleRouteHubsToDestination.${index}.regionHubId` as const
                        }
                        render={({ field: { onChange, value } }) => (
                          <RegionHubInputSelfContained
                            value={value}
                            setValue={onChange}
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
                          <DateTimeInput
                            value={new Date(value)}
                            setValue={onChange}
                          />
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
            <Heading.h5 backgroundColor="yellow">
              귀가행
              <button
                type="button"
                onClick={() =>
                  appendFromDestHub({
                    regionHubId: 0,
                    arrivalTime: defaultDate,
                  })
                }
                className="ml-8 text-14 text-blue-500"
              >
                추가
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
                      <label className="text-16 font-500">거점지</label>
                      <Controller
                        control={control}
                        name={
                          `shuttleRouteHubsFromDestination.${index}.regionHubId` as const
                        }
                        render={({ field: { onChange, value } }) => (
                          <RegionHubInputSelfContained
                            value={value}
                            setValue={onChange}
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
                          <DateTimeInput
                            value={new Date(value)}
                            setValue={onChange}
                          />
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
        <FormContainer.submitButton>추가하기</FormContainer.submitButton>
      </FormContainer>
    </main>
  );
};

const discountPercent = (price: number, priceAfterDiscount: number) => {
  const amount = ((price - priceAfterDiscount) / price) * 100;
  if (amount < 0) return '(오류: 얼리버드가 더 비쌉니다.)';
  return '(' + amount.toFixed(2) + '% 할인)';
};
