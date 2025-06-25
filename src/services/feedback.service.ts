import { useQuery } from '@tanstack/react-query';
import { authInstance } from './config';
import { AdminFeedbackResponseModelSchema } from '@/types/feedback.type';

const getFeedbacks = async () => {
  const res = await authInstance.post('/v1/core/admin/feedbacks', undefined, {
    shape: {
      feedbacks: AdminFeedbackResponseModelSchema.array(),
    },
  });
  return res.feedbacks;
};

export const useGetFeedbacks = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: getFeedbacks,
  });
};
