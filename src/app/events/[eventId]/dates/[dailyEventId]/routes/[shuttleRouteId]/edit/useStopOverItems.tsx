import { FIELD_ARRAY_NAMES } from './components/StopOverSection';
import { Control, useFieldArray } from 'react-hook-form';
import { EditFormData } from './form.type';

export const useStopOverItems = ({
  control,
  fieldArrayName,
  defaultDate,
  isDestinationStop,
}: {
  control: Control<EditFormData>;
  fieldArrayName: (typeof FIELD_ARRAY_NAMES)[keyof typeof FIELD_ARRAY_NAMES];
  defaultDate: string | undefined;
  isDestinationStop: (index: number, length: number) => boolean;
}) => {
  const {
    fields,
    append,
    prepend,
    remove: removeItem,
    swap: swapItems,
  } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  const addItem = () => {
    const method =
      fieldArrayName === FIELD_ARRAY_NAMES.TO_DESTINATION ? prepend : append;
    method({
      regionHubId: '',
      arrivalTime: defaultDate ?? '',
    });
  };

  const isVenue = (index: number) => isDestinationStop(index, fields.length);

  // 배열의 index 순서에 따라 위아래 이동 및 삭제 가능 여부를 판단합니다.
  const canMoveUp = (index: number) => {
    if (fieldArrayName === FIELD_ARRAY_NAMES.TO_DESTINATION) {
      return index > 0 && index !== fields.length - 1;
    }
    return index > 0 && index !== 1;
  };

  const canMoveDown = (index: number) => {
    if (fieldArrayName === FIELD_ARRAY_NAMES.TO_DESTINATION) {
      return index < fields.length - 1 && index !== fields.length - 2;
    }
    return index < fields.length - 1 && index !== 0;
  };

  const canDelete = (index: number) => {
    if (fieldArrayName === FIELD_ARRAY_NAMES.TO_DESTINATION) {
      return index !== fields.length - 1;
    }
    return index !== 0;
  };

  return {
    fields,
    addItem,
    removeItem,
    swapItems,
    isVenue,
    canMoveUp,
    canMoveDown,
    canDelete,
  };
};
