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
  const { push } = useRouter();
  const { mutateAsync: putRoute } = usePutShuttleRoute();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    defaultValues,
  });
  const hasEarlybird = defaultValues.hasEarlybird;
  const [watchRegularPrice, watchEarlybirdPrice] = useWatch({
    control,
    name: ['regularPrice', 'earlybirdPrice'],
  });

  const onSubmit = async (data: EditFormData) => {
    if (!confirm('수정하시겠습니까?')) return;

    setIsSubmitting(true);
    try {
      const body = conform(data);
      await putRoute({
        eventId,
        dailyEventId,
        shuttleRouteId,
        body,
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
