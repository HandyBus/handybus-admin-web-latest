'use client';

import Form from '@/components/form/Form';
import EventInput from '@/components/input/EventInput';
import Input from '@/components/input/Input';
import NumberInput from '@/components/input/NumberInput';
import Heading from '@/components/text/Heading';
import { useGetCoupon, usePutCoupon } from '@/services/coupon.service';
import {
  AdminCouponsResponseModel,
  UpdateCouponRequest,
} from '@/types/coupon.type';
import { Radio } from '@headlessui/react';
import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

interface Props {
  params: {
    couponId: string;
  };
}

const Page = ({ params }: Props) => {
  const { couponId } = params;
  const { data: coupon } = useGetCoupon(couponId);
  return (
    <main>
      <Heading>쿠폰 수정하기</Heading>
      {coupon && <EditForm coupon={coupon} />}
    </main>
  );
};

export default Page;

interface FormProps {
  coupon: AdminCouponsResponseModel;
}

const EditForm = ({ coupon }: FormProps) => {
  const defaultValues = {
    name: coupon.name,
    maxApplicablePeople: coupon.maxApplicablePeople,
    maxCouponUsage: coupon.maxCouponUsage,
    isActive: coupon.isActive,
    allowedEventId: coupon.allowedEventId,
  } satisfies UpdateCouponRequest;

  const { control, handleSubmit } = useForm<UpdateCouponRequest>({
    defaultValues,
  });

  const { mutate: putCoupon, isPending } = usePutCoupon({
    onSuccess: () => {
      alert('쿠폰이 수정되었습니다.');
      router.push('/coupons');
    },
    onError: (error) => {
      console.error(error);
      alert('쿠폰 수정에 실패했습니다.');
    },
  });

  const router = useRouter();
  const onSubmit = async (data: UpdateCouponRequest) => {
    putCoupon({
      couponId: coupon.couponId,
      body: data,
    });
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.section>
        <Form.label required>이름</Form.label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input type="text" value={value} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>
          발행 개수
          <span className="text-12 text-basic-red-500">0일 경우 무한대</span>
        </Form.label>
        <Controller
          control={control}
          name="maxCouponUsage"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>
          한 예약 당 쿠폰 최대 적용 가능 인원
          <span className="text-12 text-basic-red-500">0일 경우 무한대</span>
        </Form.label>
        <Controller
          control={control}
          name="maxApplicablePeople"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>활성화 여부</Form.label>
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              value={value}
              onChange={onChange}
              className="flex flex-row gap-8"
            >
              <Radio
                value={true}
                className="group flex size-fit items-center justify-center rounded-lg bg-basic-white p-4 transition-transform hover:outline hover:outline-basic-blue-200 focus:outline focus:outline-basic-blue-200 active:scale-[0.9] data-[checked]:bg-basic-blue-400 data-[checked]:text-basic-white"
              >
                활성화
              </Radio>
              <Radio
                value={false}
                className="group flex size-fit items-center justify-center rounded-lg bg-basic-white p-4 transition-transform hover:outline hover:outline-basic-blue-200 focus:outline focus:outline-basic-blue-200 active:scale-[0.9] data-[checked]:bg-basic-blue-400 data-[checked]:text-basic-white"
              >
                비활성화
              </Radio>
            </RadioGroup>
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label>사용 가능 행사 제한</Form.label>
        <Controller
          control={control}
          name="allowedEventId"
          render={({ field: { onChange, value } }) => (
            <div className="flex w-full flex-col gap-8">
              <button
                onClick={() => onChange(null)}
                type="button"
                className="w-fit rounded-md border border-basic-grey-500 px-4 py-[2px] text-12 text-basic-grey-700"
              >
                사용 가능 행사 제한 해제하기
              </button>
              <EventInput
                value={value ?? null}
                setValue={(n) => onChange(n ?? null)}
              />
            </div>
          )}
        />
      </Form.section>
      <Form.submitButton disabled={isPending}>
        {isPending ? '수정중...' : '수정하기'}
      </Form.submitButton>
    </Form>
  );
};
