'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { conform, type CreateShuttleRouteForm } from './form.type';
import { postRoute } from '@/services/v2/shuttleRoute.services';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import Guide from '@/components/guide/Guide';

interface Props {
  params: { eventId: string; dailyEventId: string };
}

const defaultValues: CreateShuttleRouteForm = {
  name: '',
  maxPassengerCount: 0,
  earlybirdDeadline: new Date(),
  reservationDeadline: new Date(),
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
      regionHubId: 0,
      arrivalTime: new Date(),
    },
  ],
  shuttleRouteHubsToDestination: [
    {
      regionHubId: 0,
      arrivalTime: new Date(),
    },
  ],
};

const Page = ({ params: { eventId, dailyEventId } }: Props) => {
  const router = useRouter();
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
    append: appendToDestHub,
    remove: removeToDestHub,
    // update: updateHub,
    swap: swapToDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsToDestination',
  });

  const onSubmit = async (data: CreateShuttleRouteForm) => {
    if (!confirm('등록하시겠습니까?')) return;
    try {
      await postRoute(Number(eventId), Number(dailyEventId), conform(data));
      alert('등록에 성공했습니다.');
      router.push(`/events/${eventId}/dates/${dailyEventId}`);
    } catch (error) {
      alert('오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col gap-16 bg-grey-50 rounded-lg p-16  "
    >
      <div className="space-y-2">
        <label htmlFor="name" className="block">
          경로 이름
        </label>
        <Input {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="reservationDeadline" className="block">
          예약 마감일
        </label>
        <Input type="datetime-local" {...register('reservationDeadline')} />
        {errors.reservationDeadline && (
          <p className="text-red-500">{errors.reservationDeadline.message}</p>
        )}
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

      <label className="block">
        <Input type="checkbox" {...register('hasEarlybird')} />
        얼리버드 여부
      </label>

      <label htmlFor="earlybirdDeadline" className="block">
        얼리버드 마감일
        <Input
          type="datetime-local"
          {...register('earlybirdDeadline')}
          disabled={!watchHasEarlybird}
        />
        {errors.earlybirdDeadline && (
          <p className="text-red-500">{errors.earlybirdDeadline.message}</p>
        )}
      </label>

      <div className="space-y-2">
        <h3>얼리버드 가격</h3>

        <label className="block">
          목적지행
          <Input
            type="number"
            {...register('earlybirdPrice.toDestination', {
              valueAsNumber: true,
            })}
            disabled={!watchHasEarlybird}
          />
        </label>

        <label className="block">
          출발지행
          <Input
            type="number"
            {...register('earlybirdPrice.fromDestination', {
              valueAsNumber: true,
            })}
            disabled={!watchHasEarlybird}
          />
        </label>

        <label className="block">
          왕복
          <Input
            type="number"
            {...register('earlybirdPrice.roundTrip', { valueAsNumber: true })}
            disabled={!watchHasEarlybird}
          />
        </label>
      </div>

      {/* Price inputs would need to be implemented as arrays */}
      <div className="space-y-2">
        <h3>정상가격</h3>

        <label className="block">
          목적지행
          <Input
            type="number"
            {...register('regularPrice.toDestination', {
              valueAsNumber: true,
            })}
          />
        </label>

        <label className="block">
          출발지행
          <Input
            type="number"
            {...register('regularPrice.fromDestination', {
              valueAsNumber: true,
            })}
          />
        </label>

        <label className="block">
          왕복
          <Input
            type="number"
            {...register('regularPrice.roundTrip', { valueAsNumber: true })}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h3>경유지 목적지행</h3>
        <button
          type="button"
          onClick={() =>
            appendToDestHub({
              regionHubId: 0,
              arrivalTime: new Date(),
            })
          }
          className="text-blue-500 px-2 py-1 rounded text-sm"
        >
          추가
        </button>
        <Guide>
          주의! 목적지행 경유지 목록의 마지막 경유지는 노선이 행사 장소에 도착할
          때 운행을 종료하는 최종 거점지가 되어야 합니다. 꼭 설정해주세요.
        </Guide>
        <div className="space-y-2">
          {toDestHubFields.map((field, index) => {
            return (
              <div key={field.id}>
                <div className="flex items-center gap-2">
                  <label className="flex flex-row ">경유지 ID</label>
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

                  <label>타입 : 목적지행</label>

                  <label>
                    시간
                    <Input
                      type="datetime-local"
                      {...register(
                        `shuttleRouteHubsToDestination.${index}.arrivalTime` as const,
                      )}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => index > 0 && swapToDestHub(index, index - 1)}
                    disabled={index === 0}
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
                    disabled={index === toDestHubFields.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    아래로
                  </button>
                  <button
                    type="button"
                    onClick={() => removeToDestHub(index)}
                    className="text-red-500"
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
              arrivalTime: new Date(),
            })
          }
          className="text-blue-500 px-2 py-1 rounded text-sm"
        >
          추가
        </button>
        <Guide>
          주의! 귀가행 경유지 목록의 첫번째 경유지는 노선이 행사 장소에서 출발할
          때 운행을 시작하는 최초 거점지가 되어야 합니다. 꼭 설정해주세요.
        </Guide>
        <div className="space-y-2">
          {fromDestHubFields.map((field, index) => {
            return (
              <div key={field.id}>
                <div className="flex items-center gap-2">
                  <label className="flex flex-row ">경유지 ID</label>
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

                  <label>타입 : 귀가행</label>

                  <label>
                    시간
                    <Input
                      type="datetime-local"
                      {...register(
                        `shuttleRouteHubsFromDestination.${index}.arrivalTime` as const,
                      )}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      index > 0 && swapFromDestHub(index, index - 1)
                    }
                    disabled={index === 0}
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
                    disabled={index === fromDestHubFields.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    아래로
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromDestHub(index)}
                    className="text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button type="submit" className="bg-blue-500 text-white p-8 rounded">
        추가
      </button>
    </form>
  );
};

export default Page;
