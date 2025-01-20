import { authInstance } from '../config';
import { toSearchParamString } from '@/utils/searchParam.util';
import { ShuttleDemandStatistics } from '@/types/v2/demand.type';

export interface GetDemandOption {
  groupBy:
    | 'EVENT'
    | 'DAILY_EVENT'
    | 'PROVINCE'
    | 'CITY'
    | 'TO_DESTINATION_REGION_HUB'
    | 'FROM_DESTINATION_REGION_HUB';
  provinceFullName?: string;
  provinceShortName?: string;
  cityFullName?: string;
  cityShortName?: string;
  dailyEventId?: number;
  eventId?: number;
}

export const getDemand = async (option: GetDemandOption) => {
  const response = await authInstance.get(
    `/v2/shuttle-operation/admin/demands/all/stats${toSearchParamString({ ...option }, '?')}`,
    {
      shape: {
        statistics: ShuttleDemandStatistics.array(),
      },
    },
  );
  return response.statistics;
};
