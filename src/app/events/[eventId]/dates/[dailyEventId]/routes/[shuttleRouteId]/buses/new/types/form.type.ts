import {
  CreateShuttleBusRequest,
  CreateShuttleBusRequestSchema,
} from '@/types/shuttleBus.type';
import { z } from 'zod';

export const CreateBusFormSchema = CreateShuttleBusRequestSchema;

export type CreateBusFormType = z.infer<typeof CreateBusFormSchema>;

export const conform = (data: CreateBusFormType): CreateShuttleBusRequest => {
  return data;
};
