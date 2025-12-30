import { GetJobApplicationsOptions } from '@/services/recruitment.service';
import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const empty: GetJobApplicationsOptions = {
  applicationType: undefined,
  status: undefined,
  applicantEmail: undefined,
  applicantPhoneNumber: undefined,
  orderBy: undefined,
  additionalOrderOptions: undefined,
  page: undefined,
  limit: undefined,
};

export type JobApplicationFilterAction =
  | {
      type: 'SET_APPLICATION_TYPE';
      applicationType: GetJobApplicationsOptions['applicationType'];
    }
  | {
      type: 'SET_STATUS';
      status: GetJobApplicationsOptions['status'];
    }
  | {
      type: 'SET_APPLICANT_EMAIL';
      applicantEmail: GetJobApplicationsOptions['applicantEmail'];
    }
  | {
      type: 'SET_APPLICANT_PHONE_NUMBER';
      applicantPhoneNumber: GetJobApplicationsOptions['applicantPhoneNumber'];
    }
  | {
      type: 'RESET';
    };

const reducer = (
  prevState: GetJobApplicationsOptions,
  action: JobApplicationFilterAction,
): GetJobApplicationsOptions => {
  switch (action.type) {
    case 'SET_APPLICATION_TYPE':
      return {
        ...prevState,
        applicationType: action.applicationType,
      };
    case 'SET_STATUS':
      return {
        ...prevState,
        status: action.status,
      };
    case 'SET_APPLICANT_EMAIL':
      return {
        ...prevState,
        applicantEmail: action.applicantEmail,
      };
    case 'SET_APPLICANT_PHONE_NUMBER':
      return {
        ...prevState,
        applicantPhoneNumber: action.applicantPhoneNumber,
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

const useJobApplicationFilter = (
  partial: Partial<GetJobApplicationsOptions> = {},
) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getInitialStateFromURL = useCallback((): GetJobApplicationsOptions => {
    const urlState: GetJobApplicationsOptions = {
      ...empty,
    };

    if (searchParams.has('applicationType')) {
      urlState.applicationType =
        (searchParams.get(
          'applicationType',
        ) as GetJobApplicationsOptions['applicationType']) || undefined;
    }

    if (searchParams.has('status')) {
      urlState.status =
        (searchParams.get('status') as GetJobApplicationsOptions['status']) ||
        undefined;
    }

    if (searchParams.has('applicantEmail')) {
      urlState.applicantEmail = searchParams.get('applicantEmail') || undefined;
    }

    if (searchParams.has('applicantPhoneNumber')) {
      urlState.applicantPhoneNumber =
        searchParams.get('applicantPhoneNumber') || undefined;
    }

    return {
      ...empty,
      ...partial,
      ...urlState,
    };
  }, [searchParams, partial]);

  const [state, dispatch] = useReducer(reducer, getInitialStateFromURL());

  const updateURL = useCallback(
    (newState: GetJobApplicationsOptions) => {
      const params = new URLSearchParams();

      if (newState.applicationType) {
        params.set('applicationType', newState.applicationType);
      }

      if (newState.status) {
        params.set('status', newState.status);
      }

      if (newState.applicantEmail) {
        params.set('applicantEmail', newState.applicantEmail);
      }

      if (newState.applicantPhoneNumber) {
        params.set('applicantPhoneNumber', newState.applicantPhoneNumber);
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

export default useJobApplicationFilter;
