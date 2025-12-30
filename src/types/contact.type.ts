import { z } from 'zod';

export const AdminContactResponseModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});
export type AdminContactResponseModel = z.infer<
  typeof AdminContactResponseModelSchema
>;
