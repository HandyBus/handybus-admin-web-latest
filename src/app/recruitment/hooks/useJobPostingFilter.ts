import { GetJobPostingsOptions } from '@/services/recruitment.service';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const empty: GetJobPostingsOptions = {
  jobCategory: undefined,
  careerType: undefined,
  isOpen: undefined,
  title: undefined,
  orderBy: undefined,
  additionalOrderOptions: undefined,
  page: undefined,
  limit: undefined,
};

export type JobPostingFilterAction =
  | {
      type: 'SET_JOB_CATEGORY';
      jobCategory: GetJobPostingsOptions['jobCategory'];
    }
  | {
      type: 'SET_CAREER_TYPE';
      careerType: GetJobPostingsOptions['careerType'];
    }
  | {
      type: 'SET_IS_OPEN';
      isOpen: GetJobPostingsOptions['isOpen'];
    }
  | {
      type: 'SET_TITLE';
      title: GetJobPostingsOptions['title'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetJobPostingsOptions,
  action: JobPostingFilterAction,
): GetJobPostingsOptions => {
  switch (action.type) {
    case 'SET_JOB_CATEGORY':
      return {
        ...prevState,
        jobCategory: action.jobCategory,
      };
    case 'SET_CAREER_TYPE':
      return {
        ...prevState,
        careerType: action.careerType,
      };
    case 'SET_IS_OPEN':
      return {
        ...prevState,
        isOpen: action.isOpen,
      };
    case 'SET_TITLE':
      return {
        ...prevState,
        title: action.title,
      };
    case 'RESET':
      return {
        ...empty,
      };
    default:
      console.error('Unknown action type', action);
      return prevState;
  }
};

const useJobPostingFilter = (partial: Partial<GetJobPostingsOptions> = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): GetJobPostingsOptions => {
    const urlState: GetJobPostingsOptions = {
      ...empty,
    };

    if (searchParams.has('jobCategory')) {
      urlState.jobCategory =
        (searchParams.get(
          'jobCategory',
        ) as GetJobPostingsOptions['jobCategory']) || undefined;
    }

    if (searchParams.has('careerType')) {
      urlState.careerType =
        (searchParams.get(
          'careerType',
        ) as GetJobPostingsOptions['careerType']) || undefined;
    }

    if (searchParams.has('isOpen')) {
      const isOpenValue = searchParams.get('isOpen');
      urlState.isOpen =
        isOpenValue === 'true'
          ? true
          : isOpenValue === 'false'
            ? false
            : undefined;
    }

    if (searchParams.has('title')) {
      urlState.title = searchParams.get('title') || undefined;
    }

    return {
      ...empty,
      ...partial,
      ...urlState,
    };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: GetJobPostingsOptions) => {
      const params = new URLSearchParams();

      if (newState.jobCategory) {
        params.set('jobCategory', newState.jobCategory);
      }

      if (newState.careerType) {
        params.set('careerType', newState.careerType);
      }

      if (newState.isOpen !== undefined) {
        params.set('isOpen', String(newState.isOpen));
      }

      if (newState.title) {
        params.set('title', newState.title);
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

export default useJobPostingFilter;
