'use client';

import { useCallback, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { type EditEventFormData, conform } from './form.type';
import { useRouter } from 'next/navigation';
import ArtistInput from '@/components/input/ArtistInput';
import { Controller } from 'react-hook-form';
import RegionInput from '@/components/input/RegionInput';
import { ArrowBigRight, CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button, Field, Label, RadioGroup, Radio } from '@headlessui/react';
import ImageFileInput from '@/components/input/ImageFileInput';
import RegionHubInput from '@/components/input/HubInput';
import Input from '@/components/input/Input';
import dayjs from 'dayjs';
import { useGetEvent, usePutEvent } from '@/services/shuttleOperation.service';
import Form from '@/components/form/Form';
import { EventsViewEntity, EventTypeEnum } from '@/types/event.type';
import Heading from '@/components/text/Heading';
import NewArtistsModal from '@/components/modal/NewArtistsModal';

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
    regionId: event?.regionId,
    regionHubId: event?.regionHubId,
    type: event?.eventType,
    dailyEvents: event?.dailyEvents?.map((dailyEvent) => ({
      status: dailyEvent.status,
      dailyEventId: dailyEvent.dailyEventId,
      date: dayjs(dailyEvent.date, 'Asia/Seoul').format('YYYY-MM-DD'),
    })),
    artistIds:
      event?.eventArtists?.map((artist) => ({
        artistId: artist.artistId ?? null,
      })) ?? [],
  };

  const previousDailyEvents = event?.dailyEvents?.map((dailyEvent) => ({
    status: dailyEvent.status,
    dailyEventId: dailyEvent.dailyEventId,
    date: dayjs(dailyEvent.date, 'Asia/Seoul').format('YYYY-MM-DD'),
  }));

  const { control, handleSubmit } = useForm<EditEventFormData>({
    defaultValues,
  });

  const watch = useWatch({
    control,
    exact: false,
  });

  const {
    fields: dailyFields,
    append: appendDaily,
    remove: removeDaily,
  } = useFieldArray<EditEventFormData>({
    control,
    name: 'dailyEvents',
  });

  const {
    fields: concertArtistFields,
    append: appendArtist,
    remove: removeArtist,
  } = useFieldArray<EditEventFormData>({
    control,
    name: 'artistIds',
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
    (data: EditEventFormData) => {
      if (confirm('행사를 수정하시겠습니까?')) {
        putEvent({ eventId: event.eventId, body: conform(data) });
      }
    },
    [event, putEvent],
  );

  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.section>
          <Form.label>행사 이름</Form.label>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                value={value}
                placeholder="행사 이름"
                setValue={onChange}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>장소</Form.label>
          <Controller
            control={control}
            name="regionId"
            render={({ field: { onChange, value } }) => (
              <RegionInput
                value={value}
                setValue={(id) => onChange(id || null)}
              />
            )}
          />
          <Controller
            control={control}
            name="regionHubId"
            render={({ field: { onChange, value } }) => (
              <RegionHubInput
                regionId={watch.regionId}
                value={value}
                setValue={(n) => onChange(n)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>
            날짜
            <button
              type="button"
              onClick={() =>
                appendDaily({
                  date: dayjs().startOf('day').toISOString(),
                })
              }
              className="w-fit text-blue-500"
            >
              <PlusIcon />
            </button>
          </Form.label>
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
                      <div className="flex w-full flex-row items-center">
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
                            onChange({
                              ...value,
                              date: dayjs.tz(str, 'Asia/Seoul').toISOString(),
                            });
                          }}
                        />
                        {!value.dailyEventId && (
                          <button
                            type="button"
                            onClick={() => removeDaily(index)}
                          >
                            <XIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        </Form.section>
        <Form.section>
          <Form.label>타입</Form.label>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                value={value}
                className="flex flex-row gap-4"
                onChange={(s) => onChange(s)}
                aria-label="Server size"
              >
                {EventTypeEnum.options.map((plan) => (
                  <Field key={plan} className="gap-2 flex items-center">
                    <Radio
                      value={plan}
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
                      <Label>{plan}</Label>
                    </Radio>
                  </Field>
                ))}
              </RadioGroup>
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>행사 이미지</Form.label>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <ImageFileInput
                type="concerts"
                value={value}
                setValue={(url) => onChange(url || null)}
              />
            )}
          />
        </Form.section>
        <Form.section>
          <Form.label>
            아티스트{' '}
            <button
              type="button"
              onClick={() => appendArtist({ artistId: null })}
              className="w-fit text-blue-500"
            >
              <PlusIcon />
            </button>
          </Form.label>
          <div className="flex flex-col gap-4">
            {concertArtistFields.map((field, index) => (
              <div key={field.id} className="flex gap-4">
                <Controller
                  control={control}
                  name={`artistIds.${index}.artistId`}
                  render={({ field: { onChange, value } }) => (
                    <ArtistInput
                      value={value}
                      setValue={(id) => onChange(id || null)}
                      modalState={{
                        isOpen: isArtistModalOpen,
                        setIsOpen: setIsArtistModalOpen,
                      }}
                    />
                  )}
                />
                <Button
                  className="transition-colors hover:text-red-500"
                  type="button"
                  onClick={() => removeArtist(index)}
                >
                  <XIcon />
                </Button>
              </div>
            ))}
          </div>
        </Form.section>
        <Form.submitButton>수정하기</Form.submitButton>
      </Form>

      <NewArtistsModal
        isOpen={isArtistModalOpen}
        setIsOpen={setIsArtistModalOpen}
      />
    </>
  );
};
