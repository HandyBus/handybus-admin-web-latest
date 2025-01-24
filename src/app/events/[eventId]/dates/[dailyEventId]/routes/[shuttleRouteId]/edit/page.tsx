'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import { useMemo } from 'react';
import DateInput from '@/components/input/DateInput';
import DateTimeInput from '@/components/input/DateTimeInput';
import { twMerge } from 'tailwind-merge';
import {
  useGetShuttleRoute,
  usePutShuttleRoute,
} from '@/services/shuttleOperation.service';
import { UpdateShuttleRouteRequestFormData } from './form.type';
import { conform } from './conform.util';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;

  const {
    data: route,
    isPending: isRoutePending,
    isError: isRouteError,
    error: routeError,
  } = useGetShuttleRoute(
    Number(eventId),
    Number(dailyEventId),
    Number(shuttleRouteId),
  );

  const defaultDate = useMemo(() => {
    return route?.event.dailyEvents.find(
      (de) => de.dailyEventId === route.dailyEventId,
    )?.date;
  }, [route]);

  const defaultFromDestinationShuttleRouteHubs = useMemo(
    () =>
      route?.fromDestinationShuttleRouteHubs
        .filter((hub) => hub.type === 'FROM_DESTINATION')
        .sort((a, b) => a.sequence - b.sequence)
        .map((hub) => ({
          shuttleRouteHubId: hub.shuttleRouteHubId,
          regionHubId: hub.regionHubId,
          regionId: hub.regionId,
          arrivalTime: hub.arrivalTime,
        })),
    [route?.fromDestinationShuttleRouteHubs],
  );

  const defaultToDestinationShuttleRouteHubs = useMemo(
    () =>
      route?.toDestinationShuttleRouteHubs
        .filter((hub) => hub.type === 'TO_DESTINATION')
        .sort((a, b) => a.sequence - b.sequence)
        .map((hub) => ({
          shuttleRouteHubId: hub.shuttleRouteHubId,
          regionHubId: hub.regionHubId,
          regionId: hub.regionId,
          arrivalTime: hub.arrivalTime,
        })),
    [route?.toDestinationShuttleRouteHubs],
  );

  const defaultValues: UpdateShuttleRouteRequestFormData = useMemo(
    () => ({
      name: route?.name ?? '',
      maxPassengerCount: route?.maxPassengerCount ?? 0,
      reservationDeadline: route?.reservationDeadline ?? '',
      shuttleRouteHubsFromDestination:
        defaultFromDestinationShuttleRouteHubs ?? [],
      shuttleRouteHubsToDestination: defaultToDestinationShuttleRouteHubs ?? [],
    }),
    [
      route,
      defaultFromDestinationShuttleRouteHubs,
      defaultToDestinationShuttleRouteHubs,
    ],
  );

  if (isRoutePending) return <div>Loading...</div>;
  if (isRouteError) return <div>Error! {routeError?.message}</div>;

  return (
    <Form
      params={params}
      defaultValues={defaultValues}
      defaultDate={defaultDate}
    />
  );
};

export default Page;

interface FormProps extends Props {
  defaultValues: UpdateShuttleRouteRequestFormData;
  defaultDate: string | undefined;
}

const Form = ({ params, defaultValues, defaultDate }: FormProps) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;
  const router = useRouter();
  console.log('defaultValues', defaultValues);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateShuttleRouteRequestFormData>({
    // resolver: zodResolver(CreateShuttleRouteRequestSchema),
    defaultValues,
  });

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

  const { mutate: putRoute } = usePutShuttleRoute({
    onSuccess: () => {
      alert('수정에 성공했습니다.');
      router.push(
        `/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
      );
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

  const onSubmit = async (data: UpdateShuttleRouteRequestFormData) => {
    if (confirm('수정하시겠습니까?')) {
      putRoute({
        eventId: Number(eventId),
        dailyEventId: Number(dailyEventId),
        shuttleRouteId: Number(shuttleRouteId),
        body: conform(data),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-16 space-y-4 rounded-lg bg-grey-50 p-16  "
    >
      <Heading>노선 수정하기</Heading>
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

      <Callout>
        주의! <br />-{' '}
        <span className="text-red-700">거점지들의 시간순서에 유의</span>
        해주세요. 시간순서는 아래와 같습니다. <br />
        거점지 → 거점지 → ··· → 목적지 →→→ 출발지 → 거점지 → ··· → 거점지 <br />{' '}
        <br />- 목적지행의 거점지들은 귀가행의 거점지들보다 시각이
        이전이어야합니다. <br />- 시간순서가 맞지 않을경우 노선 수정이 완료되지
        않습니다.
      </Callout>

      <div className="space-y-2">
        <h3>경유지 목적지행</h3>
        <button
          type="button"
          onClick={() =>
            prependToDestHub({
              regionHubId: 0,
              arrivalTime: defaultDate ?? '',
            })
          }
          className="px-2 py-1 text-sm rounded text-blue-500"
        >
          추가
        </button>
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
                      name={`shuttleRouteHubsToDestination.${index}` as const}
                      render={({ field: { onChange, value } }) => (
                        <RegionHubInputSelfContained
                          value={value.regionHubId}
                          setValue={(newValue) =>
                            onChange({
                              ...value,
                              regionHubId: newValue,
                            })
                          }
                          initialRegionId={value.regionId}
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
                        <DateTimeInput
                          value={new Date(value)}
                          setValue={onChange}
                        />
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
              arrivalTime: defaultDate ?? '',
            })
          }
          className="px-2 py-1 text-sm rounded text-blue-500"
        >
          추가
        </button>
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
                      name={`shuttleRouteHubsFromDestination.${index}` as const}
                      render={({ field: { onChange, value } }) => (
                        <RegionHubInputSelfContained
                          value={value.regionHubId}
                          setValue={(newValue) =>
                            onChange({
                              ...value,
                              regionHubId: newValue,
                            })
                          }
                          initialRegionId={value.regionId}
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
                        <DateTimeInput
                          value={new Date(value)}
                          setValue={onChange}
                        />
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
        수정하기
      </button>
    </form>
  );
};
