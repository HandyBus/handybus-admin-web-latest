import { EditFormValues } from '../form.type';
import PriceSectionRegularType from './PriceSectionRegularType';
import PriceSectionEarlybirdType from './PriceSectionEarlyBirdType';
import { Control, FieldErrors } from 'react-hook-form';
import FormContainer from '@/components/form/Form';
import Callout from '@/components/text/Callout';

interface Props {
  control: Control<EditFormValues>;
  errors: FieldErrors<EditFormValues>;
  hasEarlybird: boolean;
  watchRegularPrice: EditFormValues['regularPrice'];
  watchEarlybirdPrice: EditFormValues['earlybirdPrice'];
}

const PriceSection = ({
  control,
  errors,
  hasEarlybird,
  watchRegularPrice,
  watchEarlybirdPrice,
}: Props) => {
  return (
    <FormContainer.section>
      <div className="flex items-baseline gap-20">
        <FormContainer.label required>가격</FormContainer.label>
        <div className="flex gap-8">
          <span className="text-14 text-blue-600">
            {`얼리버드 ${hasEarlybird ? '적용됨' : '미적용'}`}
          </span>
        </div>
      </div>
      <Callout className="text-14">
        <b>주의: </b>얼리버드 적용 여부 및 얼리버드 마감일은 노선 추가 후{' '}
        <b className="text-red-500">변경이 불가</b>합니다.
      </Callout>
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
