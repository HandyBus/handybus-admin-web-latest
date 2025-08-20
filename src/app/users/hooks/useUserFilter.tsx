import { GetUsersOptions } from '@/services/user.service';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const useUserFilter = (partial: GetUsersOptions = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): GetUsersOptions => {
    const urlState: GetUsersOptions = {};

    if (searchParams.has('name')) {
      urlState.name = searchParams.get('name') || undefined;
    }

    if (searchParams.has('nickname')) {
      urlState.nickname = searchParams.get('nickname') || undefined;
    }

    if (searchParams.has('phoneNumber')) {
      urlState.phoneNumber = searchParams.get('phoneNumber') || undefined;
    }

    if (searchParams.has('gender')) {
      urlState.gender =
        (searchParams.get('gender') as GetUsersOptions['gender']) || undefined;
    }

    if (searchParams.has('ageRange')) {
      urlState.ageRange =
        (searchParams.get('ageRange') as GetUsersOptions['ageRange']) ||
        undefined;
    }

    if (searchParams.has('regionId')) {
      urlState.regionId = searchParams.get('regionId') || undefined;
    }

    if (searchParams.has('orderBy')) {
      urlState.orderBy =
        (searchParams.get('orderBy') as GetUsersOptions['orderBy']) ||
        undefined;
    }

    if (searchParams.has('additionalOrderOptions')) {
      urlState.additionalOrderOptions =
        (searchParams.get(
          'additionalOrderOptions',
        ) as GetUsersOptions['additionalOrderOptions']) || undefined;
    }

    if (searchParams.has('status')) {
      urlState.status =
        (searchParams.get('status') as GetUsersOptions['status']) || undefined;
    }

    if (searchParams.has('lastLoginFrom')) {
      urlState.lastLoginFrom = searchParams.get('lastLoginFrom') || undefined;
    }

    if (searchParams.has('lastLoginTo')) {
      urlState.lastLoginTo = searchParams.get('lastLoginTo') || undefined;
    }

    if (searchParams.has('onboardingComplete')) {
      const value = searchParams.get('onboardingComplete');
      urlState.onboardingComplete =
        value === 'true' ? true : value === 'false' ? false : undefined;
    }

    if (searchParams.has('marketingConsent')) {
      const value = searchParams.get('marketingConsent');
      urlState.marketingConsent =
        value === 'true' ? true : value === 'false' ? false : undefined;
    }

    if (searchParams.has('isConnectedKakao')) {
      const value = searchParams.get('isConnectedKakao');
      urlState.isConnectedKakao =
        value === 'true' ? true : value === 'false' ? false : undefined;
    }

    if (searchParams.has('isConnectedNaver')) {
      const value = searchParams.get('isConnectedNaver');
      urlState.isConnectedNaver =
        value === 'true' ? true : value === 'false' ? false : undefined;
    }

    if (searchParams.has('isConnectedApple')) {
      const value = searchParams.get('isConnectedApple');
      urlState.isConnectedApple =
        value === 'true' ? true : value === 'false' ? false : undefined;
    }

    return {
      ...EMPTY_USER_FILTER,
      ...partial,
      ...urlState,
    };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: GetUsersOptions) => {
      const params = new URLSearchParams();

      if (newState.name) {
        params.set('name', newState.name);
      }

      if (newState.nickname) {
        params.set('nickname', newState.nickname);
      }

      if (newState.phoneNumber) {
        params.set('phoneNumber', newState.phoneNumber);
      }

      if (newState.gender) {
        params.set('gender', newState.gender);
      }

      if (newState.ageRange) {
        params.set('ageRange', newState.ageRange);
      }

      if (newState.regionId) {
        params.set('regionId', newState.regionId);
      }

      if (newState.orderBy) {
        params.set('orderBy', newState.orderBy);
      }

      if (newState.additionalOrderOptions) {
        params.set('additionalOrderOptions', newState.additionalOrderOptions);
      }

      if (newState.status) {
        params.set('status', newState.status);
      }

      if (newState.lastLoginFrom) {
        params.set('lastLoginFrom', newState.lastLoginFrom);
      }

      if (newState.lastLoginTo) {
        params.set('lastLoginTo', newState.lastLoginTo);
      }

      if (newState.onboardingComplete !== undefined) {
        params.set('onboardingComplete', String(newState.onboardingComplete));
      }

      if (newState.marketingConsent !== undefined) {
        params.set('marketingConsent', String(newState.marketingConsent));
      }

      if (newState.isConnectedKakao !== undefined) {
        params.set('isConnectedKakao', String(newState.isConnectedKakao));
      }

      if (newState.isConnectedNaver !== undefined) {
        params.set('isConnectedNaver', String(newState.isConnectedNaver));
      }

      if (newState.isConnectedApple !== undefined) {
        params.set('isConnectedApple', String(newState.isConnectedApple));
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

export default useUserFilter;

const EMPTY_USER_FILTER: GetUsersOptions = {
  name: undefined,
  nickname: undefined,
  phoneNumber: undefined,
  gender: undefined,
  ageRange: undefined,
  regionId: undefined,
  orderBy: undefined,
  additionalOrderOptions: undefined,
  status: undefined,
  lastLoginFrom: undefined,
  lastLoginTo: undefined,
  onboardingComplete: undefined,
  marketingConsent: undefined,
  isConnectedKakao: undefined,
  isConnectedNaver: undefined,
  isConnectedApple: undefined,
};

export type UserFilterAction =
  | {
      type: 'SET_NAME';
      name: GetUsersOptions['name'];
    }
  | {
      type: 'SET_NICKNAME';
      nickname: GetUsersOptions['nickname'];
    }
  | {
      type: 'SET_PHONE_NUMBER';
      phoneNumber: GetUsersOptions['phoneNumber'];
    }
  | {
      type: 'SET_GENDER';
      gender: GetUsersOptions['gender'];
    }
  | {
      type: 'SET_AGE_RANGE';
      ageRange: GetUsersOptions['ageRange'];
    }
  | {
      type: 'SET_REGION_ID';
      regionId: GetUsersOptions['regionId'];
    }
  | {
      type: 'SET_ORDER_BY';
      orderBy: GetUsersOptions['orderBy'];
    }
  | {
      type: 'SET_ADDITIONAL_ORDER_OPTIONS';
      additionalOrderOptions: GetUsersOptions['additionalOrderOptions'];
    }
  | {
      type: 'SET_STATUS';
      status: GetUsersOptions['status'];
    }
  | {
      type: 'SET_LAST_LOGIN_FROM';
      lastLoginFrom: GetUsersOptions['lastLoginFrom'];
    }
  | {
      type: 'SET_LAST_LOGIN_TO';
      lastLoginTo: GetUsersOptions['lastLoginTo'];
    }
  | {
      type: 'SET_ONBOARDING_COMPLETE';
      onboardingComplete: GetUsersOptions['onboardingComplete'];
    }
  | {
      type: 'SET_MARKETING_CONSENT';
      marketingConsent: GetUsersOptions['marketingConsent'];
    }
  | {
      type: 'SET_IS_CONNECTED_KAKAO';
      isConnectedKakao: GetUsersOptions['isConnectedKakao'];
    }
  | {
      type: 'SET_IS_CONNECTED_NAVER';
      isConnectedNaver: GetUsersOptions['isConnectedNaver'];
    }
  | {
      type: 'SET_IS_CONNECTED_APPLE';
      isConnectedApple: GetUsersOptions['isConnectedApple'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetUsersOptions,
  action: UserFilterAction,
): GetUsersOptions => {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...prevState,
        name: action.name,
      };
    case 'SET_NICKNAME':
      return {
        ...prevState,
        nickname: action.nickname,
      };
    case 'SET_PHONE_NUMBER':
      return {
        ...prevState,
        phoneNumber: action.phoneNumber,
      };
    case 'SET_GENDER':
      return {
        ...prevState,
        gender: action.gender,
      };
    case 'SET_AGE_RANGE':
      return {
        ...prevState,
        ageRange: action.ageRange,
      };
    case 'SET_REGION_ID':
      return {
        ...prevState,
        regionId: action.regionId,
      };
    case 'SET_ORDER_BY':
      const prevAdditionalOrderOptions = prevState.additionalOrderOptions;
      return {
        ...prevState,
        orderBy: action.orderBy,
        additionalOrderOptions: prevAdditionalOrderOptions || 'ASC',
      };
    case 'SET_ADDITIONAL_ORDER_OPTIONS':
      return {
        ...prevState,
        additionalOrderOptions: action.additionalOrderOptions,
      };
    case 'SET_STATUS':
      return {
        ...prevState,
        status: action.status,
      };
    case 'SET_LAST_LOGIN_FROM':
      return {
        ...prevState,
        lastLoginFrom: action.lastLoginFrom,
      };
    case 'SET_LAST_LOGIN_TO':
      return {
        ...prevState,
        lastLoginTo: action.lastLoginTo,
      };
    case 'SET_ONBOARDING_COMPLETE':
      return {
        ...prevState,
        onboardingComplete: action.onboardingComplete,
      };
    case 'SET_MARKETING_CONSENT':
      return {
        ...prevState,
        marketingConsent: action.marketingConsent,
      };
    case 'SET_IS_CONNECTED_KAKAO':
      return {
        ...prevState,
        isConnectedKakao: action.isConnectedKakao,
      };
    case 'SET_IS_CONNECTED_NAVER':
      return {
        ...prevState,
        isConnectedNaver: action.isConnectedNaver,
      };
    case 'SET_IS_CONNECTED_APPLE':
      return {
        ...prevState,
        isConnectedApple: action.isConnectedApple,
      };
    case 'RESET':
      return {
        ...EMPTY_USER_FILTER,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};
