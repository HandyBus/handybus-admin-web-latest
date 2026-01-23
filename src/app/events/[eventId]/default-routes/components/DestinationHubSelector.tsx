'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { BulkRouteFormValues } from '../form.type';
import Form from '@/components/form/Form';
import RegionHubInputWithButton from '@/components/input/RegionHubInputWithButton';

const DestinationHubSelector = () => {
  const { control } = useFormContext<BulkRouteFormValues>();

  return (
    <Form.section>
      <Form.label required>도착지</Form.label>
      <Controller
        control={control}
        name="destinationHub"
        render={({ field: { onChange, value } }) => (
          <RegionHubInputWithButton
            hubUsageTypes={['EVENT_LOCATION']}
            regionHub={value ?? null}
            setRegionHub={onChange}
            placeholder="도착지를 선택해주세요"
          />
        )}
      />
    </Form.section>
  );
};

export default DestinationHubSelector;
