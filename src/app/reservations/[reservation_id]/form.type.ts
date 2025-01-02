import { z } from 'zod';
import {
  HandyStatusSchema,
  UpdateReservationRequestType,
} from '@/types/reservation.type';

export const UpdateReservationHandyStatusFormSchema = z.object({
  handyStatus: HandyStatusSchema,
});

export type UpdateReservationHandyStatusFormType = z.infer<
  typeof UpdateReservationHandyStatusFormSchema
>;

export const conform = (
  formType: UpdateReservationHandyStatusFormType,
): UpdateReservationRequestType => {
  return formType;
};
