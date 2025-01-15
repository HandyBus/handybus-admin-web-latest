import {
  CreateBusRequestSchema,
  type CreateBusRequest,
} from '@/types/v2/shuttleBus.type';
import { z } from 'zod';

export const CreateBusFormSchema = CreateBusRequestSchema;

export type CreateBusFormType = z.infer<typeof CreateBusRequestSchema>;

export const conform = (data: CreateBusFormType): CreateBusRequest => {
  return data;
};
