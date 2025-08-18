'use client';

import { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { ArrowBigRight, XIcon } from 'lucide-react';
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

interface FormValues {
  status: EventStatus;
  name: string;
  imageUrl: string | undefined;
  regionHub: RegionHubsViewEntity;
  dailyEvents: EventDailyShuttlesInEventsViewEntity[];
  type: EventType;
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
    dailyEvents: event?.dailyEvents ?? [],
  };

  const previousDailyEvents = event?.dailyEvents?.map((dailyEvent) => ({
    status: dailyEvent.status,
    dailyEventId: dailyEvent.dailyEventId,
    date: dayjs(dailyEvent.date, 'Asia/Seoul').toISOString(),
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
      const body: UpdateEventRequest = {
        ...data,
        imageUrl: data.imageUrl ?? undefined,
        regionId: data.regionHub.regionId,
        regionHubId: data.regionHub.regionHubId,
        dailyEvents: data.dailyEvents.map((dailyEvent) => ({
          ...dailyEvent,
          closeDeadline: dayjs(dailyEvent.date)
            .subtract(14, 'day')
            .toISOString(),
        })),
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
              type="concerts"
              value={value}
              setValue={(url) => onChange(url)}
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
                  value={dayjs(dailyEvent.date)
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
                        defaultValue={dayjs(value.date)
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
                  date: dayjs().tz('Asia/Seoul').startOf('day').toISOString(),
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
          행사 상태는 수요조사 모집 중 → 수요조사 마감으로 밖에 변경할 수
          없습니다.
        </Callout>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-8">
              {EventStatusEnum.options.slice(0, 2).map((status) => (
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
