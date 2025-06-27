'use client';

import Form from '@/components/form/Form';
import Heading from '@/components/text/Heading';
import { useGetEvents } from '@/services/event.service';
import { EventsViewEntity } from '@/types/event.type';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ChevronDown, PlusIcon, TrashIcon } from 'lucide-react';
import { authInstance } from '@/services/config';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import dayjs from 'dayjs';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const { data: initialPinnedEvents } = useGetEvents({
    eventIsPinned: true,
  });
  const { data: allNotPinnedEvents } = useGetEvents({
    status: 'OPEN,CLOSED',
    eventIsPinned: false,
  });

  const isInitialized = useRef(false);
  const [stagedEvents, setStagedEvents] = useState<EventsViewEntity[]>([]);
  const [selectedNewEvent, setSelectedNewEvent] =
    useState<EventsViewEntity | null>(null);

  useEffect(() => {
    if (isInitialized.current || !initialPinnedEvents) {
      return;
    }
    isInitialized.current = true;
    setStagedEvents(initialPinnedEvents);
  }, [initialPinnedEvents]);

  const removeStagedEvent = (eventId: string) => {
    setStagedEvents(stagedEvents.filter((event) => event.eventId !== eventId));
  };
  const addStagedEvent = (event: EventsViewEntity) => {
    if (stagedEvents.some((e) => e.eventId === event.eventId)) {
      return;
    }
    setStagedEvents((prev) => [...prev, event]);
  };

  const { mutateAsync, isPending } = useSetPinnedEvents();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialPinnedEvents) {
      return;
    }

    const eventIdsToPin = stagedEvents
      .filter(
        (stagedEvent) =>
          !initialPinnedEvents.some(
            (initialPinnedEvent) =>
              initialPinnedEvent.eventId === stagedEvent.eventId,
          ),
      )
      .map((e) => e.eventId);
    const eventIdsToRemovePin = initialPinnedEvents
      .filter(
        (initialPinnedEvent) =>
          !stagedEvents.some(
            (stagedEvent) => stagedEvent.eventId === initialPinnedEvent.eventId,
          ),
      )
      .map((e) => e.eventId);

    try {
      await mutateAsync({
        eventIdsToPin,
        eventIdsToRemovePin,
      });
      toast.success('수정에 성공했습니다.');
      router.push('/events/pin');
    } catch (error) {
      console.error(error);
      toast.error(
        '수정에 실패했습니다. 새로 고침하여 목록을 다시 확인해주세요.',
      );
    }
  };

  return (
    <main>
      <Heading>이달의 추천 행사 수정하기</Heading>
      <Form onSubmit={handleSubmit}>
        {stagedEvents.map((event: EventsViewEntity) => {
          const dates = event.dailyEvents.map((dailyEvent) =>
            dayjs(dailyEvent.date),
          );
          const startDate = dates.sort((a, b) => a.diff(b))[0];
          const endDate = dates.sort((a, b) => b.diff(a))[0];
          const dateRange = `${startDate.format('YYYY.MM.DD')} ~ ${endDate.format('YYYY.MM.DD')}`;
          return (
            <Form.section
              key={event.eventId}
              className="flex flex-row items-center gap-16"
            >
              <div className="relative flex h-[100px] w-[100px] items-center gap-12">
                <Image
                  src={event.eventImageUrl}
                  alt={event.eventName}
                  fill
                  className="rounded-[8px] object-cover"
                />
              </div>
              <h4 className="text-22 font-600">{event.eventName}</h4>
              <h4 className="text-14 font-500 text-grey-500">{dateRange}</h4>
              <button
                type="button"
                className="ml-auto flex items-center justify-center rounded-full bg-grey-100 p-12 hover:text-grey-700"
                onClick={() => removeStagedEvent(event.eventId)}
              >
                <TrashIcon />
              </button>
            </Form.section>
          );
        })}
        <div className="grid h-48 w-full grid-cols-[1fr_200px] justify-end gap-4">
          <Combobox
            immediate
            value={selectedNewEvent}
            onChange={(value) => {
              setSelectedNewEvent(value);
            }}
          >
            <div className="group relative size-full">
              <ComboboxButton className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 group-focus:text-blue-500">
                <ChevronDown />
              </ComboboxButton>
              <ComboboxInput
                className="size-full rounded-lg border border-grey-200 p-8 focus:outline-blue-400"
                placeholder={'행사 선택'}
                defaultValue={null}
                displayValue={(event: EventsViewEntity | null) =>
                  event?.eventName ?? ''
                }
                autoComplete="off"
                disabled
              />
              <ComboboxOptions
                anchor="bottom"
                className="mt-4 w-[var(--input-width)] rounded-lg bg-white shadow-md empty:invisible"
              >
                {allNotPinnedEvents?.map((event) => (
                  <ComboboxOption
                    key={event.eventId}
                    value={event}
                    className="p-8 data-[focus]:bg-blue-100"
                  >
                    {event.eventName}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-8 rounded-[8px] bg-primary-700 p-12 text-white disabled:bg-grey-200"
            disabled={!selectedNewEvent}
            onClick={() => {
              if (selectedNewEvent) {
                addStagedEvent(selectedNewEvent);
                setSelectedNewEvent(null);
              }
            }}
          >
            <PlusIcon />
          </button>
        </div>
        <Form.submitButton disabled={isPending}>
          {isPending ? '수정중...' : '수정하기'}
        </Form.submitButton>
      </Form>
    </main>
  );
};

export default Page;

const putEditPinnedEvent = async (eventId: string, isPinned: boolean) => {
  await authInstance.put(`/v2/shuttle-operation/admin/events/${eventId}`, {
    isPinned: isPinned,
  });
};

const setPinnedEvents = async (
  eventIdsToPin: string[],
  eventIdsToRemovePin: string[],
) => {
  await Promise.all([
    ...eventIdsToPin.map((eventId) => putEditPinnedEvent(eventId, true)),
    ...eventIdsToRemovePin.map((eventId) => putEditPinnedEvent(eventId, false)),
  ]);
};

const useSetPinnedEvents = () => {
  return useMutation({
    mutationFn: ({
      eventIdsToPin,
      eventIdsToRemovePin,
    }: {
      eventIdsToPin: string[];
      eventIdsToRemovePin: string[];
    }) => setPinnedEvents(eventIdsToPin, eventIdsToRemovePin),
  });
};
