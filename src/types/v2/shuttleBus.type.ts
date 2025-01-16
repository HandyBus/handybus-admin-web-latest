import { z } from 'zod';

/////////////////////// pre-defined enums ///////////////////////

export const BusTypeSchema = z.enum([
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

/////////////////////// view entity ///////////////////////

export const ShuttleBusesViewEntity = z
  .object({
    shuttleBusId: z.number().int(),
    shuttleRouteId: z.number().int(),
    busType: BusTypeSchema,
    busName: z.string(),
    busNumber: z.string(),
    busCapacity: z.number().int(),
    busDriverPhoneNumber: z.string(),
    openChatLink: z.string().nullable(),
  })
  .strict();

export type ShuttleBusesView = z.infer<typeof ShuttleBusesViewEntity>;

/////////////////////// create bus action ///////////////////////

import { phoneRegex } from '../meta/common.type';

export const BusSchema = z.object({
  shuttleBusId: z.number().int(),
  shuttleRouteId: z.number().int(),
  type: BusTypeSchema,
  name: z.string(),
  // TODO are 'number, phoneNumber, openChatLink' optional? 빈 경우 ""를 주는 것으로 보임, 확인 필요
  number: z.string(),
  phoneNumber: z.string(),
  openChatLink: z.string(),
  capacity: z.number().int(),
});

export type Bus = z.infer<typeof BusSchema>;

////////////// create bus action ///////////////

export const CreateBusRequestSchema = z.object({
  type: BusTypeSchema,
  name: z.string(),
  number: z.string(),
  phoneNumber: z
    .string()
    .refine(
      (value) => phoneRegex.test(value),
      '010으로 시작하는 11자리 숫자를 입력해주세요',
    ),
  openChatLink: z.string().url().optional(),
});

export type CreateBusRequest = z.infer<typeof CreateBusRequestSchema>;

export const AssignBusRequestSchema = z.object({
  reservationShuttleBusMap: z
    .object({
      reservationId: z.number(),
      shuttleBusId: z.number(),
    })
    .array(),
});

export type AssignBusRequest = z.infer<typeof AssignBusRequestSchema>;
