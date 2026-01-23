import { BigRegionsType } from '@/constants/regions';

export const MAX_PASSENGER_COUNT_BY_BIG_REGION: {
  [bigRegion in BigRegionsType]: number;
} = {
  서울특별시: 44,
  인천광역시: 44,
  경기도: 44,
  강원특별자치도: 28,
  충청북도: 28,
  충청남도: 28,
  전북특별자치도: 28,
  전라남도: 28,
  경상북도: 28,
  경상남도: 28,
  대구광역시: 28,
  대전광역시: 28,
  부산광역시: 28,
  광주광역시: 28,
  울산광역시: 28,
  제주특별자치도: 28,
  세종특별자치시: 28,
};
