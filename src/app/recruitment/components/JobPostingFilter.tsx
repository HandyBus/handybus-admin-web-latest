'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import { Dispatch, useMemo } from 'react';
import { customTwMerge } from 'tailwind.config';
import { JobPostingFilterAction } from '../hooks/useJobPostingFilter';
import Toggle from '@/components/button/Toggle';
import Stringifier from '@/utils/stringifier.util';
import { GetJobPostingsOptions } from '@/services/recruitment.service';
import DebouncedInput from '@/components/input/DebouncedInput';
import { JobCategoryEnum, CareerTypeEnum } from '@/types/recruitment.type';

interface Props {
  option: GetJobPostingsOptions;
  dispatch: Dispatch<JobPostingFilterAction>;
}

const JobPostingFilter = ({ option, dispatch }: Props) => {
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
        <label>제목</label>
        <DebouncedInput
          value={option.title ?? ''}
          setValue={(n) =>
            dispatch({ type: 'SET_TITLE', title: n || undefined })
          }
        />
        <label>직무</label>
        <div className="flex flex-row gap-4">
          {JobCategoryEnum.options.map((jobCategory) => (
            <Toggle
              key={jobCategory}
              label={Stringifier.jobCategory(jobCategory)}
              value={option.jobCategory === jobCategory}
              setValue={() =>
                dispatch({
                  type: 'SET_JOB_CATEGORY',
                  jobCategory:
                    jobCategory === option.jobCategory
                      ? undefined
                      : jobCategory,
                })
              }
            />
          ))}
        </div>
        <label>경력 유형</label>
        <div className="flex flex-row gap-4">
          {CareerTypeEnum.options.map((careerType) => (
            <Toggle
              key={careerType}
              label={Stringifier.careerType(careerType)}
              value={option.careerType === careerType}
              setValue={() =>
                dispatch({
                  type: 'SET_CAREER_TYPE',
                  careerType:
                    careerType === option.careerType ? undefined : careerType,
                })
              }
            />
          ))}
        </div>
        <label>모집 상태</label>
        <div className="flex flex-row gap-4">
          <Toggle
            label="모집 중"
            value={option.isOpen === true}
            setValue={() =>
              dispatch({
                type: 'SET_IS_OPEN',
                isOpen: option.isOpen === true ? undefined : true,
              })
            }
          />
          <Toggle
            label="모집 마감"
            value={option.isOpen === false}
            setValue={() =>
              dispatch({
                type: 'SET_IS_OPEN',
                isOpen: option.isOpen === false ? undefined : false,
              })
            }
          />
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default JobPostingFilter;
