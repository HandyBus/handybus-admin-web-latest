import { z } from 'zod';
import { phoneRegex } from './common.type';

// ----- ENUM -----

export const BusTypeEnum = z.enum([
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
export type BusType = z.infer<typeof BusTypeEnum>;

// ----- GET -----

export const ShuttleBusesViewEntitySchema = z
  .object({
    shuttleBusId: z.string(),
    shuttleRouteId: z.string(),
    busType: BusTypeEnum,
    busName: z.string(),
    busNumber: z.string(),
    busCapacity: z.number().int(),
    busDriverPhoneNumber: z.string(),
    openChatLink: z.string().nullable(),
  })
  .strict();
export type ShuttleBusesViewEntity = z.infer<
  typeof ShuttleBusesViewEntitySchema
>;

// ----- POST -----

export const CreateShuttleBusRequestSchema = z.object({
  type: BusTypeEnum,
  name: z.string(),
  number: z.string(),
  phoneNumber: z
    .string()
    .refine(
      (value) => phoneRegex.test(value),
      '010으로 시작하는 11자리 숫자를 입력해주세요',
    ),
});
export type CreateShuttleBusRequest = z.infer<
  typeof CreateShuttleBusRequestSchema
>;

export const AdminUpdateShuttleBusRequestSchema = z
  .object({
    type: BusTypeEnum,
    name: z.string(),
    number: z.string(),
    phoneNumber: z.string(),
    openChatLink: z.string(),
  })
  .partial();
export type AdminUpdateShuttleBusRequest = z.infer<
  typeof AdminUpdateShuttleBusRequestSchema
>;

export const BulkAssignBusRequestSchema = z.object({
  reservationShuttleBusMap: z
    .object({
      reservationId: z.string(),
      shuttleBusId: z.string(),
    })
    .array(),
});
export type BulkAssignBusRequest = z.infer<typeof BulkAssignBusRequestSchema>;
