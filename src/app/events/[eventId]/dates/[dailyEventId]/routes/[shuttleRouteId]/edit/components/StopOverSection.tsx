import Callout from '@/components/text/Callout';
import FormContainer from '@/components/form/Form';
import Heading from '@/components/text/Heading';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { EditFormData } from '../form.type';
import DateTimeInput from '@/components/input/DateTimeInput';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';

interface Props {
  control: Control<EditFormData>;
  defaultDate: string | undefined;
}

const StopOverSection = ({ control, defaultDate }: Props) => {
  const {
    fields: fromDestHubFields,
    append: appendFromDestHub,
    remove: removeFromDestHub,
    swap: swapFromDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsFromDestination',
  });

  const {
    fields: toDestHubFields,
    prepend: prependToDestHub,
    remove: removeToDestHub,
    swap: swapToDestHub,
  } = useFieldArray({
    control,
    name: 'shuttleRouteHubsToDestination',
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

      <StopOverList
        title="가는편"
        fields={toDestHubFields}
        addItem={() =>
          prependToDestHub({
            regionHubId: '',
            arrivalTime: defaultDate ?? '',
          })
        }
        removeItem={removeToDestHub}
        swapItems={swapToDestHub}
        getIsBlueBackground={(index) => index === toDestHubFields.length - 1}
        canMoveUp={(index) => index > 0 && index !== toDestHubFields.length - 1}
        canMoveDown={(index) =>
          index < toDestHubFields.length - 1 &&
          index !== toDestHubFields.length - 2
        }
        canDelete={(index) => index !== toDestHubFields.length - 1}
        control={control}
        fieldArrayName="shuttleRouteHubsToDestination"
      />

      <StopOverList
        title="오는편"
        fields={fromDestHubFields}
        addItem={() =>
          appendFromDestHub({
            regionHubId: '',
            arrivalTime: defaultDate ?? '',
          })
        }
        removeItem={removeFromDestHub}
        swapItems={swapFromDestHub}
        getIsBlueBackground={(index) => index === 0}
        canMoveUp={(index) => index > 0 && index !== 1}
        canMoveDown={(index) =>
          index < fromDestHubFields.length - 1 && index !== 0
        }
        canDelete={(index) => index !== 0}
        control={control}
        fieldArrayName="shuttleRouteHubsFromDestination"
      />
    </FormContainer.section>
  );
};

export default StopOverSection;

interface StopOverListProps {
  title: string;
  fields: Record<'id', string>[];
  addItem: () => void;
  removeItem: (index: number) => void;
  swapItems: (indexA: number, indexB: number) => void;
  getIsBlueBackground: (index: number) => boolean;
  canMoveUp: (index: number) => boolean;
  canMoveDown: (index: number) => boolean;
  canDelete: (index: number) => boolean;
  control: Control<EditFormData>;
  fieldArrayName:
    | 'shuttleRouteHubsToDestination'
    | 'shuttleRouteHubsFromDestination';
}

const StopOverList = ({
  title,
  fields,
  addItem,
  removeItem,
  swapItems,
  getIsBlueBackground,
  canMoveUp,
  canMoveDown,
  canDelete,
  control,
  fieldArrayName,
}: StopOverListProps) => {
  return (
    <section
      className={
        fieldArrayName === 'shuttleRouteHubsToDestination' ? 'pb-12' : ''
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
        {fields.map((field, index) => {
          return (
            <li
              key={field.id}
              className={`flex justify-between rounded-[6px] p-12 ${
                getIsBlueBackground(index)
                  ? 'bg-notion-blue'
                  : 'bg-notion-grey/50'
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
                      setRegionId={(regionId) =>
                        onChange({ ...value, regionId })
                      }
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
                  onClick={() => index > 0 && swapItems(index, index - 1)}
                  disabled={!canMoveUp(index)}
                  className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
                >
                  위로
                </button>
                <button
                  type="button"
                  onClick={() =>
                    index < fields.length - 1 && swapItems(index, index + 1)
                  }
                  disabled={!canMoveDown(index)}
                  className="text-grey-500 hover:text-grey-700 disabled:opacity-30"
                >
                  아래로
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 disabled:opacity-30"
                  disabled={!canDelete(index)}
                >
                  삭제
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
