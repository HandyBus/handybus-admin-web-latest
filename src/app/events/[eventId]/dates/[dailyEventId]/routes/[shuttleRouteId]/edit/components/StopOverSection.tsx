import Callout from '@/components/text/Callout';
import FormContainer from '@/components/form/Form';
import Heading from '@/components/text/Heading';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { EditFormData } from '../form.type';
import DateTimeInput from '@/components/input/DateTimeInput';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import { useStopOverItems } from '../useStopOverItems';

export const FIELD_ARRAY_NAMES = {
  TO_DESTINATION: 'shuttleRouteHubsToDestination' as const,
  FROM_DESTINATION: 'shuttleRouteHubsFromDestination' as const,
} as const;

interface Props {
  control: Control<EditFormData>;
  defaultDate: string | undefined;
}

const StopOverSection = ({ control, defaultDate }: Props) => {
  const toDestinationStop = useStopOverItems({
    control,
    fieldArrayName: FIELD_ARRAY_NAMES.TO_DESTINATION,
    defaultDate,
    isDestinationStop: (index, length) => index === length - 1,
  });

  const fromDestinationStops = useStopOverItems({
    control,
    fieldArrayName: FIELD_ARRAY_NAMES.FROM_DESTINATION,
    defaultDate,
    isDestinationStop: (index) => index === 0,
  });

  return (
    <FormContainer.section>
      <FormContainer.label>경유지</FormContainer.label>
      <Callout className="text-14">
        파란색으로 표시된 경유지는 행사 장소 근처 경유지에 해당합니다. (ex.
        인스파이어 아레나)
        <br />
        반드시 목적지행과 오는편 마다 두개 이상의 경유지를 입력해주세요.
        <br />
        경유지는 시간순서대로 입력해주세요.
        <br />
        경유지는 장소들 중 선택 가능합니다.
      </Callout>

      <StopOverItems
        title="가는편"
        control={control}
        fieldArrayName={FIELD_ARRAY_NAMES.TO_DESTINATION}
        {...toDestinationStop}
      />

      <StopOverItems
        title="오는편"
        control={control}
        fieldArrayName={FIELD_ARRAY_NAMES.FROM_DESTINATION}
        {...fromDestinationStops}
      />
    </FormContainer.section>
  );
};

export default StopOverSection;

interface StopOverItemsProps {
  title: string;
  fields: FieldArrayWithId<
    EditFormData,
    'shuttleRouteHubsToDestination' | 'shuttleRouteHubsFromDestination',
    'id'
  >[];
  addItem: () => void;
  removeItem: (index: number) => void;
  swapItems: (indexA: number, indexB: number) => void;
  isVenue: (index: number) => boolean;
  canMoveUp: (index: number) => boolean;
  canMoveDown: (index: number) => boolean;
  canDelete: (index: number) => boolean;
  control: Control<EditFormData>;
  fieldArrayName:
    | 'shuttleRouteHubsToDestination'
    | 'shuttleRouteHubsFromDestination';
}

const StopOverItems = ({
  title,
  fields,
  addItem,
  removeItem,
  swapItems,
  isVenue,
  canMoveUp,
  canMoveDown,
  canDelete,
  control,
  fieldArrayName,
}: StopOverItemsProps) => {
  return (
    <section
      className={
        fieldArrayName === FIELD_ARRAY_NAMES.TO_DESTINATION ? 'pb-12' : ''
      }
    >
      <Heading.h5 backgroundColor="yellow">
        {title}
        <button
          type="button"
          onClick={addItem}
          className="ml-8 text-14 text-blue-500"
        >
          추가
        </button>
      </Heading.h5>
      <ul className="flex flex-col gap-20">
        {fields.map((field, index) => (
          <StopOverItem
            key={field.id}
            index={index}
            isVenue={isVenue(index)}
            canMoveUp={canMoveUp(index)}
            canMoveDown={canMoveDown(index)}
            canDelete={canDelete(index)}
            onMoveUp={() => swapItems(index, index - 1)}
            onMoveDown={() => swapItems(index, index + 1)}
            onDelete={() => removeItem(index)}
            control={control}
            fieldArrayName={fieldArrayName}
          />
        ))}
      </ul>
    </section>
  );
};

interface StopOverItemProps {
  index: number;
  isVenue: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  control: Control<EditFormData>;
  fieldArrayName:
    | typeof FIELD_ARRAY_NAMES.TO_DESTINATION
    | typeof FIELD_ARRAY_NAMES.FROM_DESTINATION;
}

const StopOverItem = ({
  index,
  isVenue,
  canMoveUp,
  canMoveDown,
  canDelete,
  onMoveUp,
  onMoveDown,
  onDelete,
  control,
  fieldArrayName,
}: StopOverItemProps) => (
  <li
    className={`flex justify-between rounded-[6px] p-12 ${
      isVenue ? 'bg-notion-blue' : 'bg-notion-grey/50'
    }`}
  >
    <h5 className="my-auto text-16 font-500">{index + 1}</h5>
    <div className="w-[1px] rounded-full bg-grey-100" />
    <div className="flex flex-col">
      <label className="text-16 font-500">정류장</label>
      <Controller
        control={control}
        name={`${fieldArrayName}.${index}` as const}
        render={({ field: { onChange, value } }) => (
          <RegionHubInputSelfContained
            regionId={value.regionId ?? null}
            setRegionId={(regionId) => onChange({ ...value, regionId })}
            regionHubId={value.regionHubId ?? null}
            setRegionHubId={(regionHubId) =>
              onChange({ ...value, regionHubId })
            }
          />
        )}
      />
    </div>
    <div className="w-[1px] rounded-full bg-grey-100" />
    <div className="flex flex-col gap-12">
      <label className="text-16 font-500">시간</label>
      <Controller
        control={control}
        name={`${fieldArrayName}.${index}.arrivalTime` as const}
        render={({ field: { onChange, value } }) => (
          <DateTimeInput value={value} setValue={onChange} />
        )}
      />
    </div>
    <div className="w-[1px] rounded-full bg-grey-100" />
    <div className="flex items-center gap-8">
      <button
        type="button"
        onClick={() => canMoveUp && onMoveUp()}
        disabled={!canMoveUp}
        className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
      >
        위로
      </button>
      <button
        type="button"
        onClick={() => canMoveDown && onMoveDown()}
        disabled={!canMoveDown}
        className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
      >
        아래로
      </button>
      <button
        type="button"
        onClick={() => canDelete && onDelete()}
        className="text-red-500 disabled:opacity-30"
        disabled={!canDelete}
      >
        삭제
      </button>
    </div>
  </li>
);
