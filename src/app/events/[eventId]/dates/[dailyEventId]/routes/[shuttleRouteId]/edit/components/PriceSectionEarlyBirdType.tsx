import { Control, Controller } from 'react-hook-form';
import Heading from '@/components/text/Heading';
import NumberInput from '@/components/input/NumberInput';
import DateInput from '@/components/input/DateInput';
import { EditFormValues } from '../form.type';
import { discountPercent } from '../../../discountPercent.util';

interface Props {
  control: Control<EditFormValues>;
  hasEarlybird: boolean;
  watchRegularPrice: EditFormValues['regularPrice'];
  watchEarlybirdPrice: EditFormValues['earlybirdPrice'];
}

const PriceSectionEarlybirdType = ({
  control,
  hasEarlybird,
  watchRegularPrice,
  watchEarlybirdPrice,
}: Props) => {
  return (
    <div
      className={`flex flex-col gap-8 rounded-[4px] p-8 ${hasEarlybird ? '' : 'bg-notion-basic-grey'}`}
    >
      <Heading.h5 backgroundColor="blue">얼리버드 가격</Heading.h5>
      <label className="block text-16 font-500">예약 마감일</label>
      <Controller
        control={control}
        name="earlybirdDeadline"
        render={({ field: { value } }) => (
          <DateInput disabled={true} value={value} />
        )}
      />
      <TripPriceInputEarlybird
        control={control}
        hasEarlybird={hasEarlybird}
        watchRegularPrice={watchRegularPrice}
        watchEarlybirdPrice={watchEarlybirdPrice}
      />
    </div>
  );
};

export default PriceSectionEarlybirdType;

interface TripPriceInputEarlybirdProps {
  control: Control<EditFormValues>;
  hasEarlybird: boolean;
  watchRegularPrice: EditFormValues['regularPrice'];
  watchEarlybirdPrice: EditFormValues['earlybirdPrice'];
}

const TripPriceInputEarlybird = ({
  control,
  hasEarlybird,
  watchRegularPrice,
  watchEarlybirdPrice,
}: TripPriceInputEarlybirdProps) => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-start gap-8">
        <label className="block break-keep text-16 font-500">
          왕복
          <span className="ml-4 text-14 text-basic-blue-400">
            {watchEarlybirdPrice &&
              discountPercent(
                watchRegularPrice.roundTrip,
                watchEarlybirdPrice.roundTrip,
              )}
          </span>
        </label>
        <Controller
          control={control}
          name="earlybirdPrice.roundTrip"
          render={({ field: { onChange, value } }) => (
            <NumberInput
              value={value ?? 0}
              setValue={onChange}
              disabled={!hasEarlybird}
            />
          )}
        />
      </div>
      <div className="flex flex-col items-start gap-8">
        <label className="block break-keep text-16 font-500">
          가는편
          <span className="ml-4 text-14 text-basic-blue-400">
            {watchEarlybirdPrice &&
              discountPercent(
                watchRegularPrice.toDestination,
                watchEarlybirdPrice.toDestination,
              )}
          </span>
        </label>
        <Controller
          control={control}
          name="earlybirdPrice.toDestination"
          disabled={!hasEarlybird}
          render={({ field: { onChange, value } }) => (
            <NumberInput
              value={value ?? 0}
              setValue={onChange}
              disabled={!hasEarlybird}
            />
          )}
        />
      </div>
      <div className="flex flex-col items-start gap-8">
        <label className="block break-keep text-16 font-500">
          오는편
          <span className="ml-4 text-14 text-basic-blue-400">
            {watchEarlybirdPrice &&
              discountPercent(
                watchRegularPrice.fromDestination,
                watchEarlybirdPrice.fromDestination,
              )}
          </span>
        </label>
        <Controller
          control={control}
          name="earlybirdPrice.fromDestination"
          disabled={!hasEarlybird}
          render={({ field: { onChange, value } }) => (
            <NumberInput
              value={value ?? 0}
              setValue={onChange}
              disabled={!hasEarlybird}
            />
          )}
        />
      </div>
    </div>
  );
};
