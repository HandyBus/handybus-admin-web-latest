import { z } from 'zod';
import { ArtistsViewEntitySchema } from './artist.type';
import { ActiveStatusEnum } from './common.type';

// ----- ENUM -----

export const AgeRangeEnum = z.enum([
  '연령대 미지정',
  '10대 이하',
  '20대',
  '30대',
  '40대',
  '50대',
  '60대',
  '70대',
  '80대 이상',
]);
export type AgeRange = z.infer<typeof AgeRangeEnum>;

export const GenderEnum = z.enum(['NONE', 'MALE', 'FEMALE']);
export type Gender = z.infer<typeof GenderEnum>;

// ----- GET -----

export const UserStatsReadModel = z
  .object({
    userId: z.string(),
    currentReservationCount: z.number(),
    pastReservationCount: z.number(),
    activeCouponCount: z.number(),
    reviewCount: z.number(),
    shuttleDemandCount: z.number(),
  })
  .strict();
export type UserStatsReadModel = z.infer<typeof UserStatsReadModel>;

export const UsersViewEntitySchema = z
  .object({
    userId: z.string(),
    nickname: z.string().nullable(),
    profileImage: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    gender: GenderEnum,
    ageRange: AgeRangeEnum,
    regionId: z.string().nullable(),
    lastLoginAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    favoriteArtists: ArtistsViewEntitySchema.array().nullable(),
    status: ActiveStatusEnum,
    isConnectedKakao: z.boolean(),
    isConnectedNaver: z.boolean(),
    onboardingComplete: z.boolean(),
    serviceTermsAgreement: z.boolean(),
    personalInfoConsent: z.boolean(),
    marketingConsent: z.boolean(),
    entryGreetingChecked: z.boolean(),
  })
  .strict();
export type UsersViewEntity = z.infer<typeof UsersViewEntitySchema>;
