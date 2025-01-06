import { HandyStatusType } from '@/types/v1/reservation.type';

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
});

export default Stringifier;
