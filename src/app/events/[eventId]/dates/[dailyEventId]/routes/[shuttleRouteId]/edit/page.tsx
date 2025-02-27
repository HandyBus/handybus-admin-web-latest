'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import { useMemo } from 'react';
import DateInput from '@/components/input/DateInput';
import DateTimeInput from '@/components/input/DateTimeInput';
import {
  useGetShuttleRoute,
  usePutShuttleRoute,
} from '@/services/shuttleOperation.service';
import { UpdateShuttleRouteRequestFormData } from './form.type';
import { conform } from './conform.util';
import Heading from '@/components/text/Heading';
import Callout from '@/components/text/Callout';
import FormContainer from '@/components/form/Form';

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
  } = useGetShuttleRoute(eventId, dailyEventId, shuttleRouteId);

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
    <main>
      <Heading>노선 수정하기</Heading>
      <Form
        params={params}
        defaultValues={defaultValues}
        defaultDate={defaultDate}
      />
    </main>
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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateShuttleRouteRequestFormData>({
    defaultValues,
  });

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

  const { mutate: putRoute } = usePutShuttleRoute({
    onSuccess: () => {
      alert('노선이 수정되었습니다.');
      router.push(
        `/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`,
      );
    },
    onError: (error) => {
      alert(
        '오류가 발생했습니다.\n' + (error instanceof Error && error.message),
      );
    },
  });

  const onSubmit = async (data: UpdateShuttleRouteRequestFormData) => {
    if (!confirm('수정하시겠습니까?')) return;
    try {
      const shuttleRouteHubs = conform(data);
      putRoute({
        eventId,
        dailyEventId,
        shuttleRouteId,
        body: shuttleRouteHubs,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'arrivalTime is not validated'
      )
        alert('정류장들의 시간순서가 올바르지 않습니다. 확인해주세요.');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormContainer.section>
        <FormContainer.label htmlFor="name" required>
          노선 이름
        </FormContainer.label>
        <Input {...register('name')} />
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
        <FormContainer.label htmlFor="reservationDeadline" required>
          예약 마감일
        </FormContainer.label>
        <Controller
          control={control}
          name="reservationDeadline"
          render={({ field: { onChange, value } }) => (
            <>
              <DateInput value={value} setValue={onChange} />
              {errors.reservationDeadline && (
                <p className="text-red-500">
                  {errors.reservationDeadline.message}
                </p>
              )}
            </>
          )}
        />
      </FormContainer.section>

      <FormContainer.section>
        <FormContainer.label>경유지</FormContainer.label>
        <Callout className="text-14">
          파란색으로 표시된 경유지는 행사 장소 근처 경유지에 해당합니다. (ex.
          인스파이어 아레나)
          <br />
          반드시 목적지행과 오는편 마다 두개 이상의 경유지를 입력해주세요.
          <br />
          경유지는 시간순서대로 입력해주세요.
          <br />
          경유지는 장소들 중 선택 가능합니다.
        </Callout>
        <section className="pb-12">
          <Heading.h5 backgroundColor="yellow">
            가는편
            <button
              type="button"
              onClick={() =>
                prependToDestHub({
                  regionHubId: '',
                  arrivalTime: defaultDate ?? '',
                })
              }
              className="ml-8 text-14 text-blue-500"
            >
              추가
            </button>
          </Heading.h5>
          <ul className="flex flex-col gap-20">
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
                          regionId={value.regionId ?? null}
                          setRegionId={(regionId) =>
                            onChange({ ...value, regionId })
                          }
                          regionHubId={value.regionHubId ?? null}
                          setRegionHubId={(regionHubId) =>
                            onChange({ ...value, regionHubId })
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="w-[1px] rounded-full bg-grey-100" />
                  <div className="flex flex-col gap-12">
                    <label className="text-16 font-500">시간</label>
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
            오는편
            <button
              type="button"
              onClick={() =>
                appendFromDestHub({
                  regionHubId: '',
                  arrivalTime: defaultDate ?? '',
                })
              }
              className="ml-8 text-14 text-blue-500"
            >
              추가
            </button>
          </Heading.h5>
          <ul className="flex flex-col gap-20">
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
                      name={`shuttleRouteHubsFromDestination.${index}` as const}
                      render={({ field: { onChange, value } }) => (
                        <RegionHubInputSelfContained
                          regionId={value.regionId ?? null}
                          setRegionId={(regionId) =>
                            onChange({ ...value, regionId })
                          }
                          regionHubId={value.regionHubId ?? null}
                          setRegionHubId={(regionHubId) =>
                            onChange({ ...value, regionHubId })
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

      <button type="submit" className="rounded bg-blue-500 p-8 text-white">
        수정하기
      </button>
    </FormContainer>
  );
};
