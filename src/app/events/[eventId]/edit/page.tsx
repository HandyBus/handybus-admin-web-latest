'use client';

import { useCallback, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { ArrowBigRight, XIcon, TrashIcon } from 'lucide-react';
import ImageFileInput from '@/components/input/ImageFileInput';
import RegionHubInputWithButton from '@/components/input/RegionHubInputWithButton';
import Input from '@/components/input/Input';
import dayjs from 'dayjs';
import { useGetEvent, usePutEvent } from '@/services/event.service';
import Form from '@/components/form/Form';
import {
  EventDailyShuttlesInEventsViewEntity,
  EventStatus,
  EventStatusEnum,
  EventsViewEntity,
  EventType,
  EventTypeEnum,
  UpdateEventRequest,
} from '@/types/event.type';
import Heading from '@/components/text/Heading';
import Stringifier from '@/utils/stringifier.util';
import Callout from '@/components/text/Callout';
import Button from '@/components/button/Button';
import { RegionHubsViewEntity } from '@/types/hub.type';
import ArtistInput from '@/components/input/ArtistInput';
import NewArtistsModal from '@/components/modal/NewArtistsModal';

interface FormValues {
  status: EventStatus;
  name: string;
  imageUrl: string | undefined;
  detailImageUrl: string | null;
  regionHub: RegionHubsViewEntity;
  dailyEvents: EventDailyShuttlesInEventsViewEntity[];
  type: EventType;
  artistIds: { artistId: string }[];
  demandControlMode: 'AUTO' | 'MANUAL';
  demandAutoOpenAt: string | undefined;
  demandAutoCloseAt: string | undefined;
  manualDemandOpen: boolean | undefined;
}

interface Props {
  params: { eventId: string };
}

const EditEventPage = ({ params }: Props) => {
  const { eventId } = params;
  const { data: event, isLoading, isError, error } = useGetEvent(eventId);

  return (
    <>
      <Heading>행사 수정하기</Heading>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error?.message}</div>}
      {event && <EditEventForm event={event} />}
    </>
  );
};

export default EditEventPage;

interface EditEventFormProps {
  event: EventsViewEntity;
}

const EditEventForm = ({ event }: EditEventFormProps) => {
  const router = useRouter();

  const defaultValues = {
    status: event?.eventStatus,
    name: event?.eventName,
    imageUrl: event?.eventImageUrl,
    detailImageUrl: event?.eventDetailImageUrl,
    regionHub: {
      regionId: event?.regionId,
      regionHubId: event?.regionHubId,
      name: event?.eventLocationName,
      address: event?.eventLocationAddress,
      latitude: event?.eventLocationLatitude,
      longitude: event?.eventLocationLongitude,
      eventLocation: true,
      eventParkingLot: false,
      shuttleHub: false,
      handyParty: false,
    },
    type: event?.eventType,
    dailyEvents:
      event?.dailyEvents.map((dailyEvent) => ({
        dailyEventId: dailyEvent.dailyEventId,
        dailyEventDate: dailyEvent.dailyEventDate,
        dailyEventStatus: dailyEvent.dailyEventStatus,
        dailyEventMetadata: dailyEvent.dailyEventMetadata,
      })) ?? [],
    artistIds:
      event?.eventArtists?.map((artist) => ({ artistId: artist.artistId })) ??
      [],
    demandControlMode:
      event?.dailyEvents?.[0]?.dailyEventDemandControlMode ?? 'MANUAL',
    demandAutoOpenAt:
      event?.dailyEvents?.[0]?.dailyEventDemandAutoOpenAt ?? undefined,
    demandAutoCloseAt:
      event?.dailyEvents?.[0]?.dailyEventDemandAutoCloseAt ?? undefined,
    manualDemandOpen:
      event?.dailyEvents?.[0]?.dailyEventManualDemandOpen ?? false,
  };

  const previousDailyEvents = event?.dailyEvents?.map((dailyEvent) => ({
    dailyEventStatus: dailyEvent.dailyEventStatus,
    dailyEventId: dailyEvent.dailyEventId,
    dailyEventDate: dayjs(
      dailyEvent.dailyEventDate,
      'Asia/Seoul',
    ).toISOString(),
  }));

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  const {
    fields: dailyFields,
    append: appendDaily,
    remove: removeDaily,
  } = useFieldArray<FormValues>({
    control,
    name: 'dailyEvents',
  });

  const demandControlMode = useWatch({
    control,
    name: 'demandControlMode',
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

  const { mutate: putEvent } = usePutEvent({
    onSuccess: () => {
      alert('행사가 수정되었습니다.');
      router.push(`/events`);
    },
    onError: (error) => {
      console.error('Error editing events:', error);
      alert(
        '행사 수정에 실패했습니다, ' +
          (error instanceof Error && error.message),
      );
    },
  });

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (!confirm('행사를 수정하시겠습니까?')) {
        return;
      }

      if (data.demandControlMode === 'AUTO') {
        if (!data.demandAutoOpenAt || !data.demandAutoCloseAt) {
          alert(
            '수요조사 자동 모드에서는 시작일시와 마감일시를 모두 입력해야 합니다.',
          );
          return;
        }

        if (!dayjs(data.demandAutoOpenAt).isBefore(data.demandAutoCloseAt)) {
          alert('수요조사 시작일시는 마감일시보다 빨라야 합니다.');
          return;
        }
      }

      const body: UpdateEventRequest = {
        ...data,
        imageUrl: data.imageUrl || undefined,
        detailImageUrl: data.detailImageUrl || null,
        regionId: data.regionHub.regionId,
        regionHubId: data.regionHub.regionHubId,
        artistIds: data.artistIds
          .map((item) => item.artistId)
          .filter((id) => id !== null && id !== ''),
        dailyEvents: data.dailyEvents.map((dailyEvent) => {
          return {
            ...dailyEvent,
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
          };
        }),
      };
      putEvent({ eventId: event.eventId, body });
    },
    [event, putEvent],
  );

  return (
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
        <div className="flex gap-4">
          <div className="flex w-full flex-col gap-4">
            {previousDailyEvents?.map((dailyEvent) => (
              <div
                key={dailyEvent.dailyEventId}
                className="flex w-full items-center gap-4"
              >
                <Input
                  type="date"
                  value={dayjs(dailyEvent.dailyEventDate)
                    .tz('Asia/Seoul')
                    .startOf('day')
                    .format('YYYY-MM-DD')}
                  className="w-full"
                  disabled={true}
                />
                <ArrowBigRight />
              </div>
            ))}
          </div>
          <div className="flex w-full flex-col gap-4">
            {dailyFields.map((field, index) => (
              <Controller
                key={field.id}
                control={control}
                name={`dailyEvents.${index}` as const}
                render={({ field: { onChange, value } }) => (
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row items-center gap-8">
                      <Input
                        type="date"
                        className="w-full"
                        defaultValue={dayjs(value.dailyEventDate)
                          .tz('Asia/Seoul')
                          .startOf('day')
                          .format('YYYY-MM-DD')}
                        setValue={(str) => {
                          if (!str) {
                            return;
                          }
                          try {
                            const newDate = dayjs
                              .tz(str, 'Asia/Seoul')
                              .startOf('day')
                              .toISOString();
                            onChange({
                              ...value,
                              date: newDate,
                            });
                          } catch (error) {
                            console.error('Invalid date format:', error);
                          }
                        }}
                      />
                      {!value.dailyEventId && (
                        <button
                          type="button"
                          onClick={() => removeDaily(index)}
                          className="flex h-[42px] w-[42px] items-center justify-center rounded-4 bg-basic-red-100 p-4 text-basic-red-400"
                        >
                          <XIcon size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              />
            ))}
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
        </div>
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
      <Form.section>
        <Form.label required>행사 상태</Form.label>
        <Callout>
          종료된 행사 상태는 다른 상태로 변경이 불가하니 참고해주세요.
        </Callout>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-8">
              {EventStatusEnum.options.slice(0, 3).map((status) => (
                <Button
                  key={status}
                  type="button"
                  size="large"
                  variant={value === status ? 'primary' : 'tertiary'}
                  onClick={() => onChange(status)}
                >
                  {Stringifier.eventStatus(status)}
                </Button>
              ))}
            </div>
          )}
        />
      </Form.section>
      <Form.submitButton>수정하기</Form.submitButton>
    </Form>
  );
};
