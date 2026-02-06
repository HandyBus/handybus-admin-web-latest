'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { TrashIcon } from 'lucide-react';
import ImageFileInput from '@/components/input/ImageFileInput';
import Input from '@/components/input/Input';
import {
  usePostEventCheerCampaign,
  usePostEventCheerDiscountPolicy,
  getEventCheerCampaignByEventId,
} from '@/services/cheer.service';
import Form from '@/components/form/Form';
import {
  AdminCreateEventCheerCampaignRequest,
  AdminCreateEventCheerDiscountPolicy,
} from '@/types/cheer.type';
import dayjs from 'dayjs';
import Button from '@/components/button/Button';
import Heading from '@/components/text/Heading';

interface FormValues {
  imageUrl: string | null;
  buttonImageUrl: string | null;
  buttonText: string | null;
  endDate: string | null;
  discountPolicies: {
    minParticipationCount: number;
    discountRate: number;
    isActive: boolean;
  }[];
}

const getDefaultValues = (): FormValues => {
  const tomorrow = dayjs().tz('Asia/Seoul').add(1, 'day').startOf('day');
  return {
    imageUrl: null,
    buttonImageUrl: null,
    buttonText: null,
    endDate: tomorrow.toISOString(),
    discountPolicies: [],
  };
};

interface Props {
  params: { eventId: string };
}

const CreateCheerCampaignForm = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: getDefaultValues(),
  });

  const {
    fields: discountPolicyFields,
    append: appendDiscountPolicy,
    remove: removeDiscountPolicy,
  } = useFieldArray<FormValues>({
    control,
    name: 'discountPolicies',
  });

  const { mutateAsync: postEventCheerCampaign } = usePostEventCheerCampaign();
  const { mutateAsync: postEventCheerDiscountPolicy } =
    usePostEventCheerDiscountPolicy();

  const onSubmit = async (data: FormValues) => {
    if (!confirm('응원 캠페인을 추가하시겠습니까?')) {
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Cheer Campaign 생성
      const campaignBody: AdminCreateEventCheerCampaignRequest = {
        eventId,
        imageUrl: data.imageUrl || undefined,
        buttonImageUrl: data.buttonImageUrl || undefined,
        buttonText: data.buttonText || undefined,
        endDate: data.endDate
          ? dayjs(data.endDate).tz('Asia/Seoul').toISOString()
          : undefined,
      };

      await postEventCheerCampaign(campaignBody);

      // 2. 생성된 Campaign 조회하여 campaignId 가져오기
      const campaign = await getEventCheerCampaignByEventId(eventId);
      const eventCheerCampaignId = campaign.eventCheerCampaignId;

      // 3. Discount Policies 생성
      if (data.discountPolicies.length > 0) {
        const policies: Array<AdminCreateEventCheerDiscountPolicy> =
          data.discountPolicies.map((discountPolicy) => ({
            minParticipationCount: discountPolicy.minParticipationCount,
            discountRate: discountPolicy.discountRate,
            isActive: discountPolicy.isActive,
          }));
        await postEventCheerDiscountPolicy({
          eventCheerCampaignId,
          body: { policies },
        });
      }

      alert('응원 캠페인이 등록되었습니다.');
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error('Error creating cheer campaign:', error);
      alert(
        '응원 캠페인 등록에 실패했습니다, ' +
          (error instanceof Error && error.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.section>
          <Form.label>캠페인 이미지</Form.label>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <ImageFileInput
                htmlFor="imageUrl"
                type="concerts"
                value={value || null}
                setValue={(url) => onChange(url || null)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>버튼 이미지</Form.label>
          <Controller
            control={control}
            name="buttonImageUrl"
            render={({ field: { onChange, value } }) => (
              <ImageFileInput
                htmlFor="buttonImageUrl"
                type="concerts"
                value={value || null}
                setValue={(url) => onChange(url || null)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>버튼 텍스트</Form.label>
          <Controller
            control={control}
            name="buttonText"
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                value={value || ''}
                placeholder="버튼에 표시될 텍스트를 입력하세요"
                setValue={onChange}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>종료 날짜 및 시간</Form.label>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, value } }) => {
              const dateTimeValue = value
                ? dayjs(value).tz('Asia/Seoul').format('YYYY-MM-DDTHH:00')
                : '';
              return (
                <Input
                  type="datetime-local"
                  step="3600"
                  value={dateTimeValue}
                  setValue={(str) => {
                    if (!str) {
                      onChange(null);
                      return;
                    }
                    try {
                      // 분을 00으로 고정
                      const dateWithMinuteZero = str.replace(/:\d{2}$/, ':00');
                      const newDate = dayjs
                        .tz(dateWithMinuteZero, 'Asia/Seoul')
                        .toISOString();
                      onChange(newDate);
                    } catch (error) {
                      console.error('Invalid date format:', error);
                    }
                  }}
                />
              );
            }}
          />
        </Form.section>
        <Form.section>
          <Form.label>할인 정책</Form.label>
          <Controller
            control={control}
            name="discountPolicies"
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-12">
                {discountPolicyFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex w-full flex-col gap-8 rounded-8 border border-basic-grey-200 p-16"
                  >
                    <div className="flex w-full flex-row items-center gap-8">
                      <div className="flex-1">
                        <label className="mb-4 block text-14 font-500 text-basic-grey-700">
                          최소 참여 수
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            value[index]?.minParticipationCount?.toString() ||
                            ''
                          }
                          placeholder="최소 참여 수"
                          setValue={(str) => {
                            const newPolicies = [...value];
                            newPolicies[index] = {
                              ...newPolicies[index],
                              minParticipationCount: parseInt(str, 10) || 0,
                            };
                            onChange(newPolicies);
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-4 block text-14 font-500 text-basic-grey-700">
                          할인율 (%)
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={value[index]?.discountRate?.toString() || ''}
                          placeholder="할인율 (%)"
                          setValue={(str) => {
                            const newPolicies = [...value];
                            newPolicies[index] = {
                              ...newPolicies[index],
                              discountRate: parseFloat(str) || 0,
                            };
                            onChange(newPolicies);
                          }}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeDiscountPolicy(index)}
                          className="flex h-[42px] w-[42px] items-center justify-center rounded-4 bg-basic-red-100 p-4 text-basic-red-400"
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <input
                        type="checkbox"
                        id={`isActive-${index}`}
                        checked={value[index]?.isActive ?? true}
                        onChange={(e) => {
                          const newPolicies = [...value];
                          newPolicies[index] = {
                            ...newPolicies[index],
                            isActive: e.target.checked,
                          };
                          onChange(newPolicies);
                        }}
                        className="h-16 w-16 rounded-4 border border-basic-grey-300"
                      />
                      <label
                        htmlFor={`isActive-${index}`}
                        className="text-14 font-500 text-basic-grey-700"
                      >
                        활성화
                      </label>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  size="large"
                  variant="tertiary"
                  onClick={() =>
                    appendDiscountPolicy({
                      minParticipationCount: 0,
                      discountRate: 0,
                      isActive: true,
                    })
                  }
                  className="mt-12"
                >
                  할인 정책 추가하기
                </Button>
              </div>
            )}
          />
        </Form.section>
        <Form.submitButton disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '응원 캠페인 등록하기'}
        </Form.submitButton>
      </Form>
    </>
  );
};

const Page = ({ params }: Props) => {
  const { eventId } = params;

  return (
    <>
      <Heading>응원 캠페인 생성하기</Heading>
      <CreateCheerCampaignForm eventId={eventId} />
    </>
  );
};

export default Page;
