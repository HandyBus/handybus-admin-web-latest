import { z } from 'zod';
import { ArtistsViewEntitySchema } from './artist.type';

// ----- ENUM -----

export const EventStatusEnum = z.enum([
  'OPEN', // 행사 수요조사 모집 중
  'CLOSED', // 행사 수요조사 모집 종료 (dailyEvent의 경우에는 해당 일자의 수요조사 모집 종료)
  'ENDED', // 행사 종료
  'INACTIVE', // 행사 비활성
]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

export const EventTypeEnum = z.enum(['CONCERT', 'FESTIVAL']);
export type EventType = z.infer<typeof EventTypeEnum>;

// ----- GET -----

export const EventDailyShuttlesInEventsViewEntitySchema = z
  .object({
    dailyEventId: z.string(),
    date: z.string(),
    status: EventStatusEnum,
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
    eventImageUrl: z.literal('').or(z.string()),
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
  });
export type DailyEventWithStatisticsViewEntity = z.infer<
  typeof DailyEventWithStatisticsViewEntitySchema
>;

export const EventWithStatisticsViewEntitySchema =
  EventsViewEntitySchema.extend({
    dailyEvents: DailyEventWithStatisticsViewEntitySchema.array(),
  });
export type EventWithStatisticsViewEntity = z.infer<
  typeof EventWithStatisticsViewEntitySchema
>;

// ----- POST & PUT -----

export const CreateEventRequestSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
  regionId: z.string(),
  regionHubId: z.string(),
  dailyEvents: z.object({ date: z.date() }).array(),
  type: EventTypeEnum,
  artistIds: z.string().array(),
});
export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;

export const UpdateEventRequestSchema = z
  .object({
    status: EventStatusEnum,
    name: z.string(),
    imageUrl: z.string().url(),
    regionId: z.string(),
    regionHubId: z.string(),
    dailyEvents: z
      .object({
        status: EventStatusEnum.optional(),
        dailyEventId: z.string().optional(),
        date: z.string(),
      })
      .array(),
    type: EventTypeEnum,
    artistIds: z.string().array(),
  })
  .partial();
export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
