import { z } from 'zod';
import { ArtistsViewEntitySchema } from './artist.type';
import { EventTypeEnum } from './event.type';
import { ActiveStatusEnum } from './common.type';

// ----- ENUM -----

// ----- GET -----

export const ReviewsViewEntitySchema = z
  .object({
    reviewId: z.string(),
    reservationId: z.string(),
    rating: z.number(),
    content: z.string(),
    reviewStatus: ActiveStatusEnum,
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.string(),
    userNickname: z.string(),
    userProfileImage: z.string().nullable(),
    eventId: z.string(),
    eventName: z.string(),
    eventType: EventTypeEnum,
    eventLocationName: z.string(),
    eventImageUrl: z.string().nullable(),
    eventArtists: ArtistsViewEntitySchema.array().nullable(),
    reviewImages: z
      .object({
        imageUrl: z.string().url(),
        status: ActiveStatusEnum,
      })
      .array()
      .nullable(),
  })
  .strict();
export type ReviewsViewEntity = z.infer<typeof ReviewsViewEntitySchema>;

// ----- product entity -----

export const ReviewsViewEntityProductSchema = z
  .object({
    reviewId: z.string(),
    reservationId: z.string(),
    rating: z.number(),
    overallRating: z.number(),
    serviceRating: z.number(),
    rideRating: z.number(),
    recommendToOthers: z.boolean(),
    content: z.string(),
    reviewStatus: ActiveStatusEnum,
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.string(),
    userNickname: z.string(),
    userName: z.string().nullable(),
    userProfileImage: z.string().nullable(),
    toDestinationRegionId: z.string().nullable(),
    fromDestinationRegionId: z.string().nullable(),
    eventId: z.string(),
    eventName: z.string(),
    eventType: EventTypeEnum,
    eventLocationName: z.string(),
    eventImageUrl: z.string().url(),
    eventArtists: ArtistsViewEntitySchema.array().nullable(),
    reviewImages: z
      .object({
        imageUrl: z.string().url(),
        status: ActiveStatusEnum,
      })
      .array()
      .nullable(),
  })
  .strict();
export type ReviewsViewEntityProduct = z.infer<
  typeof ReviewsViewEntityProductSchema
>;

export const ReviewStatisticsViewEntityProductSchema = z.object({
  averageRating: z.number(),
  cumulativeReviewCount: z.number(),
  recommendationScore: z.number(),
});
export type ReviewStatisticsViewEntityProduct = z.infer<
  typeof ReviewStatisticsViewEntityProductSchema
>;
