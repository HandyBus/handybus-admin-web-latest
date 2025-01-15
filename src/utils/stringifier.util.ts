import { BusSortType } from '@/types/v1/bus.type';
import { HandyStatusType } from '@/types/v1/reservation.type';
import { EventsView } from '@/types/v2/event.type';
import { ReservationView } from '@/types/v2/reservation.type';
import { ShuttleRoutesView } from '@/types/v2/shuttleRoute.type';

const Stringifier = Object.freeze({
  handyStatus(v: HandyStatusType) {
    switch (v) {
      case 'NOT_SUPPORTED':
        return '지원하지 않음';
      case 'SUPPORTED':
        return '지원함';
      case 'DECLINED':
        return '거절됨';
      case 'ACCEPTED':
        return '승인됨';
    }
  },
  busType(v: BusSortType) {
    switch (v) {
      case 'LARGE_BUS_41':
        return '41인승 대형버스';
      case 'LARGE_BUS_45':
        return '45인승 대형버스';
      case 'LIMOUSINE_BUS_31':
        return '31인승 리무진버스';
      case 'MEDIUM_BUS_21':
        return '21인승 중형우등버스';
      case 'MINIBUS_24':
        return '24인승 미니버스';
      case 'PREMIUM_BUS_21':
        return '21인승 프리미엄버스';
      case 'SMALL_BUS_28':
        return '28인승 우등버스';
      case 'SMALL_BUS_33':
        return '33인승 우등버스';
      case 'SPRINTER_12':
        return '12인승 스프린터';
      case 'VAN_12':
        return '12인승 밴';
    }
  },
  eventStatus(v: EventsView['eventStatus']) {
    switch (v) {
      case 'INACTIVE':
        return '행사 비활성';
      case 'OPEN':
        return '행사 수요조사 모집 중';
      case 'CLOSED':
        return '행사 수요조사 모집 종료';
      case 'ENDED':
        return '행사 종료';
    }
  },
  dailyEventStatus(v: EventsView['dailyEvents'][number]['status']) {
    switch (v) {
      case 'INACTIVE':
        return '이 일자의 행사 비활성';
      case 'OPEN':
        return '이 일자의 행사 수요조사 모집 중';
      case 'CLOSED':
        return '이 일자의 행사 수요조사 모집 종료';
      case 'ENDED':
        return '이 일자의 행사 종료';
    }
  },
  shuttleRouteStatus(v: ShuttleRoutesView['status']) {
    switch (v) {
      case 'OPEN':
        return '예약 모집 중';
      case 'CLOSED':
        return '예약 마감';
      case 'CONFIRMED':
        return '배차가 완료되고 모든 정보가 확정된 상태';
      case 'ENDED':
        return '운행 종료';
      case 'CANCELLED':
        return '무산';
      case 'INACTIVE':
        return '비활성';
    }
  },
  reservationStatus(v: ReservationView['reservationStatus']) {
    switch (v) {
      case 'NOT_PAYMENT':
        return '미결제';
      case 'COMPLETE_PAYMENT':
        return '결제 완료';
      case 'RESERVATION_CONFIRMED':
        return '확정';
      case 'CANCEL':
        return '취소';
    }
  },
  cancelStatus(v: ReservationView['cancelStatus']) {
    switch (v) {
      case 'NONE':
        return 'X';
      case 'CANCEL_REQUEST':
        return '환불 요청';
      case 'CANCEL_COMPLETE':
        return '환불 완료';
    }
  },
});

export default Stringifier;
