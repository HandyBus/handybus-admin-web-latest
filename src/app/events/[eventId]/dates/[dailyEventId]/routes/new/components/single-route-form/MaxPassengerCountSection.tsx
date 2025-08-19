'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { MultiRouteFormValues } from '../../form.type';
import Form from '@/components/form/Form';
import NumberInput from '@/components/input/NumberInput';

interface Props {
  index: number;
}

const MaxPassengerCountSection = ({ index }: Props) => {
  const { control } = useFormContext<MultiRouteFormValues>();

  return (
    <div className="flex flex-col gap-8">
      <Form.label htmlFor={`shuttleRoutes.${index}.maxPassengerCount`} required>
        최대 승객 수
      </Form.label>
      <Controller
        control={control}
        name={`shuttleRoutes.${index}.maxPassengerCount`}
        render={({ field: { onChange, value } }) => (
          <NumberInput
            value={value ?? 0}
            setValue={onChange}
            placeholder="최대 승객 수를 입력해주세요"
          />
        )}
      />
    </div>
  );
};

export default MaxPassengerCountSection;
