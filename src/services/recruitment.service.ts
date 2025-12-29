// ----- GET -----

import {
  AdminJobPostingsViewEntitySchema,
  CareerType,
  JobApplicationResponseModelSchema,
  JobApplicationStatus,
  JobApplicationType,
  JobCategory,
} from '@/types/recruitment.type';
import { authInstance } from './config';
import { toSearchParamString } from '@/utils/searchParam.util';
import { withPagination } from '@/types/common.type';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

export interface GetJobApplicationsOptions {
  applicationType?: JobApplicationType;
  status?: JobApplicationStatus;
  applicantEmail?: string;
  applicantPhoneNumber?: string;
  orderBy?: 'createdAt';
  additionalOrderOptions?: 'ASC' | 'DESC';
  page?: string;
  limit?: number;
}

export const getJobApplications = async (
  options?: GetJobApplicationsOptions,
) => {
  const res = await authInstance.get(
    `/v1/recruitment/admin/job-applications${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        jobApplications: JobApplicationResponseModelSchema.array(),
      }),
    },
  );
  return res;
};

export const useGetJobApplicationsWithPagination = (
  options?: GetJobApplicationsOptions,
) => {
  return useInfiniteQuery({
    queryKey: ['jobApplications', options],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getJobApplications({ ...options, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });
};

export interface GetJobPostingsOptions {
  jobCategory?: JobCategory;
  careerType?: CareerType;
  isOpen?: boolean;
  title?: string;
  orderBy?: 'createdAt';
  additionalOrderOptions?: 'ASC' | 'DESC';
  page?: string;
  limit?: number;
}

export const getJobPostings = async (options?: GetJobPostingsOptions) => {
  const res = await authInstance.get(
    `/v1/recruitment/admin/job-postings${toSearchParamString({ ...options }, '?')}`,
    {
      shape: withPagination({
        jobPostings: AdminJobPostingsViewEntitySchema.array(),
      }),
    },
  );
  return res;
};

export const useGetJobPostingsWithPagination = (
  options?: GetJobPostingsOptions,
) => {
  return useInfiniteQuery({
    queryKey: ['jobPostings', options],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getJobPostings({ ...options, page: pageParam }),
    initialPageParam: undefined,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    placeholderData: keepPreviousData,
  });
};
