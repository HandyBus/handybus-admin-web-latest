import { z } from 'zod';

/**
 * @remarks
 * Swagger에 따르면 이 타입은 ViewEntity가 아니고, ReadModel입니다. 재사용하지 않도록 주의해주세요.
 */
export const ShuttleDemandStatisics = z
  .object({
    eventId: z.number().int(),
    dailyEventId: z.number().int().nullable(),
    provinceFullName: z.string().nullable(),
    provinceShortName: z.string().nullable(),
    cityFullName: z.string().nullable(),
    cityShortName: z.string().nullable(),
    toDestinationRegionHubName: z.string().nullable(),
    fromDestinationRegionHubName: z.string().nullable(),
    totalCount: z.number().int(),
    roundTripCount: z.number().int(),
    toDestinationCount: z.number().int(),
    fromDestinationCount: z.number().int(),
  })
  .strict();

export type ShuttleDemandStatisics = z.infer<typeof ShuttleDemandStatisics>;
