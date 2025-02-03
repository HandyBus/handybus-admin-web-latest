import { GetUsersOptions } from '@/services/userManagement.service';
import { useReducer } from 'react';

const useUserFilter = (partial: GetUsersOptions = {}) => {
  return useReducer(reducer, {
    ...EMPTY_USER_FILTER,
    ...partial,
  });
};

export default useUserFilter;

const EMPTY_USER_FILTER: GetUsersOptions = {
  nickname: undefined,
  phoneNumber: undefined,
  gender: undefined,
  ageRange: undefined,
  regionId: undefined,
  authChannelType: undefined,
  orderBy: undefined,
  additionalOrderOptions: 'ASC',
  status: 'ACTIVE',
};

export type UserFilterAction =
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
      type: 'SET_AUTH_CHANNEL_TYPE';
      authChannelType: GetUsersOptions['authChannelType'];
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
      type: 'RESET';
    };

const reducer = (
  prevState: GetUsersOptions,
  action: UserFilterAction,
): GetUsersOptions => {
  switch (action.type) {
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
    case 'SET_AUTH_CHANNEL_TYPE':
      return {
        ...prevState,
        authChannelType: action.authChannelType,
      };
    case 'SET_ORDER_BY':
      const prevAdditionalOrderOptions = prevState.additionalOrderOptions;
      return {
        ...prevState,
        orderBy: action.orderBy,
        additionalOrderOptions: prevAdditionalOrderOptions
          ? prevAdditionalOrderOptions
          : 'ASC',
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
    case 'RESET':
      return {
        ...EMPTY_USER_FILTER,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};
