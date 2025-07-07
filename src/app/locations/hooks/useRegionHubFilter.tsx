import { GetRegionHubsOptions } from '@/services/hub.service';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HubUsageType } from '@/types/hub.type';

const useRegionHubFilter = (partial: GetRegionHubsOptions = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): GetRegionHubsOptions => {
    const urlState: GetRegionHubsOptions = {};

    if (searchParams.has('regionId')) {
      urlState.regionId = searchParams.get('regionId') || undefined;
    }

    if (searchParams.has('name')) {
      urlState.name = searchParams.get('name') || undefined;
    }

    if (searchParams.has('usageType')) {
      const usageTypeString = searchParams.get('usageType');
      urlState.usageType = usageTypeString
        ? (usageTypeString.split(',') as HubUsageType[])
        : undefined;
    }

    return {
      ...EMPTY_REGION_HUB_FILTER,
      ...partial,
      ...urlState,
    };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: GetRegionHubsOptions) => {
      const params = new URLSearchParams();

      if (newState.regionId) {
        params.set('regionId', newState.regionId);
      }

      if (newState.name) {
        params.set('name', newState.name);
      }

      if (newState.usageType && newState.usageType.length > 0) {
        params.set('usageType', newState.usageType.join(','));
      }

      const paramString = params.toString();
      const newURL = paramString ? `?${paramString}` : window.location.pathname;
      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    updateURL(state);
  }, [state, updateURL]);

  return [state, dispatch] as const;
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
