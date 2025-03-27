import {
  AdminUpdateShuttleBusRequest,
  AdminUpdateShuttleBusRequestSchema,
} from '@/types/shuttleBus.type';
import { z } from 'zod';

export const EditBusFormSchema = AdminUpdateShuttleBusRequestSchema;

export type EditBusFormType = z.infer<typeof EditBusFormSchema>;

export const conform = (
  data: EditBusFormType,
  defaultOpenChatLink: string | undefined,
): AdminUpdateShuttleBusRequest => {
  if (data.openChatLink) {
    if (data.openChatLink !== defaultOpenChatLink) {
      return data;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { openChatLink, ...rest } = data;
  return rest;
};
