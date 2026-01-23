'use client';

import { useFormContext } from 'react-hook-form';
import { BulkRouteFormValues } from '../../form.type';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';
import NumberInput from '@/components/input/NumberInput';
import { Controller } from 'react-hook-form';
import PriceSection from './PriceSection';
import HubsSection from './HubsSection';

interface Props {
  index: number;
}

const RouteItem = ({ index }: Props) => {
  const { control } = useFormContext<BulkRouteFormValues>();

  return (
    <div className="relative rounded-6 border border-basic-grey-300 p-20">
      <div className="absolute right-12 top-12 text-14 font-500 text-basic-grey-600">
        노선 {index + 1}
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Form.label required>노선 이름</Form.label>
          <Controller
            control={control}
            name={`routes.${index}.name`}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="노선 이름을 입력해주세요"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-8">
          <Form.label required>최대 승객 수</Form.label>
          <Controller
            control={control}
            name={`routes.${index}.maxPassengerCount`}
            render={({ field: { onChange, value } }) => (
              <NumberInput
                value={value ?? 0}
                setValue={onChange}
                placeholder="최대 승객 수를 입력해주세요"
              />
            )}
          />
        </div>

        <PriceSection index={index} />
        <HubsSection index={index} />
      </div>
    </div>
  );
};

export default RouteItem;
