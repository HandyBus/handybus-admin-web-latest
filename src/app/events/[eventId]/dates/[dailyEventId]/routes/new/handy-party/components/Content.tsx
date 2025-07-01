'use client';

import Form from '@/components/form/Form';
import { HANDY_PARTY_ROUTE_AREA } from '@/constants/taxiRouteArea.const';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { EventsViewEntity } from '@/types/event.type';
import { Controller, useForm } from 'react-hook-form';
import usePostHandyPartyRoutes from '../hooks/usePostHandyPartyRoutes';
import DateInput from '@/components/input/DateInput';
import { RegionHubInputSelfContained } from '@/components/input/HubInput';
import DateTimeInput from '@/components/input/DateTimeInput';
import NumberInput from '@/components/input/NumberInput';
import Callout from '@/components/text/Callout';
import { useRouter } from 'next/navigation';

export interface FormValues {
  reservationDeadline: string;
  toDestinationArrivalTime: string;
  fromDestinationDepartureTime: string;
  destinationHubId: string;
  priceOfAreas: {
    area: (typeof HANDY_PARTY_ROUTE_AREA)[number];
    price: number;
  }[];
}

interface Props {
  eventId: string;
  dailyEventId: string;
  event: EventsViewEntity;
}

const Content = ({ eventId, dailyEventId, event }: Props) => {
  const router = useRouter();
  const defaultValues = useMemo(() => {
    const dailyEventDate = event?.dailyEvents.find(
      (de) => de.dailyEventId === dailyEventId,
    )?.date;
    const reservationDeadline = dayjs(dailyEventDate)
      .subtract(5, 'day')
      .toISOString();

    const priceOfAreas = HANDY_PARTY_ROUTE_AREA.map((area) => {
      return {
        area,
        price: 0,
      };
    });

    return {
      reservationDeadline,
      toDestinationArrivalTime: dailyEventDate,
      fromDestinationDepartureTime: dailyEventDate,
      destinationHub: undefined,
      priceOfAreas,
    };
  }, [event, dailyEventId]);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });
  const [regionIdForDestinationHub, setRegionIdForDestinationHub] = useState<
    string | null
  >(null);

  const { createMultipleHandyPartyRoutes } = usePostHandyPartyRoutes({
    eventId,
    dailyEventId,
  });

  const onSubmit = async (data: FormValues) => {
    const userConfirmed = confirm(
      '핸디팟 노선들을 생성하시겠습니까? 노선 생성에는 시간이 소요됩니다. 잠시 후 노선 생성 완료 메시지가 표시됩니다.',
    );
    if (!userConfirmed) {
      return;
    }
    try {
      await createMultipleHandyPartyRoutes(data);
      alert('핸디팟 노선들이 생성되었습니다.');
      router.push(`/events/${eventId}/dates/${dailyEventId}`);
    } catch (error) {
      alert(
        '핸디팟 노선 생성 중 오류가 발생했습니다. 생성된 노선 목록들을 확인하고 다시 시도해주세요.',
      );
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Callout className="bg-grey-50">
        권역별로 이미 생성된 핸디팟 노선이 있는 경우, 이미 생성된 노선의 방향에
        해당하는 노선은 생성되지 않습니다. (중복 노선 방지)
        <br />
        가격 수정이 필요한 경우 노선 수정하기 기능을 통해 수정해주세요.
      </Callout>
      <Form.section>
        <Form.label htmlFor="reservationDeadline" required>
          예약 마감일
        </Form.label>
        <Controller
          control={control}
          name="reservationDeadline"
          render={({ field: { onChange, value } }) => (
            <DateInput value={value} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label htmlFor="toDestinationArrivalTime" required>
          도착지
        </Form.label>
        <Controller
          control={control}
          name="destinationHubId"
          render={({ field: { onChange, value } }) => (
            <RegionHubInputSelfContained
              hubType="DESTINATION"
              regionId={regionIdForDestinationHub}
              setRegionId={(regionId) => setRegionIdForDestinationHub(regionId)}
              regionHubId={value}
              setRegionHubId={(regionHubId) => onChange(regionHubId)}
            />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label htmlFor="toDestinationArrivalTime" required>
          가는편 도착 시간
        </Form.label>
        <Controller
          control={control}
          name="toDestinationArrivalTime"
          render={({ field: { onChange, value } }) => (
            <DateTimeInput value={value} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label htmlFor="fromDestinationDepartureTime" required>
          오는편 출발 시간
        </Form.label>
        <Controller
          control={control}
          name="fromDestinationDepartureTime"
          render={({ field: { onChange, value } }) => (
            <DateTimeInput value={value} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>권역별 노선 가격</Form.label>
        <Callout>가격이 0으로 설정된 권역은 노선이 생성되지 않습니다.</Callout>
        <ul className="flex flex-col">
          {HANDY_PARTY_ROUTE_AREA.map((area, index) => (
            <Controller
              key={area}
              control={control}
              name={`priceOfAreas.${index}`}
              render={({ field: { onChange, value } }) => (
                <li className="flex items-center gap-8 border-b border-grey-100 py-8">
                  <span className="w-100 shrink-0 whitespace-nowrap break-keep text-16 font-500">
                    {area}
                  </span>
                  <NumberInput
                    value={value?.price ?? 0}
                    setValue={(price) => onChange({ ...value, price })}
                  />
                </li>
              )}
            />
          ))}
        </ul>
      </Form.section>
      <Form.submitButton>핸디팟 노선 생성하기</Form.submitButton>
    </Form>
  );
};

export default Content;
