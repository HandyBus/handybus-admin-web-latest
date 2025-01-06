import { z } from 'zod';

export const UserSchema = z.object({
  userId: z.number().int(),
  nickname: z.string(),
  phoneNumber: z.string(), // TODO
  ageRange: z.enum([
    '연령대 미지정',
    '10대 이하',
    '20대',
    '30대',
    '40대',
    '50대',
    '60대',
    '70대',
    '80대 이상',
  ]),
  gender: z.enum(['NONE', 'MALE', 'FEMALE']),
  profileImage: z.string().url().or(z.string().length(0)), // TODO nullable?
  regionId: z.number().int().nullable(), // TODO nullable?
});

export type UserType = z.infer<typeof UserSchema>;
