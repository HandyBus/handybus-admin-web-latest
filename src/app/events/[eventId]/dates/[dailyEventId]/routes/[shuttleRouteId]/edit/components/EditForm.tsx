import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { useState } from 'react';
import { usePutShuttleRoute } from '@/services/shuttleRoute.service';
import { FormValues } from '../form.type';
import FormContainer from '@/components/form/Form';
import PriceSection from './PriceSection';
import ShuttleRouteHubSection from './ShuttleRouteHubSection';
import { extractHubs } from '../utils/extractHubs';
import { validateShuttleRouteData } from '../utils/validateShuttleRouteData';
import { transformToShuttleRouteRequest } from '../utils/transformToShuttleRouteRequest';
import Toggle from '@/components/button/Toggle';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
  defaultValues: FormValues;
  defaultDate: string | undefined;
}

const EditForm = ({ params, defaultValues, defaultDate }: Props) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();
  const { mutateAsync: putRoute } = usePutShuttleRoute();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    defaultValues,
  });
  const hasEarlybird = defaultValues.hasEarlybird;
  const [watchRegularPrice, watchEarlybirdPrice, watchIsReservationDisabled] =
    useWatch({
      control,
      name: ['regularPrice', 'earlybirdPrice', 'isReservationDisabled'],
    });

  const onSubmit = async (data: FormValues) => {
    if (!confirm('수정하시겠습니까?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { forwardHubs, returnHubs } = extractHubs(data);
      validateShuttleRouteData(forwardHubs, returnHubs, data.regularPrice);
      const shuttleRouteRequest = transformToShuttleRouteRequest(
        dirtyFields,
        data,
        forwardHubs,
        returnHubs,
      );
      await putRoute({
        eventId,
        dailyEventId,
        shuttleRouteId,
        body: shuttleRouteRequest,
      });
      alert('노선이 수정되었습니다.');
      push(`/events/${eventId}/dates/${dailyEventId}/routes/${shuttleRouteId}`);
    } catch (error) {
      let errorMessage = '오류가 발생했습니다.';

      if (error instanceof Error) {
        if (error.message === 'arrivalTime is not validated') {
          errorMessage =
            '정류장들의 시간순서가 올바르지 않습니다. 확인해주세요.';
        } else {
          errorMessage += `\n${error.message}`;
        }
      }

      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormContainer.section>
        <FormContainer.label htmlFor="name" required>
          노선 이름
        </FormContainer.label>
        <Input {...register('name')} />
        {errors.name && (
          <p className="text-basic-red-500">{errors.name.message}</p>
        )}
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
          <p className="text-basic-red-500">
            {errors.maxPassengerCount.message}
          </p>
        )}
      </FormContainer.section>

      <PriceSection
        control={control}
        errors={errors}
        hasEarlybird={hasEarlybird}
        watchRegularPrice={watchRegularPrice}
        watchEarlybirdPrice={watchEarlybirdPrice}
      />

      <ShuttleRouteHubSection control={control} defaultDate={defaultDate} />

      <FormContainer.section>
        <FormContainer.label>관리자 수동 예약 비활성화</FormContainer.label>
        <div className="flex flex-wrap gap-8">
          <Toggle
            label="왕복"
            value={!!watchIsReservationDisabled.roundTrip}
            onClick={() =>
              setValue(
                'isReservationDisabled.roundTrip',
                !watchIsReservationDisabled.roundTrip,
                { shouldDirty: true },
              )
            }
          />
          <Toggle
            label="행사장행"
            value={!!watchIsReservationDisabled.toDestination}
            onClick={() =>
              setValue(
                'isReservationDisabled.toDestination',
                !watchIsReservationDisabled.toDestination,
                { shouldDirty: true },
              )
            }
          />
          <Toggle
            label="귀가행"
            value={!!watchIsReservationDisabled.fromDestination}
            onClick={() =>
              setValue(
                'isReservationDisabled.fromDestination',
                !watchIsReservationDisabled.fromDestination,
                { shouldDirty: true },
              )
            }
          />
        </div>
        <p className="text-14 font-500 text-basic-grey-600">
          활성화된 방향은 예약이 제한되며, 매진으로 표시됩니다.
        </p>
      </FormContainer.section>

      <FormContainer.submitButton disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : '수정하기'}
      </FormContainer.submitButton>
    </FormContainer>
  );
};

export default EditForm;
