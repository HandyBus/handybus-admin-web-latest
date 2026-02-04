'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { BulkRouteFormValues } from '../form.type';
import Form from '@/components/form/Form';
import { formatDateString } from '@/utils/date.util';
import { EventDailyShuttlesInEventsViewEntity } from '@/types/event.type';

interface Props {
  dailyEvents: EventDailyShuttlesInEventsViewEntity[];
}

const DailyEventSelector = ({ dailyEvents }: Props) => {
  const { control, setValue } = useFormContext<BulkRouteFormValues>();
  const selectedDailyEventIds = useWatch({
    control,
    name: 'selectedDailyEventIds',
  });

  const handleToggleDailyEvent = (dailyEventId: string, checked: boolean) => {
    const currentIds = selectedDailyEventIds || [];
    if (checked) {
      setValue('selectedDailyEventIds', [...currentIds, dailyEventId]);
    } else {
      setValue(
        'selectedDailyEventIds',
        currentIds.filter((id) => id !== dailyEventId),
      );
    }
  };

  return (
    <Form.section>
      <Form.label required>노선을 생성할 일자 선택</Form.label>
      <div className="flex flex-wrap gap-8">
        {dailyEvents.map((dailyEvent) => {
          const isSelected = selectedDailyEventIds?.includes(
            dailyEvent.dailyEventId,
          );
          return (
            <label
              key={dailyEvent.dailyEventId}
              className="flex cursor-pointer items-center gap-8 rounded-6 border border-basic-grey-300 px-12 py-8"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) =>
                  handleToggleDailyEvent(
                    dailyEvent.dailyEventId,
                    e.target.checked,
                  )
                }
              />
              <span>{formatDateString(dailyEvent.dailyEventDate)}</span>
            </label>
          );
        })}
      </div>
    </Form.section>
  );
};

export default DailyEventSelector;
