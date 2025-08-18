'use client';

import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { MultiRouteFormValues } from '../form.type';
import RegionHubInputWithButton from '@/components/input/RegionHubInputWithButton';
import SingleRouteForm from './single-route-form/SingleRouteForm';
import { useState, useEffect, useMemo } from 'react';
import Form from '@/components/form/Form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateShuttleRouteRequest } from '@/types/shuttleRoute.type';
import { usePostShuttleRoute } from '@/services/shuttleRoute.service';
import { validateShuttleRouteData } from '../utils/validateShuttleRouteData';

interface Props {
  dailyEventDate: string;
  reservationDeadline: string;
  eventId: string;
  dailyEventId: string;
}

const MultiRouteForm = ({
  dailyEventDate,
  reservationDeadline,
  eventId,
  dailyEventId,
}: Props) => {
  const { control, handleSubmit, watch, setValue } =
    useFormContext<MultiRouteFormValues>();
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

  const destinationHub = watch('destinationHub');
  const shuttleRoutes = watch('shuttleRoutes');

  const defaultShuttleRoute = useMemo(() => {
    return {
      name: '',
      reservationDeadline,
      hasEarlybird: false,
      earlybirdPrice: {
        toDestination: 0,
        fromDestination: 0,
        roundTrip: 0,
      },
      regularPrice: {
        toDestination: 1000000,
        fromDestination: 1000000,
        roundTrip: 1000000,
      },
      earlybirdDeadline: reservationDeadline,
      maxPassengerCount: 0,
      toDestinationHubs: [
        {
          regionId: null,
          regionHubId: null,
          latitude: null,
          longitude: null,
        },
        destinationHub
          ? {
              regionId: destinationHub.regionId,
              regionHubId: destinationHub.regionHubId,
              latitude: destinationHub.latitude,
              longitude: destinationHub.longitude,
            }
          : {
              regionId: null,
              regionHubId: null,
              latitude: null,
              longitude: null,
            },
      ],
      toDestinationArrivalTimes: [
        { time: dailyEventDate },
        { time: dailyEventDate },
      ],
      fromDestinationArrivalTimes: [
        { time: dailyEventDate },
        { time: dailyEventDate },
      ],
    };
  }, [dailyEventDate, reservationDeadline, destinationHub]);

  const {
    fields: shuttleRouteFields,
    append: appendShuttleRoute,
    remove: removeShuttleRoute,
  } = useFieldArray({
    control,
    name: 'shuttleRoutes',
  });

  // destinationHub가 변경될 때 모든 노선의 도착지를 자동으로 업데이트
  useEffect(() => {
    if (destinationHub && shuttleRoutes) {
      shuttleRoutes.forEach((_, routeIndex) => {
        const toDestinationHubs = shuttleRoutes[routeIndex]?.toDestinationHubs;
        if (toDestinationHubs && toDestinationHubs.length > 0) {
          const lastIndex = toDestinationHubs.length - 1;
          setValue(
            `shuttleRoutes.${routeIndex}.toDestinationHubs.${lastIndex}`,
            {
              regionId: destinationHub.regionId,
              regionHubId: destinationHub.regionHubId,
              latitude: destinationHub.latitude,
              longitude: destinationHub.longitude,
            },
          );
        }
      });
    }
  }, [dailyEventDate, destinationHub, shuttleRoutes, setValue]);

  const handleAddRoute = () => {
    appendShuttleRoute(defaultShuttleRoute);
    setCurrentRouteIndex(shuttleRouteFields.length);
  };

  const handleRemoveRoute = (index: number) => {
    if (shuttleRouteFields.length === 1) {
      alert('최소 1개의 노선이 필요합니다.');
      return;
    }
    removeShuttleRoute(index);
    if (currentRouteIndex === index && currentRouteIndex === 0) {
      setCurrentRouteIndex(0);
    } else if (currentRouteIndex === index && currentRouteIndex > 0) {
      setCurrentRouteIndex(currentRouteIndex - 1);
    }
  };

  const handleNavigateRoute = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentRouteIndex > 0) {
      setCurrentRouteIndex(currentRouteIndex - 1);
    } else if (
      direction === 'next' &&
      currentRouteIndex < shuttleRouteFields.length - 1
    ) {
      setCurrentRouteIndex(currentRouteIndex + 1);
    }
  };

  const { mutateAsync: postRoute } = usePostShuttleRoute();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: MultiRouteFormValues) => {
    if (
      !confirm(
        '노선을 생성하시겠습니까? 노선 생성 후 가격 변동은 자제해주세요.',
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      const shuttleRoutes: CreateShuttleRouteRequest[] = data.shuttleRoutes.map(
        (shuttleRoute) => {
          const toDestinationHubs = shuttleRoute.toDestinationHubs
            .filter(
              (
                hub,
              ): hub is {
                regionId: string;
                regionHubId: string;
                latitude: number;
                longitude: number;
              } =>
                !!hub?.regionId &&
                !!hub?.regionHubId &&
                !!hub?.latitude &&
                !!hub?.longitude,
            )
            .map((hub, index, array) => {
              const isLastHub = index === array.length - 1;
              return {
                regionHubId: hub.regionHubId,
                type: 'TO_DESTINATION' as const,
                role: isLastHub ? ('DESTINATION' as const) : ('HUB' as const),
                sequence: index + 1, // NOTE: 1부터 시작
                arrivalTime: shuttleRoute.toDestinationArrivalTimes[index].time,
              };
            });
          const fromDestinationHubs = shuttleRoute.toDestinationHubs
            .toReversed()
            .filter(
              (
                hub,
              ): hub is {
                regionId: string;
                regionHubId: string;
                latitude: number;
                longitude: number;
              } =>
                !!hub?.regionId &&
                !!hub?.regionHubId &&
                !!hub?.latitude &&
                !!hub?.longitude,
            )
            .map((hub, index) => {
              const isFirstHub = index === 0;
              return {
                regionHubId: hub.regionHubId,
                type: 'FROM_DESTINATION' as const,
                role: isFirstHub ? ('DESTINATION' as const) : ('HUB' as const),
                sequence: index + 1, // NOTE: 1부터 시작
                arrivalTime:
                  shuttleRoute.fromDestinationArrivalTimes[index].time,
              };
            });

          return {
            name: shuttleRoute.name,
            reservationDeadline: shuttleRoute.reservationDeadline,
            hasEarlybird: shuttleRoute.hasEarlybird,
            earlybirdPrice: shuttleRoute.earlybirdPrice,
            regularPrice: shuttleRoute.regularPrice,
            earlybirdDeadline: shuttleRoute.earlybirdDeadline,
            maxPassengerCount: shuttleRoute.maxPassengerCount,
            shuttleRouteHubs: [...toDestinationHubs, ...fromDestinationHubs],
          };
        },
      );

      console.log(shuttleRoutes);

      return;

      for (const shuttleRoute of shuttleRoutes) {
        try {
          validateShuttleRouteData(shuttleRoute);
        } catch {
          alert(`${shuttleRoute.name} 노선의 데이터가 올바르지 않습니다.`);
          return;
        }
      }

      // NOTE: Promise.all 사용 시 수요조사 한 사람들에게 알림톡 중복 발송됨
      for (const shuttleRoute of shuttleRoutes) {
        await postRoute({
          eventId,
          dailyEventId,
          body: shuttleRoute,
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      alert(
        '노선 추가 과정에서 오류가 발생했습니다.\n' +
          (error instanceof Error && error.message),
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.section>
        <Form.label>도착지</Form.label>
        <Controller
          control={control}
          name="destinationHub"
          render={({ field: { onChange, value } }) => (
            <RegionHubInputWithButton
              hubUsageTypes={['EVENT_LOCATION']}
              regionHub={value}
              setRegionHub={onChange}
              placeholder="도착지를 선택해주세요"
            />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label>
          <span className="text-16 text-basic-grey-600">
            노선들의 정보를 입력해주세요
          </span>
          <div className="ml-auto flex gap-8 text-14 text-basic-grey-600">
            <button type="button" onClick={() => handleNavigateRoute('prev')}>
              <ChevronLeft />
            </button>
            <span>
              {currentRouteIndex + 1} / {shuttleRouteFields.length}
            </span>
            <button type="button" onClick={() => handleNavigateRoute('next')}>
              <ChevronRight />
            </button>
          </div>
        </Form.label>
        <div className="h-[1px] w-full bg-basic-grey-300" />
        <SingleRouteForm
          key={currentRouteIndex}
          index={currentRouteIndex}
          onAddRoute={handleAddRoute}
          onRemoveRoute={() => handleRemoveRoute(currentRouteIndex)}
          dailyEventDate={dailyEventDate}
          routeLength={shuttleRouteFields.length}
        />
      </Form.section>
      <Form.submitButton
        type="submit"
        disabled={shuttleRouteFields.length === 0 || isSubmitting}
      >
        {isSubmitting ? '노선 생성 중...' : '노선 생성하기'}
      </Form.submitButton>
    </Form>
  );
};

export default MultiRouteForm;
