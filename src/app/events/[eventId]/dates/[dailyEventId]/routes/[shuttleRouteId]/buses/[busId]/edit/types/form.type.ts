import {
  AdminUpdateShuttleBusRequest,
  AdminUpdateShuttleBusRequestSchema,
} from '@/types/shuttleBus.type';
import { z } from 'zod';

export const EditBusFormSchema = AdminUpdateShuttleBusRequestSchema;

export type EditBusFormType = z.infer<typeof EditBusFormSchema>;

export const conform = (
  data: EditBusFormType,
): AdminUpdateShuttleBusRequest => {
  if (data.openChatLink) {
    return data;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { openChatLink, ...rest } = data; // openChatLink가 비어있을땐 나머지 값들만 반환
  return rest;
};
