import { z } from 'zod';

export const FlatPassengerSchema = z
  .object({
    passengerId: z.number().int(),
    passengerName: z.string().nullable(),
    passengerPhoneNumber: z.string().nullable(),
  })
  .strict();

export const PassengerSchema = z
  .object({
    name: z.string().nullable(),
    phoneNumber: z.string().nullable(),
  })
  .strict();

export type PassengerType = z.infer<typeof PassengerSchema>;
