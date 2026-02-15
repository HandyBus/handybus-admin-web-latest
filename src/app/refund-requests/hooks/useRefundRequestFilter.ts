import { GetRefundRequestsOptions } from '@/services/refund-request.service';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const empty: GetRefundRequestsOptions = {
  paymentId: undefined,
  status: 'REQUESTED',
  type: undefined,
  isActive: true,
  orderBy: 'createdAt',
  additionalOrderOptions: 'DESC',
};

export type RefundRequestFilterAction =
  | {
      type: 'SET_PAYMENT_ID';
      paymentId: GetRefundRequestsOptions['paymentId'];
    }
  | {
      type: 'SET_STATUS';
      status: GetRefundRequestsOptions['status'];
    }
  | {
      type: 'SET_TYPE';
      refundRequestType: GetRefundRequestsOptions['type'];
    }
  | {
      type: 'SET_IS_ACTIVE';
      isActive: GetRefundRequestsOptions['isActive'];
    }
  | {
      type: 'SET_ORDER_BY';
      orderBy: GetRefundRequestsOptions['orderBy'];
    }
  | {
      type: 'SET_ADDITIONAL_ORDER_OPTIONS';
      additionalOrderOptions: GetRefundRequestsOptions['additionalOrderOptions'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetRefundRequestsOptions,
  action: RefundRequestFilterAction,
): GetRefundRequestsOptions => {
  switch (action.type) {
    case 'SET_PAYMENT_ID':
      return { ...prevState, paymentId: action.paymentId };
    case 'SET_STATUS':
      return { ...prevState, status: action.status };
    case 'SET_TYPE':
      return { ...prevState, type: action.refundRequestType };
    case 'SET_IS_ACTIVE':
      return { ...prevState, isActive: action.isActive };
    case 'SET_ORDER_BY':
      return { ...prevState, orderBy: action.orderBy };
    case 'SET_ADDITIONAL_ORDER_OPTIONS':
      return {
        ...prevState,
        additionalOrderOptions: action.additionalOrderOptions,
      };
    case 'RESET':
      return { ...empty };
    default:
      return prevState;
  }
};

const useRefundRequestFilter = (
  partial: Partial<GetRefundRequestsOptions> = {},
) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): GetRefundRequestsOptions => {
    const urlState: GetRefundRequestsOptions = { ...empty };

    if (searchParams.has('paymentId')) {
      urlState.paymentId = searchParams.get('paymentId') || undefined;
    }
    if (searchParams.has('status')) {
      urlState.status =
        (searchParams.get('status') as GetRefundRequestsOptions['status']) ||
        undefined;
    }
    if (searchParams.has('type')) {
      urlState.type =
        (searchParams.get('type') as GetRefundRequestsOptions['type']) ||
        undefined;
    }
    if (searchParams.has('isActive')) {
      const v = searchParams.get('isActive');
      urlState.isActive =
        v === 'true' ? true : v === 'false' ? false : undefined;
    }
    if (searchParams.has('orderBy')) {
      urlState.orderBy =
        (searchParams.get('orderBy') as GetRefundRequestsOptions['orderBy']) ||
        empty.orderBy;
    }
    if (searchParams.has('additionalOrderOptions')) {
      urlState.additionalOrderOptions =
        (searchParams.get(
          'additionalOrderOptions',
        ) as GetRefundRequestsOptions['additionalOrderOptions']) ||
        empty.additionalOrderOptions;
    }

    return { ...empty, ...partial, ...urlState };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: GetRefundRequestsOptions) => {
      const params = new URLSearchParams();
      if (newState.paymentId) params.set('paymentId', newState.paymentId);
      if (newState.status) params.set('status', newState.status);
      if (newState.type) params.set('type', newState.type);
      if (newState.isActive !== undefined) {
        params.set('isActive', String(newState.isActive));
      }
      if (newState.orderBy && newState.orderBy !== empty.orderBy) {
        params.set('orderBy', newState.orderBy);
      }
      if (
        newState.additionalOrderOptions &&
        newState.additionalOrderOptions !== empty.additionalOrderOptions
      ) {
        params.set('additionalOrderOptions', newState.additionalOrderOptions);
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

export default useRefundRequestFilter;
