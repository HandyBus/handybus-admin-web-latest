import { IssuedCouponStatus } from '@/types/coupon.type';
import { DailyEventStatus, EventStatus, EventType } from '@/types/event.type';
import { RefundStatus } from '@/types/payment.type';
import {
  CancelStatus,
  HandyStatus,
  ReservationStatus,
} from '@/types/reservation.type';
import { BusType } from '@/types/shuttleBus.type';
import { ShuttleRouteStatus, TripType } from '@/types/shuttleRoute.type';
import { Gender } from '@/types/user.type';
import { RefundRequestType } from '@/types/payment.type';
import {
  JobCategory,
  CareerType,
  JobApplicationType,
  JobApplicationStatus,
} from '@/types/recruitment.type';

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
      case 'STARIA_7':
        return '7인승 스타리아';
      case 'STARIA_9':
        return '9인승 스타리아';
    }
  },
  eventStatus(v: EventStatus) {
    switch (v) {
      case 'INACTIVE':
        return '비활성';
      case 'STAND_BY':
        return '행사 대기';
      case 'OPEN':
        return '행사 오픈';
      case 'ENDED':
        return '종료';
    }
  },
  dailyEventStatus(v: DailyEventStatus) {
    switch (v) {
      case 'INACTIVE':
        return '이 일자의 행사 비활성';
      case 'OPEN':
        return '이 일자의 행사 오픈';
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
        return '예약 취소 요청';
      case 'CANCEL_COMPLETE':
        return '예약 취소 완료';
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
        return '행사장행';
      case 'FROM_DESTINATION':
        return '귀가행';
      case 'ROUND_TRIP':
        return '왕복';
    }
  },
  issuedCouponStatus(v: IssuedCouponStatus) {
    switch (v) {
      case 'BEFORE_USE':
        return '미사용';
      case 'USED':
        return '사용 완료';
      case 'EXPIRED':
        return '만료';
      case 'RETRIEVED':
        return '회수됨';
      case 'DELETED':
        return '삭제';
    }
  },
  refundRequestType(v: RefundRequestType) {
    switch (v) {
      case 'CANCEL':
        return 'CANCEL (행사 취소로 인한 환불)';
      case 'ADMIN_ADJUSTMENT':
        return 'ADMIN_ADJUSTMENT (관리자 조정으로 금액만 환불)';
      case 'ADMIN_RETRIEVAL':
        return 'ADMIN_RETRIEVAL (무산 등 관리자 회수로 인한 예약 취소 및 환불)';
      case 'PAYBACK':
        return 'PAYBACK (핸디 및 기타 환급)';
    }
  },
  eventType(v: EventType) {
    switch (v) {
      case 'CONCERT':
        return '콘서트';
      case 'FESTIVAL':
        return '페스티벌';
      case 'SPORTS':
        return '스포츠';
    }
  },
  jobCategory(v: JobCategory) {
    switch (v) {
      case 'FRONTEND':
        return '프론트엔드';
      case 'BACKEND':
        return '백엔드';
      case 'MOBILE':
        return '모바일';
      case 'DATA':
        return '데이터';
      case 'DESIGN':
        return '디자인';
      case 'PRODUCT':
        return '제품';
      case 'MARKETING':
        return '마케팅';
      case 'SALES':
        return '영업';
      case 'HR':
        return '인사';
      case 'ETC':
        return '기타';
    }
  },
  careerType(v: CareerType) {
    switch (v) {
      case 'CAREER':
        return '경력';
      case 'NEW':
        return '신입';
      case 'BOTH':
        return '경력/신입';
    }
  },
  jobApplicationType(v: JobApplicationType) {
    switch (v) {
      case 'JOB':
        return '채용 공고 지원';
      case 'TALENT_POOL':
        return '인재풀 등록';
    }
  },
  jobApplicationStatus(v: JobApplicationStatus) {
    switch (v) {
      case 'SUBMITTED':
        return '제출됨';
      case 'REVIEWING':
        return '검토 중';
      case 'PASSED':
        return '합격';
      case 'REJECTED':
        return '불합격';
    }
  },
});

export default Stringifier;
