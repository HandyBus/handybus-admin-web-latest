import { z } from 'zod';
import { TripTypeEnum } from './shuttleRoute.type';
import { EventsViewEntitySchema } from './event.type';

// ----- ENUM -----

export const ShuttleDemandStatusEnum = z.enum([
  'OPEN', // 수요조사가 아직 모집 중인 상태
  'CLOSED', // 수요조사 모집 종료
  'ENDED', // 행사가 끝나 셔틀 운행 종료
  'CANCELLED', // 무산 상태
  'INACTIVE', // 비활성 상태
]);
export type ShuttleDemandStatus = z.infer<typeof ShuttleDemandStatusEnum>;

// ----- GET -----

export const ShuttleDemandsViewEntitySchema = z
  .object({
    shuttleDemandId: z.number(),
    userId: z.number(),
    userNickname: z.string(),
    userProfileImage: z.string(),
    event: EventsViewEntitySchema,
    eventId: z.number(),
    dailyEventId: z.number(),
    regionId: z.number(),
    toDestinationRegionHub: z
      .object({
        regionHubId: z.number(),
        name: z.string(),
        address: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
      .nullable(),
    desiredToDestinationRegionHub: z.string().nullable(),
    fromDestinationRegionHub: z
      .object({
        regionHubId: z.number(),
        name: z.string(),
        address: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
      .nullable(),
    desiredFromDestinationRegionHub: z.string().nullable(),
    type: TripTypeEnum,
    passengerCount: z.number(),
    status: ShuttleDemandStatusEnum,
    hasShuttleRoute: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();
export type ShuttleDemandsViewEntity = z.infer<
  typeof ShuttleDemandsViewEntitySchema
>;

export const ShuttleDemandStatisticsReadModelSchema = z
  .object({
    eventId: z.number().int(),
    eventName: z.string().nullable(),
    eventImageUrl: z.string().nullable(),
    dailyEventId: z.number().int().nullable(),
    provinceFullName: z.string().nullable(),
    provinceShortName: z.string().nullable(),
    cityFullName: z.string().nullable(),
    cityShortName: z.string().nullable(),
    toDestinationRegionHubName: z.string().nullable(),
    fromDestinationRegionHubName: z.string().nullable(),
    totalCount: z.number().int(),
    roundTripCount: z.number().int(),
    toDestinationCount: z.number().int(),
    fromDestinationCount: z.number().int(),
  })
  .strict();
export type ShuttleDemandStatisticsReadModel = z.infer<
  typeof ShuttleDemandStatisticsReadModelSchema
>;
