import { z } from 'zod';
import { ArtistsViewEntitySchema } from './artist.type';

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

export const AuthChannelTypeEnum = z.enum(['NONE', 'kakao', 'naver']);
export type AuthChannelType = z.infer<typeof AuthChannelTypeEnum>;

const ProgressTypeEnum = z.enum([
  'MARKETING_CONSENT',
  'SERVICE_TERMS_AGREEMENT',
  'PERSONAL_INFO_CONSENT',
  'ONBOARDING_COMPLETE',
  'PAYMENT_COMPLETE',
]);
export type ProgressType = z.infer<typeof ProgressTypeEnum>;

// ----- GET -----

export const UserStatsReadModel = z
  .object({
    userId: z.number(),
    nickname: z.string(),
    phoneNumber: z.string(),
    profileImage: z.string().url().or(z.string().length(0)),
    gender: GenderEnum,
    ageRange: AgeRangeEnum,
    authChannel: AuthChannelTypeEnum,
    regionId: z.number(),
    socialInfo: z.object({
      uniqueId: z.string(),
      nickname: z.string(),
    }),
    favoriteArtists: ArtistsViewEntitySchema.array(),
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
    userId: z.number(),
    nickname: z.string(),
    profileImage: z.string(),
    phoneNumber: z.string(),
    gender: GenderEnum,
    ageRange: AgeRangeEnum,
    regionId: z.number().nullable(),
    authChannelType: AuthChannelTypeEnum,
    lastLoginAt: z.string().nullable(),
    favoriteArtists: ArtistsViewEntitySchema.array().nullable(),
    progresses: z
      .object({
        progressType: ProgressTypeEnum,
        isCompleted: z.boolean(),
      })
      .array(),
  })
  .strict();
export type UsersViewEntity = z.infer<typeof UsersViewEntitySchema>;
