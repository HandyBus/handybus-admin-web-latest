import { ArtistsViewEntitySchema } from '@/types/artist.type';
import { authInstance } from './config';
import { useMutation, useQuery } from '@tanstack/react-query';

// ----- GET -----

export const getArtists = async () => {
  const res = await authInstance.get('/v2/shuttle-operation/admin/artists', {
    shape: {
      artists: ArtistsViewEntitySchema.array(),
    },
  });
  return res.artists;
};

export const useGetArtists = () => {
  return useQuery({
    queryKey: ['artist'],
    queryFn: getArtists,
  });
};

export const getArtist = async (artistId: string) => {
  const res = await authInstance.get(
    `/v2/shuttle-operation/admin/artists/${artistId}`,
    {
      shape: {
        artist: ArtistsViewEntitySchema,
      },
    },
  );
  return res.artist;
};

export const useGetArtist = (artistId: string) => {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtist(artistId),
  });
};

// ----- POST -----

export const postArtist = async (body: { name: string }) => {
  await authInstance.post('/v1/shuttle-operation/admin/artists', body);
};

export const usePostArtist = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  return useMutation({
    mutationFn: postArtist,
    onSuccess,
    onError,
  });
};

export const putArtist = async (artistId: string, body: { name: string }) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/artists/${artistId}`,
    body,
  );
};

export const usePutArtist = () => {
  return useMutation({
    mutationFn: ({ artistId, name }: { artistId: string; name: string }) =>
      putArtist(artistId, { name }),
  });
};

export const deleteArtist = async (artistId: string) => {
  await authInstance.delete(`/v1/shuttle-operation/admin/artists/${artistId}`);
};

export const useDeleteArtist = () => {
  return useMutation({
    mutationFn: deleteArtist,
  });
};

export const deleteArtists = async (artistIds: string[]) => {
  await authInstance.delete(`/v1/shuttle-operation/admin/artists`, {
    artistIds,
  });
};

export const useDeleteArtists = () => {
  return useMutation({
    mutationFn: deleteArtists,
  });
};
