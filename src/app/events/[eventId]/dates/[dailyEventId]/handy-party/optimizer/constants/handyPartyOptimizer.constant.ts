export const PASSENGERS_PER_PARTY = 5;

export const HANDY_PARTY_OPTIMIZER_MESSAGES = {
  ERROR: {
    INVALID_TRIP_TYPE: '유효하지 않은 여행 타입입니다.',
    NO_EVENT_PLACE: '행사장소를 선택해주세요.',
    NO_VALID_RESERVATIONS: '해당 노선에 유효한 예약이 존재하지 않습니다.',
    OVER_MAX_PARTY_SIZE:
      '호차에 할당된 인원 수가 6명 이상입니다. 조정 후 다시 시도해주세요.',
    EXCEL_DOWNLOAD_ERROR: '엑셀 다운로드 중 오류가 발생했습니다.',
    DATA_FETCH_ERROR: '예약 또는 행사장소 정보를 불러오는데 실패했습니다.',
    MISSING_HUB_DATA: '희망 주소 및 위도, 경도가 비어있습니다.',
    CALCULATION_FAILED: '최적 노선 계산 중 오류가 발생했습니다.',
  },
  SUCCESS: {
    WORK_SAVED: '현재 작업이 저장되었습니다.',
    EXCEL_DOWNLOADED: '엑셀 파일이 다운로드되었습니다.',
  },
} as const;

export const HANDY_PARTY_MAP_STATE_STORAGE_KEY =
  'handy_party_map_state' as const;
