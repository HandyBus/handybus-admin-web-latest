import { postCoupon } from '@/services/coupon.service';
import { CreateCouponRequest } from '@/types/coupon.type';
import { EventsViewEntity } from '@/types/event.type';
import dayjs from 'dayjs';

export const SHUTTLE_DEMAND_COUPON_CODE_PREFIX = 'DEMAND';

export const createShuttleDemandCouponCode = (eventId: string) => {
  return `${SHUTTLE_DEMAND_COUPON_CODE_PREFIX}-${eventId}`;
};

export const postShuttleDemandCoupon = async (event: EventsViewEntity) => {
  const code = createShuttleDemandCouponCode(event.eventId);
  const name = '수요조사리워드';
  const validFrom = dayjs().startOf('day').toISOString();
  const validTo = dayjs(event.endDate).startOf('day').toISOString();

  const body = {
    code,
    name,
    discountType: 'AMOUNT',
    discountAmount: 1000,
    maxCouponUsage: 0,
    maxApplicablePeople: 1,
    validFrom,
    validTo,
    allowedEventId: event.eventId,
    issueType: 'CODE_INPUT',
    processingStrategy: 'ONCE_PER_ACCOUNT',
    validityStartStrategy: 'FIXED_DATE',
    validityEndStrategy: 'FIXED_DATE',
  } satisfies CreateCouponRequest;

  return await postCoupon(body);
};
