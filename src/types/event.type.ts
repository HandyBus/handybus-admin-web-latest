import { z } from 'zod';
import { ArtistsViewEntitySchema } from './artist.type';

// ----- ENUM -----

export const EventStatusEnum = z.enum([
  'STAND_BY', // 대기 상태 (수요조사 시작 전)
  'OPEN', // 행사 수요조사 모집 중
  'ENDED', // 행사 종료
  'INACTIVE', // 행사 비활성
]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

export const DailyEventStatusEnum = z.enum(['OPEN', 'ENDED', 'INACTIVE']);
export type DailyEventStatus = z.infer<typeof DailyEventStatusEnum>;

export const EventTypeEnum = z.enum(['CONCERT', 'FESTIVAL', 'SPORTS']);
export type EventType = z.infer<typeof EventTypeEnum>;

// ----- GET -----

export const EventDailyShuttlesInEventsViewEntitySchema = z
  .object({
    dailyEventId: z.string(),
    dailyEventDate: z.string(),
    dailyEventStatus: DailyEventStatusEnum,
    dailyEventIsDemandOpen: z.boolean(),
    dailyEventDemandAutoOpenAt: z.string(),
    dailyEventDemandAutoCloseAt: z.string(),
    dailyEventDemandControlMode: z.enum(['AUTO', 'MANUAL']),
    dailyEventManualDemandOpen: z.boolean(),
    dailyEventMetadata: z.record(z.string(), z.any()).nullable(),
  })
  .strict();
export type EventDailyShuttlesInEventsViewEntity = z.infer<
  typeof EventDailyShuttlesInEventsViewEntitySchema
>;

export const EventsViewEntitySchema = z
  .object({
    eventId: z.string(),
    eventName: z.string(),
    eventType: EventTypeEnum,
    regionId: z.string(),
    regionHubId: z.string(),
    eventStatus: EventStatusEnum,
    eventImageUrl: z.string(),
    eventDetailImageUrl: z.string().nullable(),
    eventLocationName: z.string(),
    eventLocationAddress: z.string(),
    eventLocationLatitude: z.number(),
    eventLocationLongitude: z.number(),
    eventArtists: ArtistsViewEntitySchema.array().nullable(),
    dailyEvents: EventDailyShuttlesInEventsViewEntitySchema.array(),
    startDate: z.string(),
    endDate: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    eventIsPinned: z.boolean(),
    eventMinRoutePrice: z.number().nullable(),
    eventHasOpenRoute: z.boolean(),
    eventRecommendationScore: z.number(),
    eventMetadata: z.record(z.string(), z.any()).nullable(),
  })
  .strict();
export type EventsViewEntity = z.infer<typeof EventsViewEntitySchema>;

export const DailyEventWithStatisticsViewEntitySchema =
  EventDailyShuttlesInEventsViewEntitySchema.extend({
    expectedRouteCount: z.number(),
    shuttleRouteCount: z.number(),
    totalDemandCount: z.number(),
    roundTripDemandCount: z.number(),
    toDestinationDemandCount: z.number(),
    fromDestinationDemandCount: z.number(),
    totalReservationCount: z.number(),
  });
export type DailyEventWithStatisticsViewEntity = z.infer<
  typeof DailyEventWithStatisticsViewEntitySchema
>;

export const EventWithStatisticsViewEntitySchema = EventsViewEntitySchema.omit({
  eventIsPinned: true,
}).extend({
  dailyEvents: DailyEventWithStatisticsViewEntitySchema.array(),
});
export type EventWithStatisticsViewEntity = z.infer<
  typeof EventWithStatisticsViewEntitySchema
>;

// ----- POST -----

export const CreateDailyEventPropsSchema = z.object({
  date: z.string().describe('이벤트 날짜'),
  demandAutoOpenAt: z
    .string()
    .optional()
    .describe('수요조사 자동 오픈 일시 (UTC)'),
  demandAutoCloseAt: z
    .string()
    .optional()
    .describe('수요조사 자동 마감 일시 (UTC)'),
  demandControlMode: z
    .enum(['AUTO', 'MANUAL'])
    .optional()
    .describe('수요조사 제어 모드'),
  manualDemandOpen: z
    .boolean()
    .optional()
    .describe('수동 수요조사 오픈 여부 (MANUAL 모드에서만 사용)'),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});
export type CreateDailyEventProps = z.infer<typeof CreateDailyEventPropsSchema>;

export const CreateEventRequestSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
  detailImageUrl: z.string().url().nullable().optional(),
  regionId: z.string(),
  regionHubId: z.string(),
  dailyEvents: CreateDailyEventPropsSchema.array(),
  type: EventTypeEnum,
  artistIds: z.string().array(),
  isPinned: z.boolean(),
});
export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;

export const UpdateDailyEventRequestSchema = z
  .object({
    dailyEventId: z.string().describe('일일 이벤트 ID'),
    status: DailyEventStatusEnum.describe('일일 이벤트 상태'),
    date: z.string().describe('일일 이벤트 날짜'),
    demandAutoOpenAt: z.string().describe('수요조사 자동 오픈 일시 (UTC)'),
    demandAutoCloseAt: z.string().describe('수요조사 자동 마감 일시 (UTC)'),
    demandControlMode: z
      .enum(['AUTO', 'MANUAL'])
      .describe('수요조사 제어 모드'),
    manualDemandOpen: z
      .boolean()
      .describe('수동 수요조사 오픈 여부 (MANUAL 모드에서만 사용)'),
    metadata: z.string().describe('일일이벤트 메타데이터').nullable(),
  })
  .partial();
export type UpdateDailyEventRequest = z.infer<
  typeof UpdateDailyEventRequestSchema
>;

export const UpdateEventRequestSchema = z
  .object({
    status: EventStatusEnum,
    name: z.string(),
    imageUrl: z.string().url(),
    detailImageUrl: z.string().url().nullable(),
    regionId: z.string(),
    regionHubId: z.string(),
    type: EventTypeEnum,
    dailyEvents: UpdateDailyEventRequestSchema.array(),
    artistIds: z.string().array(),
    isPinned: z.boolean(),
    metadata: z.string().describe('이벤트 메타데이터').nullable(),
    eventMinRoutePrice: z.number().describe('이벤트 최소 노선 가격').nullable(),
  })
  .partial();
export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
