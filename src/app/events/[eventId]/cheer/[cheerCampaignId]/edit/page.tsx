'use client';

import { useCallback, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { TrashIcon } from 'lucide-react';
import ImageFileInput from '@/components/input/ImageFileInput';
import Input from '@/components/input/Input';
import {
  useGetEventCheerCampaign,
  usePutEventCheerCampaign,
  usePutEventCheerDiscountPolicy,
  usePostEventCheerDiscountPolicy,
} from '@/services/cheer.service';
import Form from '@/components/form/Form';
import {
  AdminUpdateEventCheerCampaignRequest,
  AdminUpdateEventCheerDiscountPolicyRequest,
  AdminCreateEventCheerDiscountPolicy,
  EventCheerCampaignsViewEntity,
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
    eventCheerDiscountPolicyId?: string;
    minParticipationCount: number;
    discountRate: number;
    isActive: boolean;
  }[];
}

interface Props {
  params: {
    eventId: string;
    cheerCampaignId: string;
  };
}

const Page = ({ params }: Props) => {
  const { cheerCampaignId } = params;
  const {
    data: cheerCampaign,
    isLoading,
    isError,
    error,
  } = useGetEventCheerCampaign(cheerCampaignId);

  return (
    <>
      <Heading>응원 캠페인 수정하기</Heading>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error?.message}</div>}
      {cheerCampaign && (
        <EditCheerCampaignForm
          cheerCampaign={cheerCampaign}
          eventId={params.eventId}
        />
      )}
    </>
  );
};

export default Page;

interface EditCheerCampaignFormProps {
  cheerCampaign: EventCheerCampaignsViewEntity;
  eventId: string;
}

const EditCheerCampaignForm = ({
  cheerCampaign,
  eventId,
}: EditCheerCampaignFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: FormValues = {
    imageUrl: cheerCampaign.imageUrl,
    buttonImageUrl: cheerCampaign.buttonImageUrl,
    buttonText: cheerCampaign.buttonText,
    endDate: cheerCampaign.endDate,
    discountPolicies:
      cheerCampaign.discountPolicies?.map((policy) => ({
        eventCheerDiscountPolicyId: policy.eventCheerDiscountPolicyId,
        minParticipationCount: policy.minParticipationCount,
        discountRate: policy.discountRate,
        isActive: policy.isActive,
      })) || [],
  };

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  const {
    fields: discountPolicyFields,
    append: appendDiscountPolicy,
    remove: removeDiscountPolicy,
  } = useFieldArray<FormValues>({
    control,
    name: 'discountPolicies',
  });

  const { mutateAsync: putEventCheerCampaign } = usePutEventCheerCampaign();
  const { mutateAsync: putEventCheerDiscountPolicy } =
    usePutEventCheerDiscountPolicy();
  const { mutateAsync: postEventCheerDiscountPolicy } =
    usePostEventCheerDiscountPolicy();

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!confirm('응원 캠페인을 수정하시겠습니까?')) {
        return;
      }
      setIsSubmitting(true);

      try {
        // 1. Cheer Campaign 수정
        const campaignBody: AdminUpdateEventCheerCampaignRequest = {
          imageUrl: data.imageUrl || undefined,
          buttonImageUrl: data.buttonImageUrl || undefined,
          buttonText: data.buttonText || undefined,
          endDate: data.endDate
            ? dayjs(data.endDate).tz('Asia/Seoul').endOf('day').toISOString()
            : undefined,
        };

        await putEventCheerCampaign({
          eventCheerCampaignId: cheerCampaign.eventCheerCampaignId,
          body: campaignBody,
        });

        // 2. Discount Policies 처리
        // 기존 정책과 새 정책을 구분하여 처리
        const existingPolicies = data.discountPolicies.filter(
          (policy) => policy.eventCheerDiscountPolicyId,
        );
        const newPolicies = data.discountPolicies.filter(
          (policy) => !policy.eventCheerDiscountPolicyId,
        );

        // 기존 정책 수정
        await Promise.all(
          existingPolicies.map((policy) => {
            const policyBody: AdminUpdateEventCheerDiscountPolicyRequest = {
              minParticipationCount: policy.minParticipationCount,
              discountRate: policy.discountRate,
              isActive: policy.isActive,
            };
            return putEventCheerDiscountPolicy({
              eventCheerCampaignId: cheerCampaign.eventCheerCampaignId,
              eventCheerDiscountPolicyId: policy.eventCheerDiscountPolicyId!,
              body: policyBody,
            });
          }),
        );

        // 새 정책 추가
        if (newPolicies.length > 0) {
          const policiesToCreate: Array<AdminCreateEventCheerDiscountPolicy> =
            newPolicies.map((policy) => ({
              minParticipationCount: policy.minParticipationCount,
              discountRate: policy.discountRate,
              isActive: policy.isActive,
            }));
          await postEventCheerDiscountPolicy({
            eventCheerCampaignId: cheerCampaign.eventCheerCampaignId,
            body: { policies: policiesToCreate },
          });
        }

        alert('응원 캠페인이 수정되었습니다.');
        router.push(
          `/events/${eventId}/cheer/${cheerCampaign.eventCheerCampaignId}`,
        );
      } catch (error) {
        console.error('Error updating cheer campaign:', error);
        alert(
          '응원 캠페인 수정에 실패했습니다, ' +
            (error instanceof Error && error.message),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      cheerCampaign,
      eventId,
      putEventCheerCampaign,
      putEventCheerDiscountPolicy,
      postEventCheerDiscountPolicy,
      router,
    ],
  );

  return (
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
        <Form.label>종료 날짜</Form.label>
        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => {
            const dateValue = value
              ? dayjs(value).tz('Asia/Seoul').format('YYYY-MM-DD')
              : '';
            return (
              <Input
                type="date"
                value={dateValue}
                setValue={(str) => {
                  if (!str) {
                    onChange(null);
                    return;
                  }
                  try {
                    const newDate = dayjs
                      .tz(str, 'Asia/Seoul')
                      .endOf('day')
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
                          value[index]?.minParticipationCount?.toString() || ''
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
        {isSubmitting ? '수정 중...' : '수정하기'}
      </Form.submitButton>
    </Form>
  );
};
