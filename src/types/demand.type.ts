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
    shuttleDemandId: z.string(),
    userId: z.string(),
    userName: z.string(),
    userNickname: z.string(),
    userProfileImage: z.string().nullable(),
    event: z.lazy(() => EventsViewEntitySchema),
    eventId: z.string(),
    dailyEventId: z.string(),
    regionId: z.string(),
    toDestinationRegionHub: z
      .object({
        regionHubId: z.string(),
        name: z.string(),
        address: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
      .nullable(),
    desiredToDestinationRegionHub: z.string().nullable(),
    fromDestinationRegionHub: z
      .object({
        regionHubId: z.string(),
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
    eventId: z.string().nullable(),
    eventName: z.string().nullable(),
    eventImageUrl: z.string().nullable(),
    dailyEventId: z.string().nullable(),
    provinceFullName: z.string().nullable(),
    provinceShortName: z.string().nullable(),
    cityFullName: z.string().nullable(),
    cityShortName: z.string().nullable(),
    regionHubName: z.string().nullable(),
    regionHubId: z.string().nullable(),
    regionHubLatitude: z.number().nullable(),
    regionHubLongitude: z.number().nullable(),
    totalCount: z.number().int(),
    roundTripCount: z.number().int(),
    toDestinationCount: z.number().int(),
    fromDestinationCount: z.number().int(),
  })
  .strict();
export type ShuttleDemandStatisticsReadModel = z.infer<
  typeof ShuttleDemandStatisticsReadModelSchema
>;

export const DemandBasedRouteResponseSchema = z.object({
  nodes: z.number().array(),
  edges: z
    .object({
      source: z.number(),
      target: z.number(),
      distance: z.number(),
    })
    .array(),
  totalDistance: z.number(), // km
  totalCount: z.number(),
});
export type DemandBasedRouteResponse = z.infer<
  typeof DemandBasedRouteResponseSchema
>;

export const RegionHubClusterNodeSchema = z.object({
  clusterId: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  totalCount: z.number(),
  nodes: z
    .object({
      id: z.string(),
      x: z.number(),
      y: z.number(),
      data: z.object({
        regionHubName: z.string(),
        count: z.number(),
      }),
    })
    .array(),
});
export type RegionHubClusterNode = z.infer<typeof RegionHubClusterNodeSchema>;
