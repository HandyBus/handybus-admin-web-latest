import { EventStatus } from '@/types/event.type';
import { RefundStatus } from '@/types/payment.type';
import {
  CancelStatus,
  HandyStatus,
  ReservationStatus,
} from '@/types/reservation.type';
import { BusType } from '@/types/shuttleBus.type';
import { ShuttleRouteStatus, TripType } from '@/types/shuttleRoute.type';
import { AuthChannelType, Gender } from '@/types/user.type';

const Stringifier = Object.freeze({
  gender(v: Gender) {
    switch (v) {
      case 'MALE':
        return '남';
      case 'FEMALE':
        return '여';
      default:
        return '-';
    }
  },
  authChannelType(v: AuthChannelType) {
    switch (v) {
      case 'kakao':
        return '카카오';
      case 'naver':
        return '네이버';
      default:
        return '-';
    }
  },
  handyStatus(v: HandyStatus) {
    switch (v) {
      case 'NOT_SUPPORTED':
        return '미지원';
      case 'SUPPORTED':
        return '지원함';
      case 'DECLINED':
        return '거절됨';
      case 'ACCEPTED':
        return '승인됨';
    }
  },
  busType(v: BusType) {
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
  eventStatus(v: EventStatus) {
    switch (v) {
      case 'INACTIVE':
        return '비활성';
      case 'OPEN':
        return '수요조사 모집 중';
      case 'CLOSED':
        return '수요조사 모집 종료';
      case 'ENDED':
        return '종료';
    }
  },
  dailyEventStatus(v: EventStatus) {
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
  shuttleRouteStatus(v: ShuttleRouteStatus) {
    switch (v) {
      case 'OPEN':
        return '예약 모집 중';
      case 'CLOSED':
        return '예약 마감';
      case 'ENDED':
        return '운행 종료';
      case 'CANCELLED':
        return '무산';
      case 'INACTIVE':
        return '비활성';
    }
  },
  reservationStatus(v: ReservationStatus) {
    switch (v) {
      case 'NOT_PAYMENT':
        return '미결제';
      case 'COMPLETE_PAYMENT':
        return '결제 완료';
      case 'CANCEL':
        return '취소';
    }
  },
  cancelStatus(v: CancelStatus) {
    switch (v) {
      case 'NONE':
        return 'X';
      case 'CANCEL_REQUEST':
        return '환불 요청';
      case 'CANCEL_COMPLETE':
        return '환불 완료';
    }
  },
  refundStatus(v: RefundStatus) {
    switch (v) {
      case 'REQUESTED':
        return '환불 요청';
      case 'COMPLETED':
        return '환불 완료';
      case 'FAILED':
        return '환불 거절';
    }
  },
  tripType(v: TripType) {
    switch (v) {
      case 'TO_DESTINATION':
        return '목적지행';
      case 'FROM_DESTINATION':
        return '귀가행';
      case 'ROUND_TRIP':
        return '왕복';
    }
  },
});

export default Stringifier;
