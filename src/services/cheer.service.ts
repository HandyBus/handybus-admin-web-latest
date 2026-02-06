import {
  AdminCreateEventCheerCampaignRequest,
  AdminCreateEventCheerCampaignRequestSchema,
  AdminCreateEventCheerDiscountPolicy,
  AdminCreateEventCheerDiscountPolicySchema,
  AdminUpdateEventCheerCampaignRequest,
  AdminUpdateEventCheerCampaignRequestSchema,
  AdminUpdateEventCheerDiscountPolicyRequest,
  AdminUpdateEventCheerDiscountPolicyRequestSchema,
  EventCheerCampaignsViewEntitySchema,
} from '@/types/cheer.type';
import { authInstance } from './config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { silentParse } from '@/utils/parse.util';

// ----- GET -----

export const getEventCheerCampaign = async (eventCheerCampaignId: string) => {
  const res = await authInstance.get(
    `/v1/shuttle-operation/admin/cheer/campaigns/${eventCheerCampaignId}`,
    {
      shape: {
        eventCheerCampaign: EventCheerCampaignsViewEntitySchema,
      },
    },
  );
  return res.eventCheerCampaign;
};

export const useGetEventCheerCampaign = (eventCheerCampaignId: string) => {
  return useQuery({
    queryKey: ['cheer', 'campaign', eventCheerCampaignId],
    queryFn: () => getEventCheerCampaign(eventCheerCampaignId),
  });
};

export const getEventCheerCampaignByEventId = async (eventId: string) => {
  const res = await authInstance.get(
    `/v1/shuttle-operation/admin/events/${eventId}/cheer/campaigns`,
    {
      shape: {
        eventCheerCampaign: EventCheerCampaignsViewEntitySchema,
      },
    },
  );
  return res.eventCheerCampaign;
};

export const useGetEventCheerCampaignByEventId = (eventId: string) => {
  return useQuery({
    queryKey: ['cheer', 'campaign', 'by-event', eventId],
    queryFn: () => getEventCheerCampaignByEventId(eventId),
  });
};

// ----- POST -----

export const postEventCheerCampaign = async (
  body: AdminCreateEventCheerCampaignRequest,
) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/cheer/campaigns`,
    silentParse(AdminCreateEventCheerCampaignRequestSchema, body),
  );
};

export const usePostEventCheerCampaign = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postEventCheerCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheer', 'campaign'] });
      onSuccess?.();
    },
    onError,
  });
};

export const putEventCheerCampaign = async (
  eventCheerCampaignId: string,
  body: AdminUpdateEventCheerCampaignRequest,
) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/cheer/campaigns/${eventCheerCampaignId}`,
    silentParse(AdminUpdateEventCheerCampaignRequestSchema, body),
  );
};

export const usePutEventCheerCampaign = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventCheerCampaignId,
      body,
    }: {
      eventCheerCampaignId: string;
      body: AdminUpdateEventCheerCampaignRequest;
    }) => putEventCheerCampaign(eventCheerCampaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheer', 'campaign'] });
      onSuccess?.();
    },
    onError,
  });
};

export const postEventCheerDiscountPolicy = async (
  eventCheerCampaignId: string,
  body: { policies: Array<AdminCreateEventCheerDiscountPolicy> },
) => {
  await authInstance.post(
    `/v1/shuttle-operation/admin/cheer/campaigns/${eventCheerCampaignId}/policies`,
    {
      policies: silentParse(
        AdminCreateEventCheerDiscountPolicySchema.array(),
        body.policies,
      ),
    },
  );
};

export const usePostEventCheerDiscountPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventCheerCampaignId,
      body,
    }: {
      eventCheerCampaignId: string;
      body: { policies: Array<AdminCreateEventCheerDiscountPolicy> };
    }) => postEventCheerDiscountPolicy(eventCheerCampaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheer', 'campaign'] });
      onSuccess?.();
    },
    onError,
  });
};

export const putEventCheerDiscountPolicy = async (
  eventCheerCampaignId: string,
  eventCheerDiscountPolicyId: string,
  body: AdminUpdateEventCheerDiscountPolicyRequest,
) => {
  await authInstance.put(
    `/v1/shuttle-operation/admin/cheer/campaigns/${eventCheerCampaignId}/policies/${eventCheerDiscountPolicyId}`,
    silentParse(AdminUpdateEventCheerDiscountPolicyRequestSchema, body),
  );
};

export const usePutEventCheerDiscountPolicy = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventCheerCampaignId,
      eventCheerDiscountPolicyId,
      body,
    }: {
      eventCheerCampaignId: string;
      eventCheerDiscountPolicyId: string;
      body: AdminUpdateEventCheerDiscountPolicyRequest;
    }) =>
      putEventCheerDiscountPolicy(
        eventCheerCampaignId,
        eventCheerDiscountPolicyId,
        body,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheer', 'campaign'] });
      onSuccess?.();
    },
    onError,
  });
};
