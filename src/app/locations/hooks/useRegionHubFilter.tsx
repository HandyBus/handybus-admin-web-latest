import { GetRegionHubsOptions } from '@/services/hub.service';
import { useReducer } from 'react';

const useRegionHubFilter = (partial: GetRegionHubsOptions = {}) => {
  return useReducer(reducer, {
    ...EMPTY_REGION_HUB_FILTER,
    ...partial,
  });
};

export default useRegionHubFilter;

const EMPTY_REGION_HUB_FILTER: GetRegionHubsOptions = {
  regionId: undefined,
  name: undefined,
  usageType: undefined,
};

export type RegionHubFilterAction =
  | {
      type: 'SET_REGION_ID';
      regionId: GetRegionHubsOptions['regionId'];
    }
  | {
      type: 'SET_NAME';
      name: GetRegionHubsOptions['name'];
    }
  | {
      type: 'SET_USAGE_TYPE';
      usageType: GetRegionHubsOptions['usageType'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetRegionHubsOptions,
  action: RegionHubFilterAction,
): GetRegionHubsOptions => {
  switch (action.type) {
    case 'SET_REGION_ID':
      return {
        ...prevState,
        regionId: action.regionId,
      };
    case 'SET_NAME':
      return {
        ...prevState,
        name: action.name,
      };
    case 'SET_USAGE_TYPE':
      return {
        ...prevState,
        usageType: action.usageType,
      };
    case 'RESET':
      return EMPTY_REGION_HUB_FILTER;
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};
