import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { useState } from 'react';
import { usePutShuttleRoute } from '@/services/shuttleRoute.service';
import { EditFormData } from './form.type';
import { conform } from './utils/conform.util';
import FormContainer from '@/components/form/Form';
import PriceSection from './components/PriceSection';
import StopOverSection from './components/StopOverSection';

interface Props {
  params: { eventId: string; dailyEventId: string; shuttleRouteId: string };
  defaultValues: EditFormData;
  defaultDate: string | undefined;
}

const EditForm = ({ params, defaultValues, defaultDate }: Props) => {
  const { eventId, dailyEventId, shuttleRouteId } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    defaultValues,
  });

  const hasEarlybird = defaultValues.hasEarlybird;
  const watchRegularPrice = useWatch({ control, name: 'regularPrice' });
  const watchEarlybirdPrice = useWatch({ control, name: 'earlybirdPrice' });

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

  const onSubmit = async (data: EditFormData) => {
    if (!confirm('수정하시겠습니까?')) return;
    try {
      setIsSubmitting(true);
      const body = conform(data);
      putRoute({
        eventId,
        dailyEventId,
        shuttleRouteId,
        body,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'arrivalTime is not validated'
      )
        alert('정류장들의 시간순서가 올바르지 않습니다. 확인해주세요.');
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

      <PriceSection
        control={control}
        errors={errors}
        hasEarlybird={hasEarlybird}
        watchRegularPrice={watchRegularPrice}
        watchEarlybirdPrice={watchEarlybirdPrice}
      />

      <StopOverSection control={control} defaultDate={defaultDate} />
      <FormContainer.submitButton disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : '수정하기'}
      </FormContainer.submitButton>
    </FormContainer>
  );
};

export default EditForm;
