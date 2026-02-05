'use client';

import { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { TrashIcon } from 'lucide-react';
import ImageFileInput from '@/components/input/ImageFileInput';
import RegionHubInputWithButton from '@/components/input/RegionHubInputWithButton';
import Input from '@/components/input/Input';
import { usePostEvent } from '@/services/event.service';
import Form from '@/components/form/Form';
import {
  CreateEventRequest,
  EventType,
  EventTypeEnum,
} from '@/types/event.type';
import dayjs from 'dayjs';
import { RegionHubsViewEntity } from '@/types/hub.type';
import Button from '@/components/button/Button';
import Stringifier from '@/utils/stringifier.util';
import ArtistInput from '@/components/input/ArtistInput';
import NewArtistsModal from '@/components/modal/NewArtistsModal';

interface FormValues {
  name: string;
  imageUrl: string;
  detailImageUrl: string | null;
  regionHub: RegionHubsViewEntity;
  type: EventType;
  dailyEvents: { dailyEventDate: string }[];
  artistIds: { artistId: string }[];
  demandControlMode: 'AUTO' | 'MANUAL';
  demandAutoOpenAt: string | undefined;
  demandAutoCloseAt: string | undefined;
  manualDemandOpen: boolean | undefined;
}

const defaultValues = {
  name: undefined,
  imageUrl: undefined,
  detailImageUrl: undefined,
  regionHub: undefined,
  type: undefined,
  dailyEvents: [],
  artistIds: [],
  demandControlMode: 'MANUAL' as const,
  demandAutoOpenAt: undefined,
  demandAutoCloseAt: undefined,
  manualDemandOpen: false,
};

const CreateEventForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  const demandControlMode = useWatch({
    control,
    name: 'demandControlMode',
  });

  const { append: appendDaily, remove: removeDaily } =
    useFieldArray<FormValues>({
      control,
      name: 'dailyEvents',
    });

  const {
    fields: artistFields,
    append: appendArtist,
    remove: removeArtist,
  } = useFieldArray<FormValues>({
    control,
    name: 'artistIds',
  });

  const [artistModalStates, setArtistModalStates] = useState<
    Record<number, boolean>
  >({});

  const { mutateAsync: postEvent } = usePostEvent();

  const onSubmit = async (data: FormValues) => {
    if (!confirm('행사를 추가하시겠습니까?')) {
      return;
    }
    setIsSubmitting(true);

    if (data.demandControlMode === 'AUTO') {
      if (!data.demandAutoOpenAt || !data.demandAutoCloseAt) {
        alert(
          '수요조사 자동 모드에서는 시작일시와 마감일시를 모두 입력해야 합니다.',
        );
        setIsSubmitting(false);
        return;
      }

      if (!dayjs(data.demandAutoOpenAt).isBefore(data.demandAutoCloseAt)) {
        alert('수요조사 시작일시는 마감일시보다 빨라야 합니다.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const body: CreateEventRequest = {
        name: data.name,
        imageUrl: data.imageUrl,
        detailImageUrl: data.detailImageUrl || undefined,
        regionId: data.regionHub.regionId,
        regionHubId: data.regionHub.regionHubId,
        type: data.type,
        artistIds: data.artistIds
          .map((item) => item.artistId)
          .filter((id) => id !== null && id !== ''),
        isPinned: false,
        dailyEvents: data.dailyEvents.map((dailyEvent) => ({
          date: dailyEvent.dailyEventDate,
          demandControlMode: data.demandControlMode,
          demandAutoOpenAt:
            data.demandControlMode === 'AUTO'
              ? data.demandAutoOpenAt
              : undefined,
          demandAutoCloseAt:
            data.demandControlMode === 'AUTO'
              ? data.demandAutoCloseAt
              : undefined,
          manualDemandOpen:
            data.demandControlMode === 'MANUAL'
              ? data.manualDemandOpen
              : undefined,
        })),
      };

      await postEvent(body);

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
                  const dateValue = dayjs(dailyEvent.dailyEventDate)
                    .tz('Asia/Seoul')
                    .format('YYYY-MM-DD');
                  return (
                    <div
                      key={`daily-event-${index}-${dailyEvent.dailyEventDate}`}
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
                                i === index
                                  ? { ...item, dailyEventDate: newDate }
                                  : item,
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
                      dailyEventDate: dayjs()
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
          <Form.label required>수요조사 설정</Form.label>
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="demandControlMode"
              render={({ field: { onChange, value } }) => (
                <div className="flex w-full gap-4">
                  {(['AUTO', 'MANUAL'] as const).map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      size="medium"
                      variant={value === mode ? 'primary' : 'tertiary'}
                      onClick={() => {
                        onChange(mode);
                      }}
                      className="flex-1"
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              )}
            />

            <div className="flex w-full flex-col gap-4">
              <div className="gap-2 flex flex-col">
                <span className="text-12 font-600 text-basic-grey-500">
                  시작일시
                </span>
                <Controller
                  control={control}
                  name="demandAutoOpenAt"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type="datetime-local"
                      disabled={demandControlMode === 'MANUAL'}
                      value={
                        value
                          ? dayjs(value)
                              .tz('Asia/Seoul')
                              .format('YYYY-MM-DDTHH:mm')
                          : ''
                      }
                      setValue={(str) =>
                        onChange(dayjs.tz(str, 'Asia/Seoul').toISOString())
                      }
                      className={
                        demandControlMode === 'MANUAL' ? 'opacity-50' : ''
                      }
                    />
                  )}
                />
              </div>
              <div className="gap-2 flex flex-col">
                <span className="text-12 font-600 text-basic-grey-500">
                  마감일시
                </span>
                <Controller
                  control={control}
                  name="demandAutoCloseAt"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type="datetime-local"
                      disabled={demandControlMode === 'MANUAL'}
                      value={
                        value
                          ? dayjs(value)
                              .tz('Asia/Seoul')
                              .format('YYYY-MM-DDTHH:mm')
                          : ''
                      }
                      setValue={(str) =>
                        onChange(dayjs.tz(str, 'Asia/Seoul').toISOString())
                      }
                      className={
                        demandControlMode === 'MANUAL' ? 'opacity-50' : ''
                      }
                    />
                  )}
                />
              </div>
            </div>

            {demandControlMode === 'MANUAL' && (
              <div className="flex flex-col gap-4">
                <span className="text-12 font-600 text-basic-grey-500">
                  수요조사 열림/닫힘 설정
                </span>
                <Controller
                  control={control}
                  name="manualDemandOpen"
                  render={({ field: { onChange, value } }) => (
                    <div className="flex w-full gap-4">
                      <Button
                        type="button"
                        size="small"
                        variant={value ? 'primary' : 'tertiary'}
                        onClick={() => onChange(true)}
                        className="flex-1"
                      >
                        열림
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        variant={!value ? 'primary' : 'tertiary'}
                        onClick={() => onChange(false)}
                        className="flex-1"
                      >
                        닫힘
                      </Button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </Form.section>
        <Form.section>
          <Form.label>아티스트</Form.label>
          <Controller
            control={control}
            name="artistIds"
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-12">
                {artistFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex w-full flex-row items-center gap-8"
                  >
                    <div className="w-full">
                      <ArtistInput
                        value={value[index]?.artistId || null}
                        setValue={(artistId) => {
                          const newArtistIds = [...value];
                          newArtistIds[index] = { artistId: artistId || '' };
                          onChange(newArtistIds);
                        }}
                        modalState={{
                          isOpen: artistModalStates[index] || false,
                          setIsOpen: (isOpen) => {
                            setArtistModalStates((prev) => ({
                              ...prev,
                              [index]: isOpen,
                            }));
                          },
                        }}
                      />
                      <NewArtistsModal
                        isOpen={artistModalStates[index] || false}
                        setIsOpen={(isOpen) => {
                          setArtistModalStates((prev) => ({
                            ...prev,
                            [index]: isOpen,
                          }));
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeArtist(index);
                        const newModalStates = { ...artistModalStates };
                        delete newModalStates[index];
                        setArtistModalStates(newModalStates);
                      }}
                      className="flex h-[42px] w-[42px] items-center justify-center rounded-4 bg-basic-red-100 p-4 text-basic-red-400"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="large"
                  variant="tertiary"
                  onClick={() => {
                    appendArtist({ artistId: '' });
                    setArtistModalStates((prev) => ({
                      ...prev,
                      [artistFields.length]: false,
                    }));
                  }}
                  className="mt-12"
                >
                  아티스트 추가하기
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
        <Form.submitButton disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '행사 등록하기'}
        </Form.submitButton>
      </Form>
    </>
  );
};

export default CreateEventForm;
