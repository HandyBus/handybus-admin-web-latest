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

export const BusSchema = z.object({
  shuttleBusId: z.number().int(),
  shuttleRouteId: z.number().int(),
  handyUserId: z.number().int().nullable(), // is this nullable?
  type: z.enum(['SEATER_12', 'SEATER_28', 'SEATER_45']),
  name: z.string(),
  number: z.unknown(), // zodCarNumber.optional(),
  phoneNumber: z.unknown(), //zodPhoneNumber.optional(),
  openChatLink: z.unknown(), //zodOpenChatLink.optional(),
  capacity: z.number().int(),
});

export type BusType = z.infer<typeof BusSchema>;

////////////// create bus action ///////////////

export const CreateBusRequestSchema = z.object({
  type: z.enum(['SEATER_12', 'SEATER_28', 'SEATER_45']),
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
