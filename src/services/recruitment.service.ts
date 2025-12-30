import {
  AdminCreateJobPostingRequest,
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
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';

// ----- GET -----

export interface GetJobApplicationsOptions {
  jobPostingId?: string;
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

// ----- POST -----

export const putJobApplication = async (
  jobApplicationId: string,
  body: {
    status: JobApplicationStatus;
  },
) => {
  const res = await authInstance.put(
    `/v1/recruitment/admin/job-applications/${jobApplicationId}`,
    body,
    {
      shape: {
        jobApplicationId: z.string(),
      },
    },
  );
  return res;
};

export const usePutJobApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobApplicationId,
      body,
    }: {
      jobApplicationId: string;
      body: {
        status: JobApplicationStatus;
      };
    }) => putJobApplication(jobApplicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
    },
  });
};

export const postJobPosting = async (body: AdminCreateJobPostingRequest) => {
  const res = await authInstance.post(
    '/v1/recruitment/admin/job-postings',
    body,
    {
      shape: {
        jobPostingId: z.string(),
      },
    },
  );
  return res;
};

export const usePostJobPosting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminCreateJobPostingRequest) => postJobPosting(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
};
