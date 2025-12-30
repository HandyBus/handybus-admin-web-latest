'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import { Dispatch, useMemo } from 'react';
import { customTwMerge } from 'tailwind.config';
import { JobApplicationFilterAction } from '../hooks/useJobApplicationFilter';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import { GetJobApplicationsOptions } from '@/services/recruitment.service';
import DebouncedInput from '@/components/input/DebouncedInput';
import {
  JobApplicationTypeEnum,
  JobApplicationStatusEnum,
} from '@/types/recruitment.type';

interface Props {
  option: GetJobApplicationsOptions;
  dispatch: Dispatch<JobApplicationFilterAction>;
}

const JobApplicationFilter = ({ option, dispatch }: Props) => {
  const filterCount = useMemo(() => {
    return Object.values(option).filter((v) => v !== undefined).length;
  }, [option]);

  return (
    <Disclosure>
      <DisclosureButton
        className={customTwMerge(
          'gap-2 group flex w-fit items-center justify-start gap-4 rounded-8 p-4 text-14 font-500 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100',
          filterCount === 0 ? '' : 'text-brand-primary-400',
        )}
      >
        <FilterIcon size={16} />
        {filterCount === 0 ? '필터' : `필터 (${filterCount}개 적용됨)`}
        <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
      </DisclosureButton>
      {filterCount > 0 && (
        <button
          className="gap-2 group flex w-fit flex-row items-center justify-start gap-4 rounded-8 p-4 text-14 font-500 text-basic-grey-600 transition-all hover:bg-basic-grey-50 active:scale-90 active:bg-basic-grey-100"
          onClick={() => {
            dispatch({ type: 'RESET' });
          }}
        >
          <FilterXIcon size={14} />
          <span>필터 초기화</span>
        </button>
      )}
      <DisclosurePanel className="flex flex-col gap-4 rounded-8 border border-brand-primary-200 bg-brand-primary-50/50 p-16">
        <label>지원자 이메일</label>
        <DebouncedInput
          value={option.applicantEmail ?? ''}
          setValue={(n) =>
            dispatch({
              type: 'SET_APPLICANT_EMAIL',
              applicantEmail: n || undefined,
            })
          }
        />
        <label>지원자 전화번호</label>
        <DebouncedInput
          value={option.applicantPhoneNumber ?? ''}
          setValue={(n) =>
            dispatch({
              type: 'SET_APPLICANT_PHONE_NUMBER',
              applicantPhoneNumber: n || undefined,
            })
          }
        />
        <label>지원 유형</label>
        <div className="flex flex-row gap-4">
          {JobApplicationTypeEnum.options.map((applicationType) => (
            <Toggle
              key={applicationType}
              label={Stringifier.jobApplicationType(applicationType)}
              value={option.applicationType === applicationType}
              setValue={() =>
                dispatch({
                  type: 'SET_APPLICATION_TYPE',
                  applicationType:
                    applicationType === option.applicationType
                      ? undefined
                      : applicationType,
                })
              }
            />
          ))}
        </div>
        <label>상태</label>
        <div className="flex flex-row gap-4">
          {JobApplicationStatusEnum.options.map((status) => (
            <Toggle
              key={status}
              label={Stringifier.jobApplicationStatus(status)}
              value={option.status === status}
              setValue={() =>
                dispatch({
                  type: 'SET_STATUS',
                  status: status === option.status ? undefined : status,
                })
              }
            />
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default JobApplicationFilter;
