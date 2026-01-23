import { BigRegionsType } from '@/constants/regions';

export const DEFAULT_HUBS: readonly {
  name: string;
  bigRegionName: BigRegionsType;
}[] = [
  {
    name: '서울역 15번 출구 도보 150M 윤슬공원 앞',
    bigRegionName: '서울특별시',
  },
  {
    name: '잠실역 제타플렉스 앞',
    bigRegionName: '서울특별시',
  },
  {
    name: '합정역 8번출구 60M 앞',
    bigRegionName: '서울특별시',
  },
  {
    name: '노원역 와우패션클럽 망고식스 앞',
    bigRegionName: '서울특별시',
  },
  {
    name: '동탄역 2번출구 앞 버스정류장',
    bigRegionName: '경기도',
  },
  {
    name: '미금역 4번 출구 앞 성남고용복지플러스센터',
    bigRegionName: '경기도',
  },
  {
    name: '수원역 지하상가 13번출구 앞 공항버스 정류장',
    bigRegionName: '경기도',
  },
  {
    name: '영통역 1번 출구 앞',
    bigRegionName: '경기도',
  },
  {
    name: '중앙역 2번출구 앞 횡단보도',
    bigRegionName: '경기도',
  },
  {
    name: '부평역 7번 출구 노브랜드버거 앞',
    bigRegionName: '인천광역시',
  },
  {
    name: '대전 복합터미널 건너편 대덕약국',
    bigRegionName: '대전광역시',
  },
  {
    name: '대전 시청역 4번출구 앞',
    bigRegionName: '대전광역시',
  },
  {
    name: '반월당역 18번 출구 더현대 대구 앞',
    bigRegionName: '대구광역시',
  },
  {
    name: '용산역 5번 출구 뒤 20m',
    bigRegionName: '대구광역시',
  },
  {
    name: '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞',
    bigRegionName: '광주광역시',
  },
  {
    name: '동래역 3번 출구 150M 앞',
    bigRegionName: '부산광역시',
  },
  {
    name: '서면역 12번 출구 앞',
    bigRegionName: '부산광역시',
  },
];

export type DefaultHubName = (typeof DEFAULT_HUBS)[number]['name'];
