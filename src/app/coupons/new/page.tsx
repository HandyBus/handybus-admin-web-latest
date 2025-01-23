'use client';

import Input from '@/components/input/Input';
import NumberInput from '@/components/input/NumberInput';
import Heading from '@/components/text/Heading';
import { usePostCoupon } from '@/services/billing.service';
import { CreateCouponRequest } from '@/types/coupon.type';
import { Label, Radio } from '@headlessui/react';
import { Field } from '@headlessui/react';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  code: '',
  name: '',
  discountType: 'RATE',
  discountAmount: 0,
  discountRate: 0,
  maxDiscountAmount: 0,
  maxApplicablePeople: 0,
  maxCouponUsage: 0,
  validFrom: '',
  validTo: '',
} satisfies CreateCouponRequest;

const Page = () => {
  const { control, handleSubmit } = useForm<CreateCouponRequest>({
    defaultValues,
  });

  const { mutate: postCoupon } = usePostCoupon({
    onSuccess: () => {
      alert('쿠폰이 생성되었습니다.');
      if (confirm('쿠폰이 생성되었습니다. 목록으로 돌아가시겠습니까?')) {
        router.push('/coupons');
      }
    },
    onError: (error) => {
      console.error(error);
      alert('쿠폰 생성에 실패했습니다.');
    },
  });

  const router = useRouter();
  const onSubmit = async (data: CreateCouponRequest) => {
    postCoupon(data);
  };

  return (
    <main>
      <Heading>쿠폰 추가</Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-[500px] flex-col gap-8 py-20"
      >
        <label>
          쿠폰 코드{' '}
          <span className="text-12 text-red-500">
            쿠폰 코드는 중복될 수 없습니다.
          </span>
        </label>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <Input type="text" value={value} setValue={onChange} />
          )}
        />
        <label>이름</label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input type="text" value={value} setValue={onChange} />
          )}
        />
        <label>타입 선택</label>
        <Controller
          control={control}
          name="discountType"
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              value={value}
              className="flex flex-row gap-4"
              onChange={(type) => onChange(type)}
            >
              {['RATE', 'AMOUNT'].map((type) => (
                <Field key={type} className="gap-2 flex items-center">
                  <Radio
                    value={type}
                    className="group flex size-fit items-center justify-center rounded-lg bg-white p-4
                    transition-transform
                    hover:outline
                    hover:outline-blue-200
                    focus:outline
                    focus:outline-blue-200
                    active:scale-[0.9]
                    data-[checked]:bg-blue-400
                    data-[checked]:text-white
                    "
                  >
                    <CheckIcon
                      className="invisible group-data-[checked]:visible"
                      size={18}
                    />
                    <Label>{type === 'AMOUNT' ? '정량' : '비율'}</Label>
                  </Radio>
                </Field>
              ))}
            </RadioGroup>
          )}
        />
        <label>비율 시 할인 비율</label>
        <Controller
          control={control}
          name="discountRate"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
        <label>정량 시 할인 값</label>
        <Controller
          control={control}
          name="discountAmount"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
        <label>비율 할인 시 최대 정량적 할인 값</label>
        <Controller
          control={control}
          name="maxDiscountAmount"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value ?? 0} setValue={onChange} />
          )}
        />
        <label>발행 개수</label>
        <Controller
          control={control}
          name="maxCouponUsage"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value} setValue={onChange} />
          )}
        />
        <label>최대 허용 가능 인원</label>
        <Controller
          control={control}
          name="maxApplicablePeople"
          render={({ field: { onChange, value } }) => (
            <NumberInput value={value} setValue={onChange} />
          )}
        />
        <label>유효 기간</label>
        <div className="flex flex-row gap-4">
          <Controller
            control={control}
            name="validFrom"
            render={({ field: { onChange, value } }) => (
              <Input type="date" value={value} setValue={onChange} />
            )}
          />
          <Controller
            control={control}
            name="validTo"
            render={({ field: { onChange, value } }) => (
              <Input type="date" value={value} setValue={onChange} />
            )}
          />
        </div>
        <button
          type="submit"
          className="my-20 rounded-lg bg-primary-main py-8 font-700 text-white"
        >
          생성하기
        </button>
      </form>
    </main>
  );
};

export default Page;
