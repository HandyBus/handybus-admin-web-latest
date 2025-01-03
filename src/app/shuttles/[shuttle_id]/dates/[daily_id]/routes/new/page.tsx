'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { conform, type CreateShuttleRouteFormType } from './form.type';
import { addRoute } from '@/services/api/route.services';
import { useRouter } from 'next/navigation';
import tw from 'tailwind-styled-components';

interface Props {
  params: { shuttle_id: string; daily_id: string };
}

const Input = tw.input`
  rounded-lg
  border
  border-grey-100
  p-8
`;

const defaultValues: CreateShuttleRouteFormType = {
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

const Page = ({ params: { shuttle_id, daily_id } }: Props) => {
  const router = useRouter();
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateShuttleRouteFormType>({
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

  const onSubmit = async (data: CreateShuttleRouteFormType) => {
    if (!confirm('등록하시겠습니까?')) return;
    try {
      await addRoute(Number(shuttle_id), Number(daily_id), conform(data));
      alert('등록에 성공했습니다.');
      router.push(`/shuttles/${shuttle_id}/dates/${daily_id}`);
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
            appendFromDestHub({
              regionHubId: 0,
              arrivalTime: new Date(),
            })
          }
          className="text-blue-500 px-2 py-1 rounded text-sm"
        >
          추가
        </button>
        <div className="space-y-2">
          {toDestHubFields.map((field, index) => {
            return (
              <div key={field.id}>
                <div className="flex items-center gap-2">
                  <label>
                    경유지 ID
                    <Input
                      type="number"
                      {...register(
                        `shuttleRouteHubsToDestination.${index}.regionHubId` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      placeholder="Hub ID"
                    />
                  </label>

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
            appendToDestHub({
              regionHubId: 0,
              arrivalTime: new Date(),
            })
          }
          className="text-blue-500 px-2 py-1 rounded text-sm"
        >
          추가
        </button>
        <div className="space-y-2">
          {fromDestHubFields.map((field, index) => {
            return (
              <div key={field.id}>
                <div className="flex items-center gap-2">
                  <label>
                    경유지 ID
                    <Input
                      type="number"
                      {...register(
                        `shuttleRouteHubsFromDestination.${index}.regionHubId` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      placeholder="Hub ID"
                    />
                  </label>

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
