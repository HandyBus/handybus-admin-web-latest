'use client';

import Form from '@/components/form/Form';
import { Controller, useFormContext } from 'react-hook-form';
import { MultiRouteFormValues } from '../../form.type';
import Input from '@/components/input/Input';
import Heading from '@/components/text/Heading';
import DateInput from '@/components/input/DateInput';
import NumberInput from '@/components/input/NumberInput';

interface Props {
  index: number;
}

const PriceSection = ({ index }: Props) => {
  const { control, watch, register } = useFormContext<MultiRouteFormValues>();

  const watchHasEarlybird = watch(`shuttleRoutes.${index}.hasEarlybird`);
  const watchRegularPrice = watch(`shuttleRoutes.${index}.regularPrice`);
  const watchEarlybirdPrice = watch(`shuttleRoutes.${index}.earlybirdPrice`);

  const discountPercent = (regular: number, earlybird: number) => {
    if (regular === 0 || earlybird === 0) return '';
    const discount = (((regular - earlybird) / regular) * 100).toFixed(0);
    return `(${discount}% 할인)`;
  };

  return (
    <div className="flex flex-col gap-8">
      <Form.label required>가격</Form.label>
      <div className="flex items-center gap-8">
        <span className="text-14 text-basic-grey-700">얼리버드 적용</span>
        <Input
          type="checkbox"
          className="w-fit text-basic-grey-700"
          {...register(`shuttleRoutes.${index}.hasEarlybird`)}
        />
      </div>
      <article className="grid w-full grid-cols-2 gap-12">
        <div className="flex flex-col gap-8">
          <Heading.h5 backgroundColor="yellow">일반 가격</Heading.h5>
          <Controller
            control={control}
            name={`shuttleRoutes.${index}.reservationDeadline`}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-2">
                <label className="block text-16 font-500">예약 마감일</label>
                <DateInput value={value} setValue={onChange} />
              </div>
            )}
          />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col items-start gap-8">
              <label className="block break-keep text-16 font-500">왕복</label>
              <Controller
                control={control}
                name={`shuttleRoutes.${index}.regularPrice.roundTrip`}
                render={({ field: { onChange, value } }) => (
                  <NumberInput value={value ?? 0} setValue={onChange} />
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-8">
              <label className="block break-keep text-16 font-500">
                가는편
              </label>
              <Controller
                control={control}
                name={`shuttleRoutes.${index}.regularPrice.toDestination`}
                render={({ field: { onChange, value } }) => (
                  <NumberInput value={value ?? 0} setValue={onChange} />
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-8">
              <label className="block break-keep text-16 font-500">
                오는편
              </label>
              <Controller
                control={control}
                name={`shuttleRoutes.${index}.regularPrice.fromDestination`}
                render={({ field: { onChange, value } }) => (
                  <NumberInput value={value ?? 0} setValue={onChange} />
                )}
              />
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col gap-8 ${watchHasEarlybird ? '' : 'opacity-50'}`}
        >
          <Heading.h5 backgroundColor="blue">얼리버드 가격</Heading.h5>
          <label className="block text-16 font-500">예약 마감일</label>
          <Controller
            control={control}
            name={`shuttleRoutes.${index}.earlybirdDeadline`}
            render={({ field: { onChange, value } }) => (
              <>
                <DateInput
                  disabled={!watchHasEarlybird}
                  value={value}
                  setValue={onChange}
                />
              </>
            )}
          />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col items-start gap-8">
              <label className="block break-keep text-16 font-500">
                왕복
                <span className="ml-4 text-14 text-basic-blue-400">
                  {discountPercent(
                    watchRegularPrice.roundTrip,
                    watchEarlybirdPrice.roundTrip,
                  )}
                </span>
              </label>
              <Controller
                control={control}
                name={`shuttleRoutes.${index}.earlybirdPrice.roundTrip`}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    value={value ?? 0}
                    setValue={onChange}
                    disabled={!watchHasEarlybird}
                  />
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-8">
              <label className="block break-keep text-16 font-500">
                가는편
                <span className="ml-4 text-14 text-basic-blue-400">
                  {discountPercent(
                    watchRegularPrice.toDestination,
                    watchEarlybirdPrice.toDestination,
                  )}
                </span>
              </label>
              <Controller
                control={control}
                name={`shuttleRoutes.${index}.earlybirdPrice.toDestination`}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    value={value ?? 0}
                    setValue={onChange}
                    disabled={!watchHasEarlybird}
                  />
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-8">
              <label className="block break-keep text-16 font-500">
                오는편
                <span className="ml-4 text-14 text-basic-blue-400">
                  {discountPercent(
                    watchRegularPrice.fromDestination,
                    watchEarlybirdPrice.fromDestination,
                  )}
                </span>
              </label>
              <Controller
                control={control}
                name={`shuttleRoutes.${index}.earlybirdPrice.fromDestination`}
                render={({ field: { onChange, value } }) => (
                  <NumberInput
                    value={value ?? 0}
                    setValue={onChange}
                    disabled={!watchHasEarlybird}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PriceSection;
