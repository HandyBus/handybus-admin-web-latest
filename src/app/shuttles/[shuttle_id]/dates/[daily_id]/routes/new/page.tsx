'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import {
  CreateShuttleRouteRequestFormType,
  CreateShuttleRouteRequestType,
} from '@/types/route.type';
import { addRoute } from '@/app/actions/route.action';
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

const defaultValues: CreateShuttleRouteRequestFormType = {
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
  shuttleRouteHubs: [
    {
      regionHubID: 0,
      type: '__MARKER_DESINATION_NOT_A_REAL_ROUTE__',
      sequence: 0,
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
  } = useForm<CreateShuttleRouteRequestFormType>({
    // resolver: zodResolver(CreateShuttleRouteRequestSchema),
    defaultValues,
  });

  const watchHasEarlybird = watch('hasEarlybird');

  const {
    fields: hubFields,
    append: appendHub,
    remove: removeHub,
    // update: updateHub,
    swap: swapHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubs',
  });

  const onSubmit = async (data: CreateShuttleRouteRequestFormType) => {
    alert(JSON.stringify(data, null, 2));

    try {
      const request = {
        ...data,
        shuttleRouteHubs: data.shuttleRouteHubs.filter(
          (h) => h.type !== '__MARKER_DESINATION_NOT_A_REAL_ROUTE__',
        ) as CreateShuttleRouteRequestType['shuttleRouteHubs'],
      } satisfies CreateShuttleRouteRequestType;
      await addRoute(Number(shuttle_id), Number(daily_id), request);
      router.push(`/shuttles/${shuttle_id}/dates/${daily_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const findDividerIndex = (
    fields: CreateShuttleRouteRequestFormType['shuttleRouteHubs'],
  ) => {
    return fields.findIndex(
      (field) => field.type === '__MARKER_DESINATION_NOT_A_REAL_ROUTE__',
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col gap-16 bg-grey-50 rounded-lg p-16  "
    >
      <h1 className="text-2xl font-bold">새 경로 추가</h1>

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
        <h3>경유지</h3>
        <button
          type="button"
          onClick={() =>
            appendHub({
              regionHubID: 0,
              sequence: Math.abs(
                findDividerIndex(hubFields) - hubFields.length,
              ),
              type: 'FROM_DESTINATION',
              arrivalTime: new Date(),
            })
          }
          className="text-blue-500 px-2 py-1 rounded text-sm"
        >
          추가
        </button>
        <div className="space-y-2">
          {hubFields.map((field, index) => {
            if (field.type === '__MARKER_DESINATION_NOT_A_REAL_ROUTE__') {
              return (
                <div
                  key={field.id}
                  className="bg-primary-main rounded-lg text-white p-8 justify-center flex-row gap-8 flex"
                >
                  ~~ 셔틀 목적지 ~~
                  <button
                    type="button"
                    onClick={() => index > 0 && swapHub(index, index - 1)}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    위로
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      index < hubFields.length - 1 && swapHub(index, index + 1)
                    }
                    disabled={index === hubFields.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    아래로
                  </button>
                </div>
              );
            }

            return (
              <div key={field.id}>
                {index === findDividerIndex(hubFields) && (
                  <div className="my-4 border-t-2 border-gray-300 relative">
                    <span className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-500">
                      귀가 경로
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label>
                    경유지 ID
                    <Input
                      type="number"
                      {...register(
                        `shuttleRouteHubs.${index}.regionHubID` as const,
                        {
                          valueAsNumber: true,
                        },
                      )}
                      placeholder="Hub ID"
                    />
                  </label>
                  <Input
                    type="number"
                    {...register(
                      `shuttleRouteHubs.${index}.sequence` as const,
                      {
                        valueAsNumber: true,
                        value:
                          findDividerIndex(hubFields) - index > 0
                            ? index + 1
                            : Math.abs(findDividerIndex(hubFields) - index),
                      },
                    )}
                    placeholder="Order"
                    readOnly
                  />

                  <label>
                    타입
                    <select
                      {...register(`shuttleRouteHubs.${index}.type`, {
                        value:
                          index < findDividerIndex(hubFields)
                            ? 'TO_DESTINATION'
                            : 'FROM_DESTINATION',
                      })}
                    >
                      <option
                        value="TO_DESTINATION"
                        disabled={index >= findDividerIndex(hubFields)}
                      >
                        목적지로
                      </option>
                      <option
                        value="FROM_DESTINATION"
                        disabled={index < findDividerIndex(hubFields)}
                      >
                        귀가
                      </option>
                    </select>
                  </label>

                  <label>
                    시간
                    <Input
                      type="datetime-local"
                      {...register(
                        `shuttleRouteHubs.${index}.arrivalTime` as const,
                      )}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => index > 0 && swapHub(index, index - 1)}
                    disabled={index === 0}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    위로
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      index < hubFields.length - 1 && swapHub(index, index + 1)
                    }
                    disabled={index === hubFields.length - 1}
                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    아래로
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHub(index)}
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
