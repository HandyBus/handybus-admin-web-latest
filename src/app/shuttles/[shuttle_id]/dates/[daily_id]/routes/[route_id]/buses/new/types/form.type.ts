import {
  CreateBusRequestSchema,
  type CreateBusRequestType,
} from '@/types/bus.type';
import { z } from 'zod';

export const CreateBusFormSchema = CreateBusRequestSchema;

export type CreateBusFormType = z.infer<typeof CreateBusRequestSchema>;

export const conform = (data: CreateBusFormType): CreateBusRequestType => {
  return data;
};
