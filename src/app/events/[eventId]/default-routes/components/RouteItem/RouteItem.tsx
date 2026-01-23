'use client';

import { useFormContext, useWatch } from 'react-hook-form';
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
  const { control, setValue } = useFormContext<BulkRouteFormValues>();
  const isEnabled = useWatch({
    control,
    name: `routes.${index}.isEnabled`,
  });

  const handleToggleEnabled = () => {
    setValue(`routes.${index}.isEnabled`, !isEnabled);
  };

  return (
    <div
      className={`relative rounded-6 border p-20 ${
        isEnabled
          ? 'border-basic-grey-300'
          : 'border-basic-grey-200 bg-basic-grey-50 opacity-60'
      }`}
    >
      <div className="absolute right-12 top-12 flex items-center gap-8">
        <button
          type="button"
          onClick={handleToggleEnabled}
          className={`py-6 rounded-4 px-12 text-14 font-500 transition-colors ${
            isEnabled
              ? 'bg-basic-green-100 text-basic-green-600 hover:bg-basic-green-200'
              : 'bg-basic-grey-200 text-basic-grey-600 hover:bg-basic-grey-300'
          }`}
        >
          {isEnabled ? '활성화됨' : '비활성화됨'}
        </button>
        <span className="text-14 font-500 text-basic-grey-600">
          노선 {index + 1}
        </span>
      </div>

      <div
        className={`flex flex-col gap-16 ${!isEnabled ? 'pointer-events-none' : ''}`}
      >
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
                disabled={!isEnabled}
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
                disabled={!isEnabled}
              />
            )}
          />
        </div>

        <PriceSection index={index} isEnabled={isEnabled} />
        <HubsSection index={index} isEnabled={isEnabled} />
      </div>
    </div>
  );
};

export default RouteItem;
