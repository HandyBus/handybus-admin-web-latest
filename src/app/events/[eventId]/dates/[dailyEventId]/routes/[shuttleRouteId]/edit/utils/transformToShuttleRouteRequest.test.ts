import { describe, it, expect } from 'vitest';
import { transformToShuttleRouteRequest } from './transformToShuttleRouteRequest';
import { FormValues } from '../form.type';
import { FieldNamesMarkedBoolean } from 'react-hook-form';

const createFormData = (overrides?: Partial<FormValues>): FormValues => ({
  name: '테스트 노선',
  reservationDeadline: '2025-03-01T00:00:00',
  hasEarlybird: true,
  earlybirdDeadline: '2025-02-20T00:00:00',
  maxPassengerCount: 40,
  status: 'OPEN',
  isReservationDisabled: {
    toDestination: false,
    fromDestination: false,
    roundTrip: false,
  },
  shuttleRouteHubsToDestination: [],
  shuttleRouteHubsFromDestination: [],
  regularPrice: {
    roundTrip: 30000,
    toDestination: 20000,
    fromDestination: 20000,
  },
  earlybirdPrice: {
    roundTrip: 25000,
    toDestination: 17000,
    fromDestination: 17000,
  },
  ...overrides,
});

describe('transformToShuttleRouteRequest', () => {
  it('dirty 필드가 없으면 모든 값이 undefined', () => {
    const data = createFormData();
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      {};

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.name).toBeUndefined();
    expect(result.maxPassengerCount).toBeUndefined();
    expect(result.reservationDeadline).toBeUndefined();
    expect(result.hasEarlybird).toBeUndefined();
    expect(result.earlybirdDeadline).toBeUndefined();
    expect(result.regularPrice).toBeUndefined();
    expect(result.earlybirdPrice).toBeUndefined();
    expect(result.shuttleRouteHubs).toBeUndefined();
    expect(result.isReservationDisabled).toBeUndefined();
  });

  it('hasEarlybird가 dirty이면 값을 포함', () => {
    const data = createFormData({ hasEarlybird: true });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      { hasEarlybird: true };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.hasEarlybird).toBe(true);
  });

  it('hasEarlybird가 false로 변경된 경우도 포함', () => {
    const data = createFormData({ hasEarlybird: false });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      { hasEarlybird: true };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.hasEarlybird).toBe(false);
  });

  it('earlybirdDeadline이 dirty이면 값을 포함', () => {
    const data = createFormData({
      earlybirdDeadline: '2025-02-25T00:00:00',
    });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      { earlybirdDeadline: true };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.earlybirdDeadline).toBe('2025-02-25T00:00:00');
  });

  it('earlybirdPrice가 dirty이면 값을 포함', () => {
    const data = createFormData({
      earlybirdPrice: {
        roundTrip: 22000,
        toDestination: 15000,
        fromDestination: 15000,
      },
    });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      {
        earlybirdPrice: {
          roundTrip: true,
          toDestination: true,
          fromDestination: true,
        },
      };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.earlybirdPrice).toEqual({
      roundTrip: 22000,
      toDestination: 15000,
      fromDestination: 15000,
    });
  });

  it('얼리버드 관련 필드 모두 dirty이면 전부 포함', () => {
    const data = createFormData({
      hasEarlybird: true,
      earlybirdDeadline: '2025-02-25T00:00:00',
      earlybirdPrice: {
        roundTrip: 22000,
        toDestination: 15000,
        fromDestination: 15000,
      },
    });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      {
        hasEarlybird: true,
        earlybirdDeadline: true,
        earlybirdPrice: {
          roundTrip: true,
          toDestination: true,
          fromDestination: true,
        },
      };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.hasEarlybird).toBe(true);
    expect(result.earlybirdDeadline).toBe('2025-02-25T00:00:00');
    expect(result.earlybirdPrice).toEqual({
      roundTrip: 22000,
      toDestination: 15000,
      fromDestination: 15000,
    });
    // 다른 필드는 dirty가 아니므로 undefined
    expect(result.name).toBeUndefined();
    expect(result.regularPrice).toBeUndefined();
  });

  it('기존 필드 name, regularPrice가 dirty이면 값을 포함', () => {
    const data = createFormData({
      name: '수정된 노선',
      regularPrice: {
        roundTrip: 35000,
        toDestination: 25000,
        fromDestination: 25000,
      },
    });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      {
        name: true,
        regularPrice: {
          roundTrip: true,
          toDestination: true,
          fromDestination: true,
        },
      };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.name).toBe('수정된 노선');
    expect(result.regularPrice).toEqual({
      roundTrip: 35000,
      toDestination: 25000,
      fromDestination: 25000,
    });
    expect(result.hasEarlybird).toBeUndefined();
    expect(result.earlybirdDeadline).toBeUndefined();
  });

  it('isReservationDisabled 부분 dirty이면 값을 포함', () => {
    const data = createFormData({
      isReservationDisabled: {
        toDestination: true,
        fromDestination: false,
        roundTrip: false,
      },
    });
    const dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<FormValues>>> =
      {
        isReservationDisabled: {
          toDestination: true,
          fromDestination: false,
          roundTrip: false,
        },
      };

    const result = transformToShuttleRouteRequest(
      dirtyFields,
      data,
      undefined,
      undefined,
    );

    expect(result.isReservationDisabled).toEqual({
      toDestination: true,
      fromDestination: false,
      roundTrip: false,
    });
  });
});
