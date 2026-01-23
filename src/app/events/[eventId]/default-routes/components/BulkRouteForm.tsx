'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { BulkRouteFormValues } from '../form.type';
import Form from '@/components/form/Form';
import BulkRouteList from './BulkRouteList';
import DailyEventSelector from './DailyEventSelector';
import DestinationHubSelector from './DestinationHubSelector';
import CommonSettingsSection from './CommonSettingsSection';
import { useBulkRouteSubmission } from '../hooks/useBulkRouteSubmission';
import { useDefaultHubsRoutes } from '../hooks/useDefaultHubsRoutes';
import { EventsViewEntity } from '@/types/event.type';

interface Props {
  event: EventsViewEntity;
}

const BulkRouteForm = ({ event }: Props) => {
  const { control, handleSubmit } = useFormContext<BulkRouteFormValues>();

  const [selectedDailyEventIds, destinationHub, routes] = useWatch({
    control,
    name: ['selectedDailyEventIds', 'destinationHub', 'routes'],
  });

  // default-hubs 기반 노선 목록 자동 생성
  useDefaultHubsRoutes({
    selectedDailyEventIds,
    dailyEvents: event.dailyEvents,
  });

  // 노선 제출 로직
  const { submitBulkRoutes, isSubmitting } = useBulkRouteSubmission({
    eventId: event.eventId,
    dailyEvents: event.dailyEvents,
  });

  return (
    <Form onSubmit={handleSubmit(submitBulkRoutes)}>
      <DailyEventSelector dailyEvents={event.dailyEvents} />
      <CommonSettingsSection />
      <DestinationHubSelector />

      <Form.section>
        <Form.label>노선 목록</Form.label>
        <BulkRouteList />
      </Form.section>

      <Form.submitButton
        type="submit"
        disabled={
          !selectedDailyEventIds ||
          selectedDailyEventIds.length === 0 ||
          !destinationHub ||
          routes.length === 0 ||
          isSubmitting
        }
      >
        {isSubmitting ? '노선 생성 중...' : '노선 일괄 생성하기'}
      </Form.submitButton>
    </Form>
  );
};

export default BulkRouteForm;
