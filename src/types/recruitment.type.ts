import { z } from 'zod';

// ----- ENUM -----

export const JobCategoryEnum = z.enum([
  'FRONTEND',
  'BACKEND',
  'MOBILE',
  'DATA',
  'DESIGN',
  'PRODUCT',
  'MARKETING',
  'SALES',
  'HR',
  'ETC',
]);
export type JobCategory = z.infer<typeof JobCategoryEnum>;

export const CareerTypeEnum = z.enum(['CAREER', 'NEW', 'BOTH']);
export type CareerType = z.infer<typeof CareerTypeEnum>;

export const JobApplicationTypeEnum = z.enum(['JOB', 'TALENT_POOL']);
export type JobApplicationType = z.infer<typeof JobApplicationTypeEnum>;

export const JobApplicationStatusEnum = z.enum([
  'SUBMITTED',
  'REVIEWING',
  'PASSED',
  'REJECTED',
]);
export type JobApplicationStatus = z.infer<typeof JobApplicationStatusEnum>;

// ----- GET -----

export const AdminJobPostingsViewEntitySchema = z.object({
  jobPostingId: z.string(),
  title: z.string(),
  jobCategory: JobCategoryEnum,
  careerType: CareerTypeEnum,
  minCareerYears: z.number().nullable(),
  maxCareerYears: z.number().nullable(),
  description: z.string(),
  closeAt: z.string().nullable(),
  isOpen: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  jobApplicationCount: z.number(),
});
export type AdminJobPostingsViewEntity = z.infer<
  typeof AdminJobPostingsViewEntitySchema
>;

export const JobApplicationResponseModelSchema = z.object({
  id: z.string(),
  jobPostingId: z.string(),
  applicantName: z.string(),
  applicantPhoneNumber: z.string(),
  applicantEmail: z.string(),
  applicantCareerYears: z.number().nullable(),
  applicationType: JobApplicationTypeEnum,
  customJobTitle: z.string().nullable(),
  resumeFile: z.string(),
  portfolioFile: z.string().nullable(),
  personalInfoConsent: z.boolean(),
  agreedAt: z.string().nullable(),
  status: JobApplicationStatusEnum,
  wantsCoffeeChat: z.boolean().nullable(),
  messageToTeam: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type JobApplicationResponseModel = z.infer<
  typeof JobApplicationResponseModelSchema
>;

// ----- POST -----
export const AdminCreateJobPostingRequestSchema = z.object({
  title: z.string(),
  jobCategory: JobCategoryEnum,
  careerType: CareerTypeEnum,
  minCareerYears: z.number(),
  maxCareerYears: z.number().optional(),
  description: z.string(),
  closeAt: z.string(),
});
export type AdminCreateJobPostingRequest = z.infer<
  typeof AdminCreateJobPostingRequestSchema
>;

export const AdminUpdateJobPostingRequestSchema = z.object({
  title: z.string().optional(),
  jobCategory: JobCategoryEnum.optional(),
  careerType: CareerTypeEnum.optional(),
  minCareerYears: z.number().optional(),
  maxCareerYears: z.number().optional(),
  description: z.string().optional(),
  closeAt: z.string().optional(),
});
export type AdminUpdateJobPostingRequest = z.infer<
  typeof AdminUpdateJobPostingRequestSchema
>;
