import { z } from 'zod';

export const ArtistSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ArtistType = z.infer<typeof ArtistSchema>;

export const ArtistsSchema = z.array(ArtistSchema);
