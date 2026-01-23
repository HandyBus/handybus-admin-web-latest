'use client';

import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { BulkRouteFormValues } from '../form.type';
import RouteItem from './RouteItem/RouteItem';

const BulkRouteList = () => {
  const { control } = useFormContext<BulkRouteFormValues>();
  const destinationHub = useWatch({
    control,
    name: 'destinationHub',
  });

  const { fields } = useFieldArray({
    control,
    name: 'routes',
  });

  if (fields.length === 0) {
    return (
      <div className="rounded-6 border border-basic-grey-300 p-20 text-center text-basic-grey-600">
        {destinationHub
          ? '도착지를 선택하면 노선 목록이 표시됩니다.'
          : '도착지를 선택해주세요.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      {fields.map((field, index) => (
        <RouteItem key={field.id} index={index} />
      ))}
    </div>
  );
};

export default BulkRouteList;
