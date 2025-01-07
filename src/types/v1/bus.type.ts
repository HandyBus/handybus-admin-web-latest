import { z } from 'zod';

const phoneRegex = /^01\d\-\d{4}\-d{4}$/;

// const carNumberRegex = /^[0-9]{2}[가-힣]{1}[0-9]{4}$/;

// const zodPhoneNumber = z
//   .string()
//   .refine(
//     (value) => phoneRegex.test(value),
//     '010으로 시작하는 11자리 숫자를 입력해주세요',
//   );

// const zodCarNumber = z
//   .string()
//   .refine((value) => carNumberRegex.test(value), '차량번호를 입력해주세요');

// const zodOpenChatLink = z
//   .string()
//   .url()
//   .startsWith('https://openchat.kakao.com');

export const BusSortSchema = z.enum([
  'SMALL_BUS_28', // 28인승 우등버스
  'LIMOUSINE_BUS_31', // 31인승 리무진버스
  'SPRINTER_12', // 12인승 스프린터
  'VAN_12', // 12인승 밴
  'MINIBUS_24', // 24인승 미니버스
  'LARGE_BUS_45', // 45인승 대형버스
  'LARGE_BUS_41', // 41인승 대형버스
  'PREMIUM_BUS_21', // 21인승 프리미엄버스
  'MEDIUM_BUS_21', // 21인승 중형우등버스
  'SMALL_BUS_33', // 33인승 우등버스
]);

export type BusSortType = z.infer<typeof BusSortSchema>;

export const BusTypesToCapacity: Record<
  z.infer<typeof BusSortSchema>,
  number
> = {
  ['SMALL_BUS_28']: 28,
  ['LIMOUSINE_BUS_31']: 31,
  ['SPRINTER_12']: 12,
  ['VAN_12']: 12,
  ['MINIBUS_24']: 23,
  ['LARGE_BUS_45']: 45,
  ['LARGE_BUS_41']: 41,
  ['PREMIUM_BUS_21']: 21,
  ['MEDIUM_BUS_21']: 21,
  ['SMALL_BUS_33']: 33,
};

export const BusSchema = z.object({
  shuttleBusId: z.number().int(),
  shuttleRouteId: z.number().int(),
  handyUserId: z.number().int().nullable(), // is this nullable?
  type: BusSortSchema,
  name: z.string(),
  number: z.unknown(), // zodCarNumber.optional(),
  phoneNumber: z.unknown(), //zodPhoneNumber.optional(),
  openChatLink: z.unknown(), //zodOpenChatLink.optional(),
  capacity: z.number().int(),
});

export type BusType = z.infer<typeof BusSchema>;

////////////// create bus action ///////////////

export const CreateBusRequestSchema = z.object({
  type: BusSortSchema,
  name: z.string(),
  number: z.string(),
  phoneNumber: z
    .string()
    .refine(
      (value) => phoneRegex.test(value),
      '010으로 시작하는 11자리 숫자를 입력해주세요',
    ),
  openChatLink: z.string().url(),
});

export type CreateBusRequestType = z.infer<typeof CreateBusRequestSchema>;
