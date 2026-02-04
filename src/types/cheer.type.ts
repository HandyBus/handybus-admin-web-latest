import { z } from 'zod';

export const EventCheerCampaignStatusEnum = z.enum([
  'READY',
  'RUNNING',
  'ENDED',
  'INACTIVE',
]);
export type EventCheerCampaignStatus = z.infer<
  typeof EventCheerCampaignStatusEnum
>;

export const ParticipationTypeEnum = z.enum(['BASE', 'SHARE']);
export type ParticipationType = z.infer<typeof ParticipationTypeEnum>;

// ----- GET -----

const EventCheerDiscountPoliciesInEventCheerCampaignsViewEntitySchema =
  z.object({
    eventCheerDiscountPolicyId: z.string(),
    minParticipationCount: z.number(),
    discountRate: z.number(),
    isActive: z.boolean(),
  });

const EventCheerCampaignResultInEventCheerCampaignsViewEntitySchema = z.object({
  eventCheerCampaignResultId: z.string(),
  totalParticipationCount: z.number(),
  finalDiscountRate: z.number(),
  decidedAt: z.string(),
});

export const EventCheerCampaignsViewEntitySchema = z.object({
  eventCheerCampaignId: z.string(),
  eventId: z.string(),
  status: EventCheerCampaignStatusEnum,
  imageUrl: z.string().nullable(),
  buttonImageUrl: z.string().nullable(),
  buttonText: z.string().nullable(),
  endDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  cheerCampaignParticipationTotalCount: z.number(),
  discountPolicies:
    EventCheerDiscountPoliciesInEventCheerCampaignsViewEntitySchema.array(),
  result:
    EventCheerCampaignResultInEventCheerCampaignsViewEntitySchema.nullable(),
});
export type EventCheerCampaignsViewEntity = z.infer<
  typeof EventCheerCampaignsViewEntitySchema
>;

export const EventCheerCampaignParticipationResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  cheerCampaignId: z.string(),
  participationType: ParticipationTypeEnum,
  participatedDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type EventCheerCampaignParticipationResponse = z.infer<
  typeof EventCheerCampaignParticipationResponseSchema
>;

// ----- POST -----

export const AdminCreateEventCheerCampaignRequestSchema = z.object({
  eventId: z.string(),
  imageUrl: z.string().url().nullable().optional(),
  buttonImageUrl: z.string().url().nullable().optional(),
  buttonText: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});
export type AdminCreateEventCheerCampaignRequest = z.infer<
  typeof AdminCreateEventCheerCampaignRequestSchema
>;

export const AdminUpdateEventCheerCampaignRequestSchema = z.object({
  imageUrl: z.string().url().nullable().optional(),
  buttonImageUrl: z.string().url().nullable().optional(),
  buttonText: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});
export type AdminUpdateEventCheerCampaignRequest = z.infer<
  typeof AdminUpdateEventCheerCampaignRequestSchema
>;

export const AdminCreateEventCheerDiscountPolicySchema = z.object({
  minParticipationCount: z.number(),
  discountRate: z.number(),
  isActive: z.boolean().optional(),
});
export type AdminCreateEventCheerDiscountPolicy = z.infer<
  typeof AdminCreateEventCheerDiscountPolicySchema
>;

export const AdminUpdateEventCheerDiscountPolicyRequestSchema = z.object({
  minParticipationCount: z.number().optional(),
  discountRate: z.number().optional(),
  isActive: z.boolean().optional(),
});
export type AdminUpdateEventCheerDiscountPolicyRequest = z.infer<
  typeof AdminUpdateEventCheerDiscountPolicyRequestSchema
>;
