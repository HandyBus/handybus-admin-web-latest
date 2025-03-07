import { Control, Controller } from 'react-hook-form';
import { EditFormValues } from '../form.type';
import { FieldArrayWithId } from 'react-hook-form';
import { FIELD_ARRAY_NAMES } from './ShuttleRouteHubSection';
import Heading from '@/components/text/Heading';
import DateTimeInput from '@/components/input/DateTimeInput';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';

interface ShuttleRouteHubItemsProps {
  title: '가는편' | '오는편';
  fields: FieldArrayWithId<
    EditFormValues,
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
  control: Control<EditFormValues>;
  fieldArrayName:
    | 'shuttleRouteHubsToDestination'
    | 'shuttleRouteHubsFromDestination';
}

export const ShuttleRouteHubItems = ({
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
}: ShuttleRouteHubItemsProps) => {
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
          <ShuttleRouteHubItem
            key={field.id}
            index={index}
            isVenue={isVenue(index)}
            canMoveUp={canMoveUp(index)}
            canMoveDown={canMoveDown(index)}
            canDelete={canDelete(index) && !field.shuttleRouteHubId} // 기존의 정류장은 삭제하지 못함.
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

interface ShuttleRouteHubItemProps {
  index: number;
  isVenue: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  control: Control<EditFormValues>;
  fieldArrayName:
    | typeof FIELD_ARRAY_NAMES.TO_DESTINATION
    | typeof FIELD_ARRAY_NAMES.FROM_DESTINATION;
}

const ShuttleRouteHubItem = ({
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
}: ShuttleRouteHubItemProps) => (
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
