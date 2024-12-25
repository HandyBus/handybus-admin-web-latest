import { z } from 'zod';

export const PassengerSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
});

export type PassengerType = z.infer<typeof PassengerSchema>;
