import { DefaultHubName } from './default-hubs.const';

export interface TripTime {
  returnTripTime: number;
  cushionTime: number;
  eventTripTime: number;
}

export const DESTINATION_TRIP_TIME_BY_DEFAULT_HUB: {
  [destinationName: string]: {
    [hubName: DefaultHubName]: {
      eventTripTime: number;
      returnTripTime: number;
      cushionTime: number;
    };
  };
} = {
  '(예정)고양종합운동장 주경기장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 160,
      returnTripTime: 140,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 150,
      returnTripTime: 130,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 250,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 280,
      returnTripTime: 230,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  'KSPO DOME': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 260,
      returnTripTime: 220,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 250,
      returnTripTime: 210,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 230,
      returnTripTime: 190,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 180,
      returnTripTime: 150,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 200,
      returnTripTime: 170,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 330,
      returnTripTime: 270,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 40,
      returnTripTime: 20,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
  },
  '경희대학교 서울캠퍼스 평화의전당': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 140,
      returnTripTime: 120,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 300,
      returnTripTime: 260,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 260,
      returnTripTime: 220,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 190,
      returnTripTime: 160,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 210,
      returnTripTime: 180,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 340,
      returnTripTime: 280,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 360,
      returnTripTime: 300,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
  },
  고양종합운동장: {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 160,
      returnTripTime: 140,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 150,
      returnTripTime: 130,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 250,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 280,
      returnTripTime: 230,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  고척스카이돔: {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 270,
      returnTripTime: 230,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 300,
      returnTripTime: 260,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 200,
      returnTripTime: 170,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 220,
      returnTripTime: 190,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 40,
      returnTripTime: 20,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  난지한강공원: {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 140,
      returnTripTime: 120,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 260,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 240,
      returnTripTime: 210,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 260,
      returnTripTime: 230,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 360,
      returnTripTime: 300,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 380,
      returnTripTime: 320,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 40,
      returnTripTime: 20,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  블루스퀘어: {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 270,
      returnTripTime: 230,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 290,
      returnTripTime: 250,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 210,
      returnTripTime: 180,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 340,
      returnTripTime: 280,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 360,
      returnTripTime: 300,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
  },
  서울월드컵경기장: {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 290,
      returnTripTime: 250,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 30,
      returnTripTime: 10,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  '올림픽공원 올림픽홀': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 260,
      returnTripTime: 220,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 250,
      returnTripTime: 210,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 230,
      returnTripTime: 190,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 180,
      returnTripTime: 150,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 200,
      returnTripTime: 170,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 330,
      returnTripTime: 270,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 40,
      returnTripTime: 20,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
  },
  '올림픽공원 핸드볼경기장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 260,
      returnTripTime: 220,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 250,
      returnTripTime: 210,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 230,
      returnTripTime: 190,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 180,
      returnTripTime: 150,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 200,
      returnTripTime: 170,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 330,
      returnTripTime: 270,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 40,
      returnTripTime: 20,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
  },
  '인스파이어 아레나': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 240,
      cushionTime: 50,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 320,
      returnTripTime: 270,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 310,
      returnTripTime: 260,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 390,
      returnTripTime: 330,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
  },
  '인천 상상플랫폼 야외광장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 320,
      returnTripTime: 270,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 310,
      returnTripTime: 260,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 360,
      returnTripTime: 300,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 380,
      returnTripTime: 320,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  '인천 파라다이스 시티': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 120,
      returnTripTime: 100,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 240,
      cushionTime: 50,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 320,
      returnTripTime: 270,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 390,
      returnTripTime: 330,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
  },
  '인천문학경기장 동문광장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 280,
      returnTripTime: 230,
      cushionTime: 50,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 290,
      returnTripTime: 240,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 220,
      returnTripTime: 190,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 240,
      returnTripTime: 210,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 140,
      returnTripTime: 110,
      cushionTime: 30,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
  },
  '인천문학경기장 주경기장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 240,
      cushionTime: 50,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 220,
      returnTripTime: 190,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 240,
      returnTripTime: 210,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
  },
  인천아시아드주경기장: {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 310,
      returnTripTime: 260,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 290,
      returnTripTime: 240,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 380,
      returnTripTime: 320,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 400,
      returnTripTime: 340,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
  },
  '잠실 실내체육관': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 80,
      returnTripTime: 60,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 90,
      returnTripTime: 70,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 280,
      returnTripTime: 240,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 260,
      returnTripTime: 220,
      cushionTime: 40,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 240,
      returnTripTime: 200,
      cushionTime: 40,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 190,
      returnTripTime: 160,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 210,
      returnTripTime: 180,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 330,
      returnTripTime: 270,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 60,
      returnTripTime: 40,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 30,
      returnTripTime: 10,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
  },
  '킨텍스 제1전시장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 160,
      returnTripTime: 140,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 150,
      returnTripTime: 130,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 250,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 280,
      returnTripTime: 230,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
  '킨텍스 제2전시장': {
    '동탄역 2번출구 앞 버스정류장': {
      eventTripTime: 160,
      returnTripTime: 140,
      cushionTime: 20,
    },
    '미금역 4번 출구 앞 성남고용복지플러스센터': {
      eventTripTime: 130,
      returnTripTime: 110,
      cushionTime: 20,
    },
    '수원역 지하상가 13번출구 앞 공항버스 정류장': {
      eventTripTime: 110,
      returnTripTime: 90,
      cushionTime: 20,
    },
    '영통역 1번 출구 앞': {
      eventTripTime: 150,
      returnTripTime: 130,
      cushionTime: 20,
    },
    '중앙역 2번출구 앞 횡단보도': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '유스퀘어 광주종합버스터미널 건너편 외갓집국밥 앞': {
      eventTripTime: 290,
      returnTripTime: 250,
      cushionTime: 40,
    },
    '반월당역 18번 출구 더현대 대구 앞': {
      eventTripTime: 300,
      returnTripTime: 250,
      cushionTime: 50,
    },
    '용산역 5번 출구 뒤 20m': {
      eventTripTime: 280,
      returnTripTime: 230,
      cushionTime: 50,
    },
    '대전 복합터미널 건너편 대덕약국': {
      eventTripTime: 230,
      returnTripTime: 200,
      cushionTime: 30,
    },
    '대전 시청역 4번출구 앞': {
      eventTripTime: 250,
      returnTripTime: 220,
      cushionTime: 30,
    },
    '동래역 3번 출구 150M 앞': {
      eventTripTime: 350,
      returnTripTime: 290,
      cushionTime: 60,
    },
    '서면역 12번 출구 앞': {
      eventTripTime: 370,
      returnTripTime: 310,
      cushionTime: 60,
    },
    '노원역 와우패션클럽 망고식스 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '서울역 15번 출구 도보 150M 윤슬공원 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
    '잠실역 제타플렉스 앞': {
      eventTripTime: 100,
      returnTripTime: 80,
      cushionTime: 20,
    },
    '합정역 8번출구 60M 앞': {
      eventTripTime: 50,
      returnTripTime: 30,
      cushionTime: 20,
    },
    '부평역 7번 출구 노브랜드버거 앞': {
      eventTripTime: 70,
      returnTripTime: 50,
      cushionTime: 20,
    },
  },
};
