import { BusSortType } from '@/types/v1/bus.type';
import { HandyStatusType } from '@/types/v1/reservation.type';
import { EventsViewType } from '@/types/v2/event.type';

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
  eventStatus(v: EventsViewType['eventStatus']) {
    switch (v) {
      case 'INACTIVE':
        return '비활성화됨';
      case 'OPEN':
        return '열림';
      case 'CLOSED':
        return '닫힘';
      case 'ENDED':
        return '종료됨';
    }
  },
});

export default Stringifier;
