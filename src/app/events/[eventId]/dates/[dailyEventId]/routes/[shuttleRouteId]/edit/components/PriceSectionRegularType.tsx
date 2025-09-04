import { Control, Controller, FieldErrors } from 'react-hook-form';
import Heading from '@/components/text/Heading';
import NumberInput from '@/components/input/NumberInput';
import DateInput from '@/components/input/DateInput';
import { FormValues } from '../form.type';

const PriceSectionRegularType = ({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}) => {
  return (
    <div className="flex flex-col gap-8 rounded-[4px] p-8">
      <Heading.h5 backgroundColor="yellow">일반 가격</Heading.h5>
      <Controller
        control={control}
        name="reservationDeadline"
        render={({ field: { onChange, value } }) => (
          <div className="space-y-2">
            <label
              htmlFor="reservationDeadline"
              className="block text-16 font-500"
            >
              예약 마감일
            </label>
            <DateInput value={value} setValue={onChange} />
            {errors.reservationDeadline && (
              <p className="text-basic-red-500">
                {errors.reservationDeadline?.message ?? ''}
              </p>
            )}
          </div>
        )}
      />
      {/* Price inputs would need to be implemented as arrays */}
      <TripPriceInput control={control} />
    </div>
  );
};

export default PriceSectionRegularType;

interface Props {
  control: Control<FormValues>;
}

const TripPriceInput = ({ control }: Props) => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-start gap-8">
        <label className="block break-keep text-16 font-500">왕복</label>
        <Controller
          control={control}
          name="regularPrice.roundTrip"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
      </div>
      <div className="flex flex-col items-start gap-8">
        <label className="block break-keep text-16 font-500">행사장행</label>
        <Controller
          control={control}
          name="regularPrice.toDestination"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
      </div>
      <div className="flex flex-col items-start gap-8">
        <label className="block break-keep text-16 font-500">귀가행</label>
        <Controller
          control={control}
          name="regularPrice.fromDestination"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
      </div>
    </div>
  );
};
