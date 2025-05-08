import { z } from 'zod';

export const AdminAnnouncementResponseModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type AdminAnnouncementResponseModel = z.infer<
  typeof AdminAnnouncementResponseModelSchema
>;

export const AdminCreateAnnouncementRequestSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type AdminCreateAnnouncementRequest = z.infer<
  typeof AdminCreateAnnouncementRequestSchema
>;

export const AdminUpdateAnnouncementRequestSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    isDeleted: z.boolean(),
  })
  .partial();

export type AdminUpdateAnnouncementRequest = z.infer<
  typeof AdminUpdateAnnouncementRequestSchema
>;
