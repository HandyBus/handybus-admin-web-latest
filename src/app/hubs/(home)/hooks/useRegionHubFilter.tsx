import { GetRegionHubsOptions } from '@/services/location.service';
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
    case 'RESET':
      return {
        ...EMPTY_REGION_HUB_FILTER,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};
