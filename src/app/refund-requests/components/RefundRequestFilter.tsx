'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import { Dispatch, useMemo } from 'react';
import { customTwMerge } from 'tailwind.config';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import DebouncedInput from '@/components/input/DebouncedInput';
import { GetRefundRequestsOptions } from '@/services/refund-request.service';
import { RefundRequestFilterAction } from '../hooks/useRefundRequestFilter';
import {
  RefundStatusEnum,
  RefundRequestTypeEnum,
} from '@/types/refund-request.type';
import type {
  RefundStatus,
  RefundRequestType,
} from '@/types/refund-request.type';

const REFUND_STATUS_OPTIONS: RefundStatus[] = Object.values(
  RefundStatusEnum.enum,
);
const REFUND_REQUEST_TYPE_OPTIONS: RefundRequestType[] = Object.values(
  RefundRequestTypeEnum.enum,
);

interface RefundRequestFilterProps {
  option: GetRefundRequestsOptions;
  dispatch: Dispatch<RefundRequestFilterAction>;
}

const RefundRequestFilter = ({
  option,
  dispatch,
}: RefundRequestFilterProps) => {
  const filterCount = useMemo(() => {
    return Object.entries(option).filter(
      ([k, v]) =>
        v !== undefined && k !== 'orderBy' && k !== 'additionalOrderOptions',
    ).length;
  }, [option]);

  return (
    <Disclosure>
      <DisclosureButton
        className={customTwMerge(
          'group flex w-fit items-center justify-start gap-4 rounded-8 p-4 text-14 font-500 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100',
          filterCount === 0 ? '' : 'text-brand-primary-400',
        )}
      >
        <FilterIcon size={16} />
        {filterCount === 0 ? '필터' : `필터 (${filterCount}개 적용됨)`}
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      {filterCount > 0 && (
        <button
          className="group flex w-fit flex-row items-center justify-start gap-4 rounded-8 p-4 text-14 font-500 text-basic-grey-600 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          <FilterXIcon size={14} />
          <span>필터 초기화</span>
        </button>
      )}
      <DisclosurePanel className="flex flex-col gap-4 rounded-8 border border-brand-primary-200 bg-brand-primary-50/50 p-16">
        <label>결제 ID</label>
        <DebouncedInput
          value={option.paymentId ?? ''}
          setValue={(value) =>
            dispatch({
              type: 'SET_PAYMENT_ID',
              paymentId: value || undefined,
            })
          }
        />
        <label>환불 상태</label>
        <div className="flex flex-row flex-wrap gap-4">
          {REFUND_STATUS_OPTIONS.map((status) => (
            <Toggle
              key={status}
              label={Stringifier.refundStatus(status)}
              value={option.status === status}
              setValue={() =>
                dispatch({
                  type: 'SET_STATUS',
                  status: option.status === status ? undefined : status,
                })
              }
            />
          ))}
        </div>
        <label>환불 유형</label>
        <div className="flex flex-row flex-wrap gap-4">
          {REFUND_REQUEST_TYPE_OPTIONS.map((refundType) => (
            <Toggle
              key={refundType}
              label={Stringifier.refundRequestType(refundType)}
              value={option.type === refundType}
              setValue={() =>
                dispatch({
                  type: 'SET_TYPE',
                  refundRequestType:
                    option.type === refundType ? undefined : refundType,
                })
              }
            />
          ))}
        </div>
        <label>활성 여부</label>
        <div className="flex flex-row gap-4">
          <Toggle
            label="활성"
            value={option.isActive === true}
            setValue={() =>
              dispatch({
                type: 'SET_IS_ACTIVE',
                isActive: option.isActive === true ? undefined : true,
              })
            }
          />
          <Toggle
            label="비활성"
            value={option.isActive === false}
            setValue={() =>
              dispatch({
                type: 'SET_IS_ACTIVE',
                isActive: option.isActive === false ? undefined : false,
              })
            }
          />
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default RefundRequestFilter;
