import Callout from '@/components/text/Callout';
import FormContainer from '@/components/form/Form';
import { Control } from 'react-hook-form';
import { EditFormData } from '../form.type';
import { useStopOverItems } from '../useStopOverItems';
import { StopOverItems } from './StopOverItems';

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
        <br />
        기존에 생성된 경유지는 삭제는 불가능합니다. 수정만 가능합니다.
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
