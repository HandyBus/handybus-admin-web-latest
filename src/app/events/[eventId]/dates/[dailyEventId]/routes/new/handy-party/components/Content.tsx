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
import DateTimeInput from '@/components/input/DateTimeInput';
import NumberInput from '@/components/input/NumberInput';
import Callout from '@/components/text/Callout';
import { useRouter } from 'next/navigation';
import {
  GOYANG_STADIUM_PRICE_TABLE,
  HandyPartyPriceTable,
  KSPO_DOME_PRICE_TABLE,
} from '@/constants/handyPartyPriceTable.const';
import RegionHubInputWithDropdown from '@/components/input/RegionHubInputWithDropdown';

export interface FormValues {
  reservationDeadline: string;
  earlybirdReservationDeadline: string;
  toDestinationArrivalTime: string;
  fromDestinationDepartureTime: string;
  destinationHubId: string;
  priceOfAreas: {
    area: HandyPartyRouteArea;
    regularPrice: number;
    earlybirdPrice: number;
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
      .subtract(4, 'day')
      .toISOString();

    const priceOfAreas: HandyPartyPriceTable = HANDY_PARTY_ROUTE_AREA.map(
      (area) => {
        return {
          area,
          regularPrice: 0,
          earlybirdPrice: 0,
        };
      },
    );

    return {
      reservationDeadline,
      earlybirdReservationDeadline: reservationDeadline, // 얼리버드 예약 마감일은 예약 마감일과 동일하게 적용
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

  const { createMultipleHandyPartyRoutes, isLoading } = usePostHandyPartyRoutes(
    {
      eventId,
      dailyEventId,
    },
  );

  const onSubmit = async (data: FormValues) => {
    const confirmed = confirm(
      '핸디팟 노선들을 생성하시겠습니까? 노선 생성에는 1분 정도 소요됩니다. 노선 생성 완료 메시지가 표시될 때까지 기다려주세요.',
    );
    if (!confirmed) {
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
    priceTable.forEach(({ area, regularPrice, earlybirdPrice }) => {
      const index = HANDY_PARTY_ROUTE_AREA.findIndex((a) => a === area);
      if (index !== -1) {
        setValue(`priceOfAreas.${index}`, {
          area,
          regularPrice,
          earlybirdPrice,
        });
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Callout className="bg-basic-grey-50">
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
        <Form.label htmlFor="earlybirdReservationDeadline" required>
          얼리버드 예약 마감일
        </Form.label>
        <Controller
          control={control}
          name="earlybirdReservationDeadline"
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
            <RegionHubInputWithDropdown
              hubType="EVENT_LOCATION"
              regionId={regionIdForDestinationHub}
              regionHubId={value}
              setRegionId={(regionId) => setRegionIdForDestinationHub(regionId)}
              setRegionHubId={(regionHub) => onChange(regionHub.regionHubId)}
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
        <Callout>
          일반 가격이 0으로 설정된 권역은 노선이 생성되지 않습니다.
          <br />
          얼리버드 가격이 0으로 설정된 권역은 얼리버드 노선이 생성되지 않습니다.
        </Callout>
        <div className="flex flex-col gap-8 rounded-[6px] border border-basic-grey-300 p-12">
          <h5 className="text-14 font-600">단가표 적용하기</h5>
          <div className="flex gap-8">
            <PriceTableButton
              onClick={() => handleApplyPriceTable(GOYANG_STADIUM_PRICE_TABLE)}
            >
              고양종합운동장 25.06
            </PriceTableButton>
            <PriceTableButton
              onClick={() => handleApplyPriceTable(KSPO_DOME_PRICE_TABLE)}
            >
              KSPO DOME 25.07
            </PriceTableButton>
          </div>
        </div>
        <ul className="flex flex-col">
          <div className="flex text-14 font-500 text-basic-grey-500">
            <div className="w-108 shrink-0 whitespace-nowrap break-keep">
              권역
            </div>
            <div className="w-192 shrink-0 whitespace-nowrap break-keep">
              일반 가격
            </div>
            <div className="w-100 shrink-0 whitespace-nowrap break-keep">
              얼리버드 가격
            </div>
          </div>
          {HANDY_PARTY_ROUTE_AREA.map((area, index) => (
            <Controller
              key={area}
              control={control}
              name={`priceOfAreas.${index}`}
              render={({ field: { onChange, value } }) => (
                <li className="flex items-center gap-8 border-b border-basic-grey-100 py-8">
                  <span className="w-100 shrink-0 whitespace-nowrap break-keep text-16 font-500">
                    {area}
                  </span>
                  <div className="flex gap-4">
                    <NumberInput
                      value={value?.regularPrice ?? 0}
                      setValue={(regularPrice) =>
                        onChange({ ...value, regularPrice })
                      }
                    />
                    <NumberInput
                      value={value?.earlybirdPrice ?? 0}
                      setValue={(earlybirdPrice) =>
                        onChange({ ...value, earlybirdPrice })
                      }
                    />
                  </div>
                </li>
              )}
            />
          ))}
        </ul>
      </Form.section>
      <Form.submitButton disabled={isLoading}>
        {isLoading ? '노선 생성 중...' : '핸디팟 노선 생성하기'}
      </Form.submitButton>
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
      className="hover:border-basic-blue-600 flex w-fit flex-row items-center justify-start rounded-16 border border-basic-blue-100 px-8 py-4 text-14 font-500 transition-all active:scale-90 active:bg-basic-blue-400 active:text-basic-white disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
