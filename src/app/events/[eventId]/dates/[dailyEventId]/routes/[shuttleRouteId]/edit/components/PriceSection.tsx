import { FormValues } from '../form.type';
import PriceSectionRegularType from './PriceSectionRegularType';
import PriceSectionEarlybirdType from './PriceSectionEarlyBirdType';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import FormContainer from '@/components/form/Form';

interface Props {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  hasEarlybird: boolean;
  setValue: UseFormSetValue<FormValues>;
  watchRegularPrice: FormValues['regularPrice'];
  watchEarlybirdPrice: FormValues['earlybirdPrice'];
}

const PriceSection = ({
  control,
  errors,
  hasEarlybird,
  setValue,
  watchRegularPrice,
  watchEarlybirdPrice,
}: Props) => {
  return (
    <FormContainer.section>
      <div className="flex items-baseline gap-20">
        <FormContainer.label required>가격</FormContainer.label>
        <label className="flex cursor-pointer items-center gap-4">
          <input
            type="checkbox"
            checked={hasEarlybird}
            onChange={(e) => {
              const checked = e.target.checked;
              setValue('hasEarlybird', checked, { shouldDirty: true });
              if (checked && !watchEarlybirdPrice) {
                setValue(
                  'earlybirdPrice',
                  { roundTrip: 0, toDestination: 0, fromDestination: 0 },
                  { shouldDirty: true },
                );
              }
            }}
            className="h-16 w-16"
          />
          <span className="text-14 text-basic-grey-600">얼리버드 적용</span>
        </label>
      </div>
      <article className="grid w-full grid-cols-2 gap-12">
        <PriceSectionRegularType control={control} errors={errors} />
        <PriceSectionEarlybirdType
          control={control}
          hasEarlybird={hasEarlybird}
          watchRegularPrice={watchRegularPrice}
          watchEarlybirdPrice={watchEarlybirdPrice}
        />
      </article>
    </FormContainer.section>
  );
};

export default PriceSection;
