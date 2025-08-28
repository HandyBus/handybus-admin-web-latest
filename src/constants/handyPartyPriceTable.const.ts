import { HandyPartyRouteArea } from './handyPartyArea.const';

export type HandyPartyPriceTable = {
  area: HandyPartyRouteArea;
  regularPrice: number;
  earlybirdPrice: number;
}[];

// 고양종합운동장 25.06
export const GOYANG_STADIUM_PRICE_TABLE: HandyPartyPriceTable = [
  {
    area: '동북권',
    regularPrice: 34300,
    earlybirdPrice: 30000,
  },
  {
    area: '서북권',
    regularPrice: 25700,
    earlybirdPrice: 22500,
  },
  {
    area: '중심권',
    regularPrice: 28600,
    earlybirdPrice: 25000,
  },
  {
    area: '성동.광진권',
    regularPrice: 34300,
    earlybirdPrice: 30000,
  },
  {
    area: '강서권',
    regularPrice: 20000,
    earlybirdPrice: 17500,
  },
  {
    area: '서남권',
    regularPrice: 28600,
    earlybirdPrice: 25000,
  },
  {
    area: '동남권',
    regularPrice: 34300,
    earlybirdPrice: 30000,
  },
  {
    area: '수원',
    regularPrice: 37100,
    earlybirdPrice: 32500,
  },
  {
    area: '성남',
    regularPrice: 37100,
    earlybirdPrice: 32500,
  },
  {
    area: '고양',
    regularPrice: 20000,
    earlybirdPrice: 17500,
  },
  {
    area: '부평',
    regularPrice: 21400,
    earlybirdPrice: 18750,
  },
  {
    area: '광명',
    regularPrice: 22800,
    earlybirdPrice: 20000,
  },
  {
    area: '동탄',
    regularPrice: 37100,
    earlybirdPrice: 0, // 얼리버드 없음
  },
  {
    area: '안양',
    regularPrice: 25700,
    earlybirdPrice: 0, // 얼리버드 없음
  },
  {
    area: '안산',
    regularPrice: 37100,
    earlybirdPrice: 32500,
  },
  {
    area: '하남',
    regularPrice: 40000,
    earlybirdPrice: 35000,
  },
  {
    area: '남양주',
    regularPrice: 37100,
    earlybirdPrice: 32500,
  },
  {
    area: '용인',
    regularPrice: 0,
    earlybirdPrice: 0,
  },
  {
    area: '시흥',
    regularPrice: 0,
    earlybirdPrice: 0,
  },
  {
    area: '파주',
    regularPrice: 0,
    earlybirdPrice: 0,
  },
  {
    area: '평택',
    regularPrice: 0,
    earlybirdPrice: 0,
  },
  {
    area: '부천',
    regularPrice: 0,
    earlybirdPrice: 0,
  },
];

// KSPO DOME 25.07
export const KSPO_DOME_PRICE_TABLE: HandyPartyPriceTable = [
  {
    area: '동북권',
    regularPrice: 20800,
    earlybirdPrice: 19200,
  },
  {
    area: '서북권',
    regularPrice: 24700,
    earlybirdPrice: 22800,
  },
  {
    area: '중심권',
    regularPrice: 20800,
    earlybirdPrice: 19200,
  },
  {
    area: '성동.광진권',
    regularPrice: 16900,
    earlybirdPrice: 15600,
  },
  {
    area: '강서권',
    regularPrice: 24700,
    earlybirdPrice: 22800,
  },
  {
    area: '서남권',
    regularPrice: 20800,
    earlybirdPrice: 19200,
  },
  {
    area: '동남권',
    regularPrice: 16900,
    earlybirdPrice: 15600,
  },
  {
    area: '수원',
    regularPrice: 28600,
    earlybirdPrice: 26400,
  },
  {
    area: '성남',
    regularPrice: 20800,
    earlybirdPrice: 19200,
  },
  {
    area: '고양',
    regularPrice: 28600,
    earlybirdPrice: 26400,
  },
  {
    area: '부평',
    regularPrice: 36400,
    earlybirdPrice: 33600,
  },
  {
    area: '광명',
    regularPrice: 24700,
    earlybirdPrice: 22800,
  },
  {
    area: '동탄',
    regularPrice: 28600,
    earlybirdPrice: 26400,
  },
  {
    area: '안양',
    regularPrice: 24700,
    earlybirdPrice: 22800,
  },
  {
    area: '안산',
    regularPrice: 32500,
    earlybirdPrice: 30000,
  },
  {
    area: '하남',
    regularPrice: 13000,
    earlybirdPrice: 12000,
  },
  {
    area: '남양주',
    regularPrice: 24700,
    earlybirdPrice: 22800,
  },
  {
    area: '용인',
    regularPrice: 40300,
    earlybirdPrice: 37200,
  },
  {
    area: '시흥',
    regularPrice: 36400,
    earlybirdPrice: 33600,
  },
  {
    area: '파주',
    regularPrice: 36400,
    earlybirdPrice: 33600,
  },
  {
    area: '평택',
    regularPrice: 44200,
    earlybirdPrice: 40800,
  },
  {
    area: '부천',
    regularPrice: 0,
    earlybirdPrice: 0,
  },
];
