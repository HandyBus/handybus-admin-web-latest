import { z } from 'zod';

export const AdminFeedbackResponseModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminFeedbackResponseModel = z.infer<
  typeof AdminFeedbackResponseModelSchema
>;
