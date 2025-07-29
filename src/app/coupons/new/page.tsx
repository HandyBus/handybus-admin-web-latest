'use client';

import Form from '@/components/form/Form';
import EventInput from '@/components/input/EventInput';
import Input from '@/components/input/Input';
import NumberInput from '@/components/input/NumberInput';
import Heading from '@/components/text/Heading';
import { usePostCoupon } from '@/services/coupon.service';
import { CreateCouponRequest } from '@/types/coupon.type';
import { Label, Radio } from '@headlessui/react';
import { Field } from '@headlessui/react';
import { RadioGroup } from '@headlessui/react';
import dayjs from 'dayjs';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

const DEFAULT_VALUES = {
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
  allowedEventId: null,
  issueType: 'CODE_INPUT',
  processingStrategy: 'ONCE_PER_ACCOUNT',
  validityStartStrategy: 'FIXED_DATE',
  validityEndStrategy: 'FIXED_DATE',
} satisfies CreateCouponRequest;

const Page = () => {
  const { control, handleSubmit } = useForm<CreateCouponRequest>({
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate: postCoupon, isPending } = usePostCoupon({
    onSuccess: () => {
      alert('쿠폰이 생성되었습니다.');
      router.push('/coupons');
    },
    onError: (error) => {
      console.error(error);
      alert('쿠폰 생성에 실패했습니다.');
    },
  });

  const router = useRouter();
  const onSubmit = async (data: CreateCouponRequest) => {
    postCoupon({
      ...data,
      validFrom: dayjs(data.validFrom).toISOString(),
      validTo: dayjs(data.validTo).toISOString(),
    });
  };

  return (
    <main>
      <Heading>쿠폰 추가</Heading>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.section>
          <Form.label required>
            쿠폰 코드
            <span className="text-12 text-red-500">
              쿠폰 코드는 중복될 수 없습니다.
            </span>
          </Form.label>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <Input type="text" value={value} setValue={onChange} />
            )}
          />
        </Form.section>
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
            타입 선택
            <span className="text-12 text-red-500">
              선택한 타입에 따라 아래 필드를 알맞게 채워주세요.
            </span>
          </Form.label>
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
                      className="group flex size-fit items-center justify-center rounded-lg bg-white p-4 transition-transform hover:outline hover:outline-blue-200 focus:outline focus:outline-blue-200 active:scale-[0.9] data-[checked]:bg-blue-400 data-[checked]:text-white"
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
        </Form.section>
        <Form.section>
          <Form.label>
            <span>
              <span className="text-blue-600">[비율]</span> 할인 비율
            </span>
            <span className="text-12 text-red-500">
              할인 비율은 0 이상 100 이하의 값이어야 합니다.
            </span>
          </Form.label>
          <Controller
            control={control}
            name="discountRate"
            render={({ field: { onChange, value } }) => (
              <NumberInput value={value ?? 0} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>
            <span className="text-blue-600">[비율]</span> 최대 정량적 할인 값
            <span className="text-12 text-red-500">비율 선택 시 필수 입력</span>
          </Form.label>
          <Controller
            control={control}
            name="maxDiscountAmount"
            render={({ field: { onChange, value } }) => (
              <NumberInput value={value ?? 0} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>
            <span className="text-primary-700">[정량]</span> 할인 값
            <span className="text-12 text-red-500">정량 선택 시 필수 입력</span>
          </Form.label>
          <Controller
            control={control}
            name="discountAmount"
            render={({ field: { onChange, value } }) => (
              <NumberInput value={value ?? 0} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>
            발행 개수
            <span className="text-12 text-red-500">0일 경우 무한대</span>
          </Form.label>
          <Controller
            control={control}
            name="maxCouponUsage"
            render={({ field: { onChange, value } }) => (
              <NumberInput value={value} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>
            한 예약 당 쿠폰 최대 적용 가능 인원
            <span className="text-12 text-red-500">0일 경우 무한대</span>
          </Form.label>
          <Controller
            control={control}
            name="maxApplicablePeople"
            render={({ field: { onChange, value } }) => (
              <NumberInput value={value} setValue={onChange} />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>유효 기간</Form.label>
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
                  className="w-fit rounded-md border border-grey-500 px-4 py-[2px] text-12 text-grey-700"
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
          {isPending ? '생성중...' : '생성하기'}
        </Form.submitButton>
      </Form>
    </main>
  );
};

export default Page;
