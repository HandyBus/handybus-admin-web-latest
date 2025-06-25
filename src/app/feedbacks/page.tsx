'use client';

import { useGetFeedbacks } from '@/services/feedback.service';

const Page = () => {
  const { data: feedbacks } = useGetFeedbacks();
  console.log(feedbacks);
  return <div>{feedbacks?.map((feedback) => feedback.subject)}</div>;
};

export default Page;
