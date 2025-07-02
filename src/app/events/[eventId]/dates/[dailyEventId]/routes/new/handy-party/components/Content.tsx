'use client';

import Form from '@/components/form/Form';
import {
  HANDY_PARTY_ROUTE_AREA,
  HandyPartyRouteArea,
} from '@/constants/handyPartyArea.const';
import { ReactNode, useMemo, useState } from 'react';
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
import {
  GOYANG_STADIUM_PRICE_TABLE,
  HandyPartyPriceTable,
} from '@/constants/handyPartyPriceTable.const';

export interface FormValues {
  reservationDeadline: string;
  toDestinationArrivalTime: string;
  fromDestinationDepartureTime: string;
  destinationHubId: string;
  priceOfAreas: {
    area: HandyPartyRouteArea;
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

  const { control, handleSubmit, setValue } = useForm<FormValues>({
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

  const handleApplyPriceTable = (priceTable: HandyPartyPriceTable) => {
    priceTable.forEach(({ area, price }) => {
      const index = HANDY_PARTY_ROUTE_AREA.findIndex((a) => a === area);
      if (index !== -1) {
        setValue(`priceOfAreas.${index}`, {
          area,
          price,
        });
      }
    });
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
        <div className="flex flex-col gap-8 rounded-[6px] border border-grey-300 p-12">
          <h5 className="text-14 font-600">단가표 적용하기</h5>
          <PriceTableButton
            onClick={() => handleApplyPriceTable(GOYANG_STADIUM_PRICE_TABLE)}
          >
            고양종합운동장 25.06
          </PriceTableButton>
        </div>
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

interface PriceTableButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const PriceTableButton = ({ onClick, children }: PriceTableButtonProps) => {
  return (
    <button
      className="flex w-fit flex-row items-center justify-start rounded-xl border border-blue-100 px-8 py-4 text-14 font-500 transition-all hover:border-blue-600 active:scale-90 active:bg-blue-400 active:text-white disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
