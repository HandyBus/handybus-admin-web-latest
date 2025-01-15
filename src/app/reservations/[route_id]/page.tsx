'use client';

import useTable from '@/hooks/useTable';
import { getReservations } from '@/services/v2/reservations.services';
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { busColumns, reservationColumns } from './types/table.type';
import BaseTable from '@/components/table/BaseTable';
import { getBuses } from '@/services/v2/shuttleBus.services';
import { useMemo, useState } from 'react';
import {
  Dialog,
  Description,
  DialogTitle,
  DialogPanel,
} from '@headlessui/react';
import { LoaderCircleIcon } from 'lucide-react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { ShuttleBusesView } from '@/types/v2/shuttleBus.type';
import { ReservationView } from '@/types/v2/reservation.type';
import { toast } from 'react-toastify';
import { CustomError } from '@/services/custom-error';
import Stringifier from '@/utils/stringifier.util';

interface Props {
  params: {
    route_id: string;
  };
  searchParams: {
    eventId: string;
    dailyEventId: string;
  };
}

const Page = ({ params, searchParams }: Props) => {
  const eventId = Number(searchParams.eventId);
  const dailyEventId = Number(searchParams.dailyEventId);
  const shuttleRouteId = Number(params.route_id);

  return (
    <>
      <main className="flex h-full w-full flex-col gap-16 bg-white">
        <h1 className="text-[32px] font-500">노선별 예약 관리</h1>
        <BusSection
          eventId={eventId}
          dailyEventId={dailyEventId}
          shuttleRouteId={shuttleRouteId}
        />
        <ReservationSection
          eventId={eventId}
          dailyEventId={dailyEventId}
          shuttleRouteId={shuttleRouteId}
        />
      </main>
    </>
  );
};

export default Page;

interface AssignedBus {
  shuttleBusId: number;
  busName: string;
  busCapacity: number;
  busType: ShuttleBusesView['busType'];
  passengers: ReservationView[];
}

interface BusSectionProps {
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
}

const BusSection = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: BusSectionProps) => {
  const { data: buses } = useQuery({
    queryKey: ['bus', eventId, dailyEventId, shuttleRouteId],
    queryFn: async () => await getBuses(eventId, dailyEventId, shuttleRouteId),
  });

  const baseArray = useMemo(() => [], []);

  const busTable = useTable({
    columns: busColumns,
    data: buses ?? baseArray,
  });

  const [isOpen, setIsOpen] = useState(false);

  const { data, isFetching } = useInfiniteQuery({
    queryKey: ['reservations', eventId, dailyEventId, shuttleRouteId],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return getReservations({
        page: pageParam,
        eventId,
        dailyEventId,
        shuttleRouteId,
      });
    },
    initialPageParam: 0,
    initialData: { pages: [], pageParams: [] },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    placeholderData: keepPreviousData,
    // 모든 페이지를 자동으로 가져오기 위한 설정 추가
    maxPages: Infinity,
    refetchOnMount: true,
  });

  const reservations = useMemo(
    () => data.pages.flatMap((page) => page.reservations),
    [data],
  );

  const [assignedBus, setAssignedBus] = useState<AssignedBus[]>([]);

  const autoAssignBus = async (buses: ShuttleBusesView[]) => {
    // 핸디 유저와 일반 유저 분리
    const handyUsers = reservations.filter((r) => r.handyStatus === 'ACCEPTED');
    const normalUsers = reservations.filter(
      (r) => r.handyStatus !== 'ACCEPTED',
    );

    // 버스 수와 핸디 유저 수 검증
    if (buses.length !== handyUsers.length) {
      throw new CustomError(400, '버스 수와 핸디 수가 일치해야 합니다.');
    }

    try {
      const newAssignedBus: AssignedBus[] = [];
      // 각 버스에 핸디 유저 먼저 배정
      buses.forEach((bus, index) => {
        newAssignedBus.push({
          shuttleBusId: bus.shuttleBusId,
          busName: bus.busName,
          busCapacity: bus.busCapacity,
          busType: bus.busType,
          passengers: [handyUsers[index]],
        });
      });

      // 나머지 일반 유저 배정
      for (const user of normalUsers) {
        const availableBus = newAssignedBus.find(
          (bus) => bus.busCapacity > bus.passengers.length,
        );
        if (!availableBus) {
          throw new CustomError(400, '버스가 부족합니다. 버스를 추가해주세요.');
        }
        availableBus.passengers.push(user);
      }

      setAssignedBus(newAssignedBus);
    } catch (e) {
      const error = e as CustomError;
      toast.error(error.message);
    }
  };

  return (
    <>
      <section>
        <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
          버스 목록
          <button
            type="button"
            className="text-14 font-500 bg-primary rounded-md ml-40 border border-grey-300 px-12 py-[3px]"
            onClick={() => setIsOpen(true)}
          >
            배정하기
          </button>
        </h2>
        <BaseTable table={busTable} />
      </section>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 bg-white p-24 rounded-xl w-full">
          <DialogTitle className="font-700 text-26">버스 배정</DialogTitle>
          <Description>
            예약한 사용자들을 버스에 배정합니다.{' '}
            <button
              type="button"
              className="text-14 font-500 bg-primary rounded-md ml-8 border border-grey-300 px-12 py-[2px] disabled:bg-grey-200 disabled:text-grey-600"
              disabled={!buses || isFetching}
              onClick={() => {
                if (!buses) {
                  return;
                }
                autoAssignBus(buses);
              }}
            >
              자동 배정
            </button>
          </Description>
          <section>
            {assignedBus.map((bus) => (
              <article key={bus.shuttleBusId}>
                <h3 className="bg-grey-50 p-4 flex items-center gap-12">
                  <span className="text-18 font-500">{bus.busName}</span>
                  <span className="text-14 font-500 text-grey-500">
                    {Stringifier.busType(bus.busType)}
                  </span>
                  <span className="text-14 font-500 text-grey-500">
                    {bus.passengers.length} / {bus.busCapacity}
                  </span>
                </h3>
                <ul>
                  {bus.passengers.map((passenger) => (
                    <li
                      key={passenger.reservationId}
                      className="border-b border-grey-200 p-4 flex items-center gap-12"
                    >
                      <span>{passenger.userNickname}</span>
                      <span className="text-grey-500">
                        {passenger.userPhoneNumber}
                      </span>
                      {passenger.handyStatus === 'ACCEPTED' && (
                        <span className="text-primary-main">핸디</span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </DialogPanel>
      </Dialog>
    </>
  );
};

interface ReservationSectionProps {
  eventId: number;
  dailyEventId: number;
  shuttleRouteId: number;
}

const ReservationSection = ({
  eventId,
  dailyEventId,
  shuttleRouteId,
}: ReservationSectionProps) => {
  const { data, fetchNextPage, isFetching, hasNextPage, isError, error } =
    useInfiniteQuery({
      queryKey: ['reservations', eventId, dailyEventId, shuttleRouteId],
      queryFn: ({ pageParam }: { pageParam: number }) => {
        return getReservations({
          page: pageParam,
          eventId,
          dailyEventId,
          shuttleRouteId,
        });
      },
      initialPageParam: 0,
      initialData: { pages: [], pageParams: [] },
      getNextPageParam: (lastPage) => {
        console.log('lastPage' + lastPage.nextPage);
        return lastPage.nextPage;
      },
      placeholderData: keepPreviousData,
    });
  const ref = useInfiniteScroll(fetchNextPage);

  const reservations = useMemo(
    () => data.pages.flatMap((page) => page.reservations),
    [data],
  );

  const reservationTable = useTable({
    columns: reservationColumns,
    data: reservations,
  });

  return (
    <section className="w-full">
      <h2 className="text-24 font-500 pb-8 bg-grey-50 py-4 px-12 my-4 flex items-center">
        예약 목록
      </h2>
      <BaseTable table={reservationTable} />
      {isError ? <p>에러 : {error.message}</p> : null}
      {isFetching ? <LoaderCircleIcon className="animate-spin" /> : null}
      {hasNextPage && <div ref={ref} />}
    </section>
  );
};
