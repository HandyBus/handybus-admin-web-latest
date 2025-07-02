import { HandyPartyRouteArea } from './handyPartyArea.const';

export type HandyPartyPriceTable = {
  area: HandyPartyRouteArea;
  price: number;
}[];

// 고양종합운동장 25.06
export const GOYANG_STADIUM_PRICE_TABLE: HandyPartyPriceTable = [
  {
    area: '동북권',
    price: 30000,
  },
  {
    area: '서북권',
    price: 22500,
  },
  {
    area: '중심권',
    price: 25000,
  },
  {
    area: '성동.광진권',
    price: 30000,
  },
  {
    area: '강서권',
    price: 17500,
  },
  {
    area: '서남권',
    price: 25000,
  },
  {
    area: '동남권',
    price: 30000,
  },
  {
    area: '수원',
    price: 32500,
  },
  {
    area: '성남',
    price: 32500,
  },
  {
    area: '고양',
    price: 17500,
  },
  {
    area: '부평',
    price: 18750,
  },
  {
    area: '광명',
    price: 20000,
  },
  {
    area: '동탄',
    price: 37143,
  },
  {
    area: '안양',
    price: 25714,
  },
  {
    area: '안산',
    price: 32500,
  },
  {
    area: '하남',
    price: 35000,
  },
  {
    area: '남양주',
    price: 32500,
  },
] as const;
