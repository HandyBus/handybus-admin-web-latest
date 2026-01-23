'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { BulkRouteFormValues } from '../../form.type';
import Form from '@/components/form/Form';
import NumberInput from '@/components/input/NumberInput';
import Input from '@/components/input/Input';
import { calculateDiscountPercent } from '../../utils/formatPrice.util';

interface Props {
  index: number;
  isEnabled: boolean;
}

const PriceSection = ({ index, isEnabled }: Props) => {
  const { control, watch } = useFormContext<BulkRouteFormValues>();
  const watchHasEarlybird = watch(`routes.${index}.hasEarlybird`);
  const watchRegularPrice = watch(`routes.${index}.regularPrice`);
  const watchEarlybirdPrice = watch(`routes.${index}.earlybirdPrice`);

  return (
    <div className="grid grid-cols-2 gap-16">
      <div className="flex flex-col gap-8">
        <Form.label className="shrink-0 whitespace-nowrap break-keep">
          일반 가격
        </Form.label>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8">
            <label className="text-14 font-500">왕복</label>
            <Controller
              control={control}
              name={`routes.${index}.regularPrice.roundTrip`}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 0}
                  setValue={onChange}
                  disabled={!isEnabled}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-8">
            <label className="text-14 font-500">행사장행</label>
            <Controller
              control={control}
              name={`routes.${index}.regularPrice.toDestination`}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 0}
                  setValue={onChange}
                  disabled={!isEnabled}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-8">
            <label className="text-14 font-500">귀가행</label>
            <Controller
              control={control}
              name={`routes.${index}.regularPrice.fromDestination`}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 0}
                  setValue={onChange}
                  disabled={!isEnabled}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col gap-8 ${watchHasEarlybird ? '' : 'opacity-50'}`}
      >
        <div className="flex items-center gap-8">
          <Form.label className="shrink-0 whitespace-nowrap break-keep">
            얼리버드 가격
          </Form.label>
          <Controller
            control={control}
            name={`routes.${index}.hasEarlybird`}
            render={({ field: { onChange, value } }) => (
              <Input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                disabled={!isEnabled}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8">
            <label className="text-14 font-500">
              왕복
              <span className="ml-4 text-12 text-basic-blue-400">
                {calculateDiscountPercent(
                  watchRegularPrice?.roundTrip || 0,
                  watchEarlybirdPrice?.roundTrip || 0,
                )}
              </span>
            </label>
            <Controller
              control={control}
              name={`routes.${index}.earlybirdPrice.roundTrip`}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 0}
                  setValue={onChange}
                  disabled={!isEnabled || !watchHasEarlybird}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-8">
            <label className="text-14 font-500">
              행사장행
              <span className="ml-4 text-12 text-basic-blue-400">
                {calculateDiscountPercent(
                  watchRegularPrice?.toDestination || 0,
                  watchEarlybirdPrice?.toDestination || 0,
                )}
              </span>
            </label>
            <Controller
              control={control}
              name={`routes.${index}.earlybirdPrice.toDestination`}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 0}
                  setValue={onChange}
                  disabled={!isEnabled || !watchHasEarlybird}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-8">
            <label className="text-14 font-500">
              귀가행
              <span className="ml-4 text-12 text-basic-blue-400">
                {calculateDiscountPercent(
                  watchRegularPrice?.fromDestination || 0,
                  watchEarlybirdPrice?.fromDestination || 0,
                )}
              </span>
            </label>
            <Controller
              control={control}
              name={`routes.${index}.earlybirdPrice.fromDestination`}
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value ?? 0}
                  setValue={onChange}
                  disabled={!isEnabled || !watchHasEarlybird}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
