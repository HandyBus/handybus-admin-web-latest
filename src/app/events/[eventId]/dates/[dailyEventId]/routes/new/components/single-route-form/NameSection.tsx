'use client';

import { useFormContext } from 'react-hook-form';
import { MultiRouteFormValues } from '../../form.type';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';

interface Props {
  index: number;
}

const NameSection = ({ index }: Props) => {
  const { register } = useFormContext<MultiRouteFormValues>();

  return (
    <div className="flex flex-col gap-8">
      <Form.label htmlFor={`shuttleRoutes.${index}.name`} required>
        노선 이름
      </Form.label>
      <Input
        placeholder="노선 이름을 입력해주세요"
        {...register(`shuttleRoutes.${index}.name`)}
      />
    </div>
  );
};

export default NameSection;
