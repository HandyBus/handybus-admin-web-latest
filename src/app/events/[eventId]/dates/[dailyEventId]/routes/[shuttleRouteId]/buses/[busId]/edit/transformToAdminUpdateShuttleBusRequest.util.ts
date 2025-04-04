import { AdminUpdateShuttleBusRequest } from '@/types/shuttleBus.type';

export const transformToAdminUpdateShuttleBusRequest = (
  data: AdminUpdateShuttleBusRequest,
  defaultValue: AdminUpdateShuttleBusRequest,
): AdminUpdateShuttleBusRequest => {
  return extractChangedProperties(defaultValue, data);
};

const extractChangedProperties = <T>(defaultValue: T, data: T): Partial<T> => {
  const changedProperties: Partial<T> = {};

  for (const key in data) {
    if (data[key] !== defaultValue[key]) {
      changedProperties[key] = data[key];
    }
  }
  return changedProperties;
};
