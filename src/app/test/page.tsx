'use client';

import { usePostCompleteRefundRequest } from '@/services/payment.service';

const Page = () => {
  const { mutateAsync: postCompleteRefundRequest } =
    usePostCompleteRefundRequest();

  const handleClick = async () => {
    await postCompleteRefundRequest({
      paymentId: '618723019149284505',
      refundRequestId: '620049328211236171',
      body: {
        refundAmount: 9000,
      },
    });
  };
  return (
    <div>
      <button onClick={handleClick}>Test</button>
    </div>
  );
};

export default Page;
