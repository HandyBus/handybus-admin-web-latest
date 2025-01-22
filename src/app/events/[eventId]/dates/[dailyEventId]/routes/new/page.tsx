'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { type CreateShuttleRouteForm } from './form.type';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import { parseDateString } from '@/utils/date.util';
import { useMemo } from 'react';
import DateInput from '@/components/input/DateInput';
import DateTimeInput from '@/components/input/DateTimeInput';
import { twMerge } from 'tailwind-merge';
import {
  useGetEvent,
  usePostShuttleRoute,
} from '@/services/shuttleOperation.service';
import { EventsViewEntity } from '@/types/event.type';
import { conform } from './conform.util';
import Guide from '@/components/guide/Guide';

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
    return parseDateString(
      event?.dailyEvents.find((de) => de.dailyEventId === Number(dailyEventId))
        ?.date,
    );
  }, [event, dailyEventId]);

  const defaultValues: CreateShuttleRouteForm = useMemo(
    () => ({
      name: '',
      maxPassengerCount: 0,
      earlybirdDeadline: defaultDate,
      reservationDeadline: defaultDate,
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
          arrivalTime: defaultDate,
        },
        {
          regionHubId: null,
          arrivalTime: defaultDate,
        },
      ],
      shuttleRouteHubsToDestination: [
        {
          regionHubId: null,
          arrivalTime: defaultDate,
        },
        {
          regionHubId: null,
          arrivalTime: defaultDate,
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
      defaultDate={defaultDate}
    />
  );
};

export default Page;

interface FormProps extends Props {
  event: EventsViewEntity;
  defaultValues: CreateShuttleRouteForm;
  defaultDate: Date;
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
      console.error(error);
      if (
        error instanceof Error &&
        error.message === 'arrivalTime is not validated'
      )
        alert('거점지들의 시간순서가 올바르지 않습니다. 확인해주세요.');
      else alert('오류가 발생했습니다.');
    },
  });

  const onSubmit = async (data: CreateShuttleRouteForm) => {
    if (confirm('등록하시겠습니까?')) {
      postRoute({
        eventId: Number(eventId),
        dailyEventId: Number(dailyEventId),
        body: conform(data),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-16 space-y-4 rounded-lg bg-grey-50 p-16  "
    >
      <div className="space-y-2">
        <label htmlFor="name" className="block">
          경로 이름
        </label>
        <Input {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <label htmlFor="maxPassengerCount" className="block">
        최대 승객 수
        <Input
          type="number"
          {...register('maxPassengerCount', { valueAsNumber: true })}
        />
        {errors.maxPassengerCount && (
          <p className="text-red-500">{errors.maxPassengerCount.message}</p>
        )}
      </label>

      <div className="flex flex-row items-center gap-8">
        <Controller
          control={control}
          name="reservationDeadline"
          render={({ field: { onChange, value } }) => (
            <div className="space-y-2">
              <label htmlFor="reservationDeadline" className="block">
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

        <div className="space-y-2">
          <label
            htmlFor="hasEarlybird"
            className="flex flex-row items-center justify-start"
          >
            <Input
              id="hasEarlybird"
              type="checkbox"
              className="w-fit"
              {...register('hasEarlybird')}
            />
            얼리버드 예약 마감일
          </label>

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
        </div>
      </div>

      <div className="flex flex-row items-center gap-8">
        {/* Price inputs would need to be implemented as arrays */}
        <div className="space-y-2">
          <h3>정상가격</h3>

          <div className="flex flex-col items-start gap-8">
            <label className="break-keep">
              목적지행 {formatted(watchRegularPrice.toDestination)}원
            </label>
            <Input
              type="number"
              {...register('regularPrice.toDestination', {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex flex-col items-start gap-8">
            <label className="break-keep">
              귀가행 {formatted(watchRegularPrice.fromDestination)}원
            </label>
            <Input
              type="number"
              {...register('regularPrice.fromDestination', {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex flex-col items-start gap-8">
            <label className="break-keep">
              왕복 {formatted(watchRegularPrice.roundTrip)}원
            </label>
            <Input
              type="number"
              {...register('regularPrice.roundTrip', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3>얼리버드 가격</h3>

          <div className="flex flex-col items-start gap-8">
            <label className="break-keep">
              목적지행 {formatted(watchEarlybirdPrice.toDestination)}원
              {discountPercent(
                watchRegularPrice.toDestination,
                watchEarlybirdPrice.toDestination,
              )}
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
            <label className="break-keep">
              귀가행 {formatted(watchEarlybirdPrice.fromDestination)}원
              {discountPercent(
                watchRegularPrice.fromDestination,
                watchEarlybirdPrice.fromDestination,
              )}
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
            <label className="break-keep">
              왕복 {formatted(watchEarlybirdPrice.roundTrip)}원
              {discountPercent(
                watchRegularPrice.roundTrip,
                watchEarlybirdPrice.roundTrip,
              )}
            </label>
            <Input
              type="number"
              {...register('earlybirdPrice.roundTrip', { valueAsNumber: true })}
              disabled={!watchHasEarlybird}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3>경유지 목적지행</h3>
        <button
          type="button"
          onClick={() =>
            prependToDestHub({
              regionHubId: 0,
              arrivalTime: defaultDate,
            })
          }
          className="px-2 py-1 text-sm rounded text-blue-500"
        >
          추가
        </button>
        <Guide>
          주의! 목적지행 경유지 목록의 마지막 경유지는 노선이 행사 장소에 도착할
          때 운행을 종료하는 최종 거점지가 되어야 합니다. 꼭 설정해주세요.
        </Guide>
        <div className="flex flex-col gap-20">
          {toDestHubFields.map((field, index) => {
            return (
              <div key={field.id}>
                <div
                  className={twMerge(
                    'flex items-center gap-20',
                    index === toDestHubFields.length - 1
                      ? 'rounded-lg bg-primary-200'
                      : '',
                  )}
                >
                  <label className="flex flex-row ">
                    {index === toDestHubFields.length - 1 ? (
                      <>
                        목적지 근처
                        <br />
                        도착 거점지
                      </>
                    ) : (
                      <>경유 거점지</>
                    )}
                  </label>
                  <div className="flex flex-row">
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

                  <label>
                    시간
                    <Controller
                      control={control}
                      name={
                        `shuttleRouteHubsToDestination.${index}.arrivalTime` as const
                      }
                      render={({ field: { onChange, value } }) => (
                        <DateTimeInput value={value} setValue={onChange} />
                      )}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => index > 0 && swapToDestHub(index, index - 1)}
                    disabled={
                      index === 0 || index === toDestHubFields.length - 1
                    }
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
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
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h3>경유지 귀가행</h3>
        <button
          type="button"
          onClick={() =>
            appendFromDestHub({
              regionHubId: 0,
              arrivalTime: defaultDate,
            })
          }
          className="px-2 py-1 text-sm rounded text-blue-500"
        >
          추가
        </button>
        <Guide>
          주의! 귀가행 경유지 목록의 첫번째 경유지는 노선이 행사 장소에서 출발할
          때 운행을 시작하는 최초 거점지가 되어야 합니다. 꼭 설정해주세요.
        </Guide>
        <div className="flex flex-col gap-20">
          {fromDestHubFields.map((field, index) => {
            return (
              <div key={field.id}>
                <div
                  className={twMerge(
                    'flex items-center gap-20',
                    index === 0 ? 'rounded-lg bg-primary-200' : '',
                  )}
                >
                  <label className="flex flex-row ">
                    {index === 0 ? (
                      <>
                        목적지 근처
                        <br />
                        귀가 출발지
                      </>
                    ) : (
                      <>경유 거점지</>
                    )}
                  </label>
                  <div className="flex flex-row">
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

                  <label>
                    시간
                    <Controller
                      control={control}
                      name={
                        `shuttleRouteHubsFromDestination.${index}.arrivalTime` as const
                      }
                      render={({ field: { onChange, value } }) => (
                        <DateTimeInput value={value} setValue={onChange} />
                      )}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      index > 0 && swapFromDestHub(index, index - 1)
                    }
                    disabled={index === 0 || index === 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
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
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
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
              </div>
            );
          })}
        </div>
      </div>

      <button type="submit" className="rounded bg-blue-500 p-8 text-white">
        추가
      </button>
    </form>
  );
};

const formatted = (n: number) => {
  return n.toLocaleString('ko-KR');
};

const discountPercent = (price: number, priceAfterDiscount: number) => {
  const amount = ((price - priceAfterDiscount) / price) * 100;
  if (amount < 0) return '(오류: 더 비싼 가격)';
  return '(-' + amount.toFixed(2) + '%)';
};
