'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { TrashIcon } from 'lucide-react';
import ImageFileInput from '@/components/input/ImageFileInput';
import RegionHubInputWithButton from '@/components/input/RegionHubInputWithButton';
import Input from '@/components/input/Input';
import { getEvent, usePostEvent } from '@/services/event.service';
import Form from '@/components/form/Form';
import {
  CreateEventRequest,
  EventType,
  EventTypeEnum,
} from '@/types/event.type';
import dayjs from 'dayjs';
import Toggle from '@/components/button/Toggle';
import { postShuttleDemandCoupon } from '@/utils/coupon.util';
import { RegionHubsViewEntity } from '@/types/hub.type';
import Button from '@/components/button/Button';
import Stringifier from '@/utils/stringifier.util';

interface FormValues {
  name: string;
  imageUrl: string;
  detailImageUrl: string | null;
  regionHub: RegionHubsViewEntity;
  type: EventType;
  dailyEvents: { date: string }[];
}

const defaultValues = {
  name: undefined,
  imageUrl: undefined,
  detailImageUrl: undefined,
  regionHub: undefined,
  type: undefined,
  dailyEvents: [],
};

const CreateEventForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  const { append: appendDaily, remove: removeDaily } =
    useFieldArray<FormValues>({
      control,
      name: 'dailyEvents',
    });

  const { mutateAsync: postEvent } = usePostEvent();

  const [isDemandCoupon, setIsDemandCoupon] = useState(true);

  const onSubmit = async (data: FormValues) => {
    if (!confirm('행사를 추가하시겠습니까?')) {
      return;
    }
    setIsSubmitting(true);

    try {
      const body: CreateEventRequest = {
        name: data.name,
        imageUrl: data.imageUrl,
        detailImageUrl: data.detailImageUrl || undefined,
        regionId: data.regionHub.regionId,
        regionHubId: data.regionHub.regionHubId,
        type: data.type,
        // NOTE: 현재 아티스트 추가 기능은 비활성화
        artistIds: [],
        isPinned: false,
        dailyEvents: data.dailyEvents.map((dailyEvent) => ({
          ...dailyEvent,
          // NOTE: 수요조사 종료 시간은 행사 시작 전 14일로 설정
          closeDeadline: dayjs(dailyEvent.date)
            .subtract(14, 'day')
            .toISOString(),
        })),
      };

      const eventId = await postEvent(body);
      const event = await getEvent(eventId);
      if (isDemandCoupon) {
        await postShuttleDemandCoupon(event);
      }
      alert('행사가 등록되었습니다.');
      router.push('/events');
    } catch (error) {
      console.error('Error creating events:', error);
      alert(
        '행사 등록에 실패했습니다, ' +
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
          <Form.label required>행사 이미지</Form.label>
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
          <Form.label>행사 상세 이미지</Form.label>
          <Controller
            control={control}
            name="detailImageUrl"
            render={({ field: { onChange, value } }) => (
              <ImageFileInput
                htmlFor="detailImageUrl"
                type="concerts"
                value={value || null}
                setValue={(url) => onChange(url || null)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>행사명</Form.label>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                value={value}
                placeholder="IP 문제로 공식 명칭을 지양해 주세요. (e.g. 2025 SVT 9th 캐럿랜드 → 세븐틴 팬미팅)"
                setValue={onChange}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>행사장</Form.label>
          <Controller
            control={control}
            name="regionHub"
            render={({ field: { onChange, value } }) => (
              <RegionHubInputWithButton
                hubUsageTypes={['EVENT_LOCATION']}
                regionHub={value}
                setRegionHub={onChange}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>날짜</Form.label>
          <Controller
            control={control}
            name="dailyEvents"
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-12">
                {value.map((dailyEvent, index) => {
                  const dateValue = dayjs(dailyEvent.date)
                    .tz('Asia/Seoul')
                    .format('YYYY-MM-DD');
                  return (
                    <div
                      key={`daily-event-${index}-${dailyEvent.date}`}
                      className="flex w-full flex-row items-center gap-8"
                    >
                      <Input
                        type="date"
                        className="w-full"
                        value={dateValue}
                        setValue={(str) => {
                          if (!str) {
                            return;
                          }
                          try {
                            const newDate = dayjs
                              .tz(str, 'Asia/Seoul')
                              .startOf('day')
                              .toISOString();
                            onChange(
                              value.map((item, i) =>
                                i === index ? { ...item, date: newDate } : item,
                              ),
                            );
                          } catch (error) {
                            console.error('Invalid date format:', error);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeDaily(index)}
                        className="flex h-[42px] w-[42px] items-center justify-center rounded-4 bg-basic-red-100 p-4 text-basic-red-400"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  size="large"
                  variant="tertiary"
                  onClick={() =>
                    appendDaily({
                      date: dayjs()
                        .tz('Asia/Seoul')
                        .startOf('day')
                        .toISOString(),
                    })
                  }
                  className="mt-12"
                >
                  추가하기
                </Button>
              </div>
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>타입</Form.label>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <div className="flex gap-8">
                {EventTypeEnum.options.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    size="large"
                    variant={value === type ? 'primary' : 'tertiary'}
                    onClick={() => onChange(type)}
                  >
                    {Stringifier.eventType(type)}
                  </Button>
                ))}
              </div>
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label required>수요조사 리워드 쿠폰</Form.label>
          <div>
            <Toggle
              value={isDemandCoupon}
              label="수요조사 리워드 쿠폰 생성하기"
              setValue={(v) => setIsDemandCoupon(v)}
            />
          </div>
        </Form.section>
        <Form.submitButton disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '행사 등록하기'}
        </Form.submitButton>
      </Form>
    </>
  );
};

export default CreateEventForm;
