export type BigRegionsType = (typeof BIG_REGIONS)[number];
export type SmallRegionsType =
  (typeof SMALL_REGIONS)[keyof typeof SMALL_REGIONS][number];

export const BIG_REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '충청북도',
  '충청남도',
  '전라남도',
  '경상북도',
  '경상남도',
  '강원특별자치도',
  '전북특별자치도',
  '제주특별자치도',
] as const;

export const SMALL_REGIONS = {
  서울특별시: [
    '강남구',
    '종로구',
    '중구',
    '용산구',
    '성동구',
    '광진구',
    '동대문구',
    '중랑구',
    '성북구',
    '강북구',
    '도봉구',
    '노원구',
    '은평구',
    '서대문구',
    '마포구',
    '양천구',
    '강서구',
    '구로구',
    '금천구',
    '영등포구',
    '동작구',
    '관악구',
    '서초구',
    '송파구',
    '강동구',
  ],
  부산광역시: [
    '강서구',
    '금정구',
    '기장군',
    '남구',
    '동구',
    '동래구',
    '부산진구',
    '북구',
    '사상구',
    '사하구',
    '서구',
    '수영구',
    '연제구',
    '영도구',
    '중구',
    '해운대구',
  ],
  대구광역시: [
    '남구',
    '달서구',
    '달성군',
    '동구',
    '북구',
    '서구',
    '수성구',
    '중구',
  ],
  인천광역시: [
    '계양구',
    '미추홀구',
    '남동구',
    '동구',
    '부평구',
    '서구',
    '연수구',
    '중구',
    '강화군',
    '옹진군',
  ],
  광주광역시: ['광산구', '남구', '동구', '북구', '서구'],
  대전광역시: ['대덕구', '동구', '서구', '유성구', '중구'],
  울산광역시: ['남구', '동구', '북구', '중구', '울주군'],
  세종특별자치시: [
    '조치원읍',
    '연기면',
    '연동면',
    '부강면',
    '금남면',
    '장군면',
    '연서면',
    '전의면',
    '전동면',
    '소정면',
    '한솔동',
    '도담동',
    '아름동',
    '종촌동',
    '고운동',
    '소담동',
    '보람동',
    '대평동',
    '반곡동',
    '새롬동',
    '다정동',
    '해밀동',
    '합강동',
    '어진동',
  ],
  경기도: [
    '수원시',
    '성남시',
    '안양시',
    '부천시',
    '광명시',
    '평택시',
    '동두천시',
    '안산시',
    '고양시',
    '과천시',
    '의왕시',
    '구리시',
    '남양주시',
    '용인시',
    '시흥시',
    '군포시',
    '의정부시',
    '하남시',
    '이천시',
    '안성시',
    '김포시',
    '화성시',
    '광주시',
    '양주시',
    '포천시',
    '여주시',
    '가평군',
    '양평군',
    '연천군',
  ],
  강원특별자치도: [
    '춘천시',
    '원주시',
    '강릉시',
    '동해시',
    '태백시',
    '속초시',
    '삼척시',
    '홍천군',
    '횡성군',
    '영월군',
    '평창군',
    '정선군',
    '철원군',
    '화천군',
    '양구군',
    '인제군',
    '고성군',
    '양양군',
  ],
  충청북도: [
    '청주시',
    '충주시',
    '제천시',
    '보은군',
    '옥천군',
    '영동군',
    '진천군',
    '괴산군',
    '음성군',
    '단양군',
    '증평군',
  ],
  충청남도: [
    '천안시',
    '공주시',
    '보령시',
    '아산시',
    '서산시',
    '논산시',
    '계룡시',
    '당진시',
    '금산군',
    '부여군',
    '서천군',
    '청양군',
    '홍성군',
    '예산군',
    '태안군',
  ],
  전북특별자치도: [
    '전주시',
    '군산시',
    '익산시',
    '정읍시',
    '남원시',
    '김제시',
    '완주군',
    '진안군',
    '무주군',
    '장수군',
    '임실군',
    '순창군',
    '고창군',
    '부안군',
  ],
  전라남도: [
    '목포시',
    '여수시',
    '순천시',
    '나주시',
    '광양시',
    '담양군',
    '곡성군',
    '구례군',
    '고흥군',
    '보성군',
    '화순군',
    '장흥군',
    '강진군',
    '해남군',
    '영암군',
    '무안군',
    '함평군',
    '영광군',
    '장성군',
    '완도군',
    '진도군',
    '신안군',
  ],
  경상북도: [
    '포항시',
    '경주시',
    '김천시',
    '안동시',
    '구미시',
    '영주시',
    '영천시',
    '상주시',
    '문경시',
    '경산시',
    '군위군',
    '의성군',
    '청송군',
    '영양군',
    '영덕군',
    '청도군',
    '고령군',
    '성주군',
    '칠곡군',
    '예천군',
    '봉화군',
    '울진군',
    '울릉군',
  ],
  경상남도: [
    '창원시',
    '진주시',
    '통영시',
    '사천시',
    '김해시',
    '밀양시',
    '거제시',
    '양산시',
    '의령군',
    '함안군',
    '창녕군',
    '고성군',
    '남해군',
    '하동군',
    '산청군',
    '함양군',
    '거창군',
    '합천군',
  ],
  제주특별자치도: ['서귀포시', '제주시'],
} as const;

export const BIG_REGIONS_TO_COORDINATES: Record<
  BigRegionsType,
  { latitude: number; longitude: number }
> = {
  서울특별시: {
    latitude: 37.5642135,
    longitude: 127.0016985,
  },
  부산광역시: {
    latitude: 35.1731,
    longitude: 129.0714,
  },
  대구광역시: {
    latitude: 35.8501,
    longitude: 128.5206,
  },
  인천광역시: {
    latitude: 37.4752,
    longitude: 126.6313,
  },
  광주광역시: {
    latitude: 35.1501,
    longitude: 126.8559,
  },
  대전광역시: {
    latitude: 36.3578,
    longitude: 127.3867,
  },
  울산광역시: {
    latitude: 35.5377,
    longitude: 129.328,
  },
  세종특별자치시: {
    latitude: 36.6012,
    longitude: 127.2982,
  },
  경기도: {
    latitude: 37.4143,
    longitude: 127.4681,
  },
  충청북도: {
    latitude: 36.8023,
    longitude: 127.7238,
  },
  충청남도: {
    latitude: 36.4742,
    longitude: 126.782,
  },
  전라남도: {
    latitude: 34.8538,
    longitude: 126.8681,
  },
  경상북도: {
    latitude: 36.3974,
    longitude: 128.9877,
  },
  경상남도: {
    latitude: 35.3763,
    longitude: 128.1477,
  },
  강원특별자치도: {
    latitude: 37.8272,
    longitude: 128.3166,
  },
  전북특별자치도: {
    latitude: 35.7492,
    longitude: 127.1259,
  },
  제주특별자치도: {
    latitude: 33.489,
    longitude: 126.4983,
  },
} as const;

export const REGION_TO_ID: {
  [bigRegion: string]: { [smallRegion: string]: string };
} = {
  서울특별시: {
    강남구: '1',
    종로구: '4',
    중구: '5',
    용산구: '6',
    성동구: '7',
    광진구: '8',
    동대문구: '9',
    중랑구: '10',
    성북구: '11',
    강북구: '12',
    도봉구: '13',
    노원구: '14',
    은평구: '15',
    서대문구: '16',
    마포구: '17',
    양천구: '18',
    강서구: '19',
    구로구: '20',
    금천구: '21',
    영등포구: '22',
    동작구: '23',
    관악구: '24',
    서초구: '25',
    송파구: '27',
    강동구: '28',
  },
  부산광역시: {
    강서구: '29',
    금정구: '30',
    기장군: '31',
    남구: '32',
    동구: '33',
    동래구: '34',
    부산진구: '35',
    북구: '36',
    사상구: '37',
    사하구: '38',
    서구: '39',
    수영구: '40',
    연제구: '41',
    영도구: '42',
    중구: '43',
    해운대구: '44',
  },
  대구광역시: {
    남구: '45',
    달서구: '46',
    달성군: '47',
    동구: '48',
    북구: '49',
    서구: '50',
    수성구: '51',
    중구: '52',
  },
  인천광역시: {
    계양구: '53',
    미추홀구: '54',
    남동구: '55',
    동구: '56',
    부평구: '57',
    서구: '58',
    연수구: '59',
    중구: '60',
    강화군: '61',
    옹진군: '62',
  },
  광주광역시: {
    광산구: '63',
    남구: '64',
    동구: '65',
    북구: '66',
    서구: '67',
  },
  대전광역시: {
    대덕구: '69',
    동구: '70',
    서구: '71',
    유성구: '72',
    중구: '73',
  },
  울산광역시: {
    남구: '74',
    동구: '75',
    북구: '76',
    중구: '77',
    울주군: '78',
  },
  세종특별자치시: {
    조치원읍: '79',
    연기면: '80',
    연동면: '81',
    부강면: '82',
    금남면: '83',
    장군면: '84',
    연서면: '85',
    전의면: '86',
    전동면: '87',
    소정면: '88',
    한솔동: '89',
    도담동: '90',
    아름동: '91',
    종촌동: '92',
    고운동: '93',
    소담동: '94',
    보람동: '95',
    대평동: '96',
    반곡동: '97',
    새롬동: '98',
    다정동: '99',
    해밀동: '100',
    합강동: '101',
  },
  경기도: {
    수원시: '102',
    성남시: '103',
    안양시: '104',
    부천시: '105',
    광명시: '106',
    평택시: '107',
    동두천시: '108',
    안산시: '109',
    고양시: '110',
    과천시: '111',
    의왕시: '112',
    구리시: '113',
    남양주시: '114',
    용인시: '115',
    시흥시: '116',
    군포시: '117',
    의정부시: '118',
    하남시: '119',
    이천시: '120',
    안성시: '121',
    김포시: '122',
    화성시: '123',
    광주시: '124',
    양주시: '125',
    포천시: '126',
    여주시: '127',
    가평군: '128',
    양평군: '129',
    연천군: '130',
  },
  강원특별자치도: {
    춘천시: '131',
    원주시: '132',
    강릉시: '133',
    동해시: '134',
    태백시: '135',
    속초시: '136',
    삼척시: '137',
    홍천군: '138',
    횡성군: '139',
    영월군: '140',
    평창군: '141',
    정선군: '142',
    철원군: '143',
    화천군: '144',
    양구군: '145',
    인제군: '146',
    고성군: '147',
    양양군: '148',
  },
  충청북도: {
    청주시: '149',
    충주시: '150',
    제천시: '151',
    보은군: '152',
    옥천군: '153',
    영동군: '154',
    진천군: '155',
    괴산군: '156',
    음성군: '157',
    단양군: '158',
    증평군: '159',
  },
  충청남도: {
    천안시: '160',
    공주시: '161',
    보령시: '162',
    아산시: '163',
    서산시: '164',
    논산시: '165',
    계룡시: '166',
    당진시: '167',
    금산군: '168',
    부여군: '169',
    서천군: '170',
    청양군: '171',
    홍성군: '172',
    예산군: '173',
    태안군: '174',
  },
  전북특별자치도: {
    전주시: '175',
    군산시: '176',
    익산시: '177',
    정읍시: '178',
    남원시: '179',
    김제시: '180',
    완주군: '181',
    진안군: '182',
    무주군: '183',
    장수군: '184',
    임실군: '185',
    순창군: '186',
    고창군: '187',
    부안군: '188',
  },
  전라남도: {
    목포시: '189',
    여수시: '190',
    순천시: '191',
    나주시: '192',
    광양시: '193',
    담양군: '194',
    곡성군: '195',
    구례군: '196',
    고흥군: '197',
    보성군: '198',
    화순군: '199',
    장흥군: '200',
    강진군: '201',
    해남군: '202',
    영암군: '203',
    무안군: '204',
    함평군: '205',
    영광군: '206',
    장성군: '207',
    완도군: '208',
    진도군: '209',
    신안군: '210',
  },
  경상북도: {
    포항시: '234',
    경주시: '235',
    김천시: '236',
    안동시: '237',
    구미시: '238',
    영주시: '239',
    영천시: '240',
    상주시: '241',
    문경시: '242',
    경산시: '243',
    군위군: '244',
    의성군: '245',
    청송군: '246',
    영양군: '247',
    영덕군: '248',
    청도군: '249',
    고령군: '250',
    성주군: '251',
    칠곡군: '252',
    예천군: '253',
    봉화군: '254',
    울진군: '255',
    울릉군: '256',
  },
  경상남도: {
    창원시: '257',
    진주시: '258',
    통영시: '259',
    사천시: '260',
    김해시: '261',
    밀양시: '262',
    거제시: '263',
    양산시: '264',
    의령군: '265',
    함안군: '266',
    창녕군: '267',
    고성군: '268',
    남해군: '269',
    하동군: '270',
    산청군: '271',
    함양군: '272',
    거창군: '273',
    합천군: '274',
  },
  제주특별자치도: {
    서귀포시: '275',
    제주시: '276',
  },
} as const;

export const ID_TO_REGION: {
  [id: string]: { bigRegion: BigRegionsType; smallRegion: SmallRegionsType };
} = {
  1: {
    bigRegion: '서울특별시',
    smallRegion: '강남구',
  },
  4: {
    bigRegion: '서울특별시',
    smallRegion: '종로구',
  },
  5: {
    bigRegion: '서울특별시',
    smallRegion: '중구',
  },
  6: {
    bigRegion: '서울특별시',
    smallRegion: '용산구',
  },
  7: {
    bigRegion: '서울특별시',
    smallRegion: '성동구',
  },
  8: {
    bigRegion: '서울특별시',
    smallRegion: '광진구',
  },
  9: {
    bigRegion: '서울특별시',
    smallRegion: '동대문구',
  },
  10: {
    bigRegion: '서울특별시',
    smallRegion: '중랑구',
  },
  11: {
    bigRegion: '서울특별시',
    smallRegion: '성북구',
  },
  12: {
    bigRegion: '서울특별시',
    smallRegion: '강북구',
  },
  13: {
    bigRegion: '서울특별시',
    smallRegion: '도봉구',
  },
  14: {
    bigRegion: '서울특별시',
    smallRegion: '노원구',
  },
  15: {
    bigRegion: '서울특별시',
    smallRegion: '은평구',
  },
  16: {
    bigRegion: '서울특별시',
    smallRegion: '서대문구',
  },
  17: {
    bigRegion: '서울특별시',
    smallRegion: '마포구',
  },
  18: {
    bigRegion: '서울특별시',
    smallRegion: '양천구',
  },
  19: {
    bigRegion: '서울특별시',
    smallRegion: '강서구',
  },
  20: {
    bigRegion: '서울특별시',
    smallRegion: '구로구',
  },
  21: {
    bigRegion: '서울특별시',
    smallRegion: '금천구',
  },
  22: {
    bigRegion: '서울특별시',
    smallRegion: '영등포구',
  },
  23: {
    bigRegion: '서울특별시',
    smallRegion: '동작구',
  },
  24: {
    bigRegion: '서울특별시',
    smallRegion: '관악구',
  },
  25: {
    bigRegion: '서울특별시',
    smallRegion: '서초구',
  },
  27: {
    bigRegion: '서울특별시',
    smallRegion: '송파구',
  },
  28: {
    bigRegion: '서울특별시',
    smallRegion: '강동구',
  },
  29: {
    bigRegion: '부산광역시',
    smallRegion: '강서구',
  },
  30: {
    bigRegion: '부산광역시',
    smallRegion: '금정구',
  },
  31: {
    bigRegion: '부산광역시',
    smallRegion: '기장군',
  },
  32: {
    bigRegion: '부산광역시',
    smallRegion: '남구',
  },
  33: {
    bigRegion: '부산광역시',
    smallRegion: '동구',
  },
  34: {
    bigRegion: '부산광역시',
    smallRegion: '동래구',
  },
  35: {
    bigRegion: '부산광역시',
    smallRegion: '부산진구',
  },
  36: {
    bigRegion: '부산광역시',
    smallRegion: '북구',
  },
  37: {
    bigRegion: '부산광역시',
    smallRegion: '사상구',
  },
  38: {
    bigRegion: '부산광역시',
    smallRegion: '사하구',
  },
  39: {
    bigRegion: '부산광역시',
    smallRegion: '서구',
  },
  40: {
    bigRegion: '부산광역시',
    smallRegion: '수영구',
  },
  41: {
    bigRegion: '부산광역시',
    smallRegion: '연제구',
  },
  42: {
    bigRegion: '부산광역시',
    smallRegion: '영도구',
  },
  43: {
    bigRegion: '부산광역시',
    smallRegion: '중구',
  },
  44: {
    bigRegion: '부산광역시',
    smallRegion: '해운대구',
  },
  45: {
    bigRegion: '대구광역시',
    smallRegion: '남구',
  },
  46: {
    bigRegion: '대구광역시',
    smallRegion: '달서구',
  },
  47: {
    bigRegion: '대구광역시',
    smallRegion: '달성군',
  },
  48: {
    bigRegion: '대구광역시',
    smallRegion: '동구',
  },
  49: {
    bigRegion: '대구광역시',
    smallRegion: '북구',
  },
  50: {
    bigRegion: '대구광역시',
    smallRegion: '서구',
  },
  51: {
    bigRegion: '대구광역시',
    smallRegion: '수성구',
  },
  52: {
    bigRegion: '대구광역시',
    smallRegion: '중구',
  },
  53: {
    bigRegion: '인천광역시',
    smallRegion: '계양구',
  },
  54: {
    bigRegion: '인천광역시',
    smallRegion: '미추홀구',
  },
  55: {
    bigRegion: '인천광역시',
    smallRegion: '남동구',
  },
  56: {
    bigRegion: '인천광역시',
    smallRegion: '동구',
  },
  57: {
    bigRegion: '인천광역시',
    smallRegion: '부평구',
  },
  58: {
    bigRegion: '인천광역시',
    smallRegion: '서구',
  },
  59: {
    bigRegion: '인천광역시',
    smallRegion: '연수구',
  },
  60: {
    bigRegion: '인천광역시',
    smallRegion: '중구',
  },
  61: {
    bigRegion: '인천광역시',
    smallRegion: '강화군',
  },
  62: {
    bigRegion: '인천광역시',
    smallRegion: '옹진군',
  },
  63: {
    bigRegion: '광주광역시',
    smallRegion: '광산구',
  },
  64: {
    bigRegion: '광주광역시',
    smallRegion: '남구',
  },
  65: {
    bigRegion: '광주광역시',
    smallRegion: '동구',
  },
  66: {
    bigRegion: '광주광역시',
    smallRegion: '북구',
  },
  67: {
    bigRegion: '광주광역시',
    smallRegion: '서구',
  },
  69: {
    bigRegion: '대전광역시',
    smallRegion: '대덕구',
  },
  70: {
    bigRegion: '대전광역시',
    smallRegion: '동구',
  },
  71: {
    bigRegion: '대전광역시',
    smallRegion: '서구',
  },
  72: {
    bigRegion: '대전광역시',
    smallRegion: '유성구',
  },
  73: {
    bigRegion: '대전광역시',
    smallRegion: '중구',
  },
  74: {
    bigRegion: '울산광역시',
    smallRegion: '남구',
  },
  75: {
    bigRegion: '울산광역시',
    smallRegion: '동구',
  },
  76: {
    bigRegion: '울산광역시',
    smallRegion: '북구',
  },
  77: {
    bigRegion: '울산광역시',
    smallRegion: '중구',
  },
  78: {
    bigRegion: '울산광역시',
    smallRegion: '울주군',
  },
  79: {
    bigRegion: '세종특별자치시',
    smallRegion: '조치원읍',
  },
  80: {
    bigRegion: '세종특별자치시',
    smallRegion: '연기면',
  },
  81: {
    bigRegion: '세종특별자치시',
    smallRegion: '연동면',
  },
  82: {
    bigRegion: '세종특별자치시',
    smallRegion: '부강면',
  },
  83: {
    bigRegion: '세종특별자치시',
    smallRegion: '금남면',
  },
  84: {
    bigRegion: '세종특별자치시',
    smallRegion: '장군면',
  },
  85: {
    bigRegion: '세종특별자치시',
    smallRegion: '연서면',
  },
  86: {
    bigRegion: '세종특별자치시',
    smallRegion: '전의면',
  },
  87: {
    bigRegion: '세종특별자치시',
    smallRegion: '전동면',
  },
  88: {
    bigRegion: '세종특별자치시',
    smallRegion: '소정면',
  },
  89: {
    bigRegion: '세종특별자치시',
    smallRegion: '한솔동',
  },
  90: {
    bigRegion: '세종특별자치시',
    smallRegion: '도담동',
  },
  91: {
    bigRegion: '세종특별자치시',
    smallRegion: '아름동',
  },
  92: {
    bigRegion: '세종특별자치시',
    smallRegion: '종촌동',
  },
  93: {
    bigRegion: '세종특별자치시',
    smallRegion: '고운동',
  },
  94: {
    bigRegion: '세종특별자치시',
    smallRegion: '소담동',
  },
  95: {
    bigRegion: '세종특별자치시',
    smallRegion: '보람동',
  },
  96: {
    bigRegion: '세종특별자치시',
    smallRegion: '대평동',
  },
  97: {
    bigRegion: '세종특별자치시',
    smallRegion: '반곡동',
  },
  98: {
    bigRegion: '세종특별자치시',
    smallRegion: '새롬동',
  },
  99: {
    bigRegion: '세종특별자치시',
    smallRegion: '다정동',
  },
  100: {
    bigRegion: '세종특별자치시',
    smallRegion: '해밀동',
  },
  101: {
    bigRegion: '세종특별자치시',
    smallRegion: '합강동',
  },
  102: {
    bigRegion: '경기도',
    smallRegion: '수원시',
  },
  103: {
    bigRegion: '경기도',
    smallRegion: '성남시',
  },
  104: {
    bigRegion: '경기도',
    smallRegion: '안양시',
  },
  105: {
    bigRegion: '경기도',
    smallRegion: '부천시',
  },
  106: {
    bigRegion: '경기도',
    smallRegion: '광명시',
  },
  107: {
    bigRegion: '경기도',
    smallRegion: '평택시',
  },
  108: {
    bigRegion: '경기도',
    smallRegion: '동두천시',
  },
  109: {
    bigRegion: '경기도',
    smallRegion: '안산시',
  },
  110: {
    bigRegion: '경기도',
    smallRegion: '고양시',
  },
  111: {
    bigRegion: '경기도',
    smallRegion: '과천시',
  },
  112: {
    bigRegion: '경기도',
    smallRegion: '의왕시',
  },
  113: {
    bigRegion: '경기도',
    smallRegion: '구리시',
  },
  114: {
    bigRegion: '경기도',
    smallRegion: '남양주시',
  },
  115: {
    bigRegion: '경기도',
    smallRegion: '용인시',
  },
  116: {
    bigRegion: '경기도',
    smallRegion: '시흥시',
  },
  117: {
    bigRegion: '경기도',
    smallRegion: '군포시',
  },
  118: {
    bigRegion: '경기도',
    smallRegion: '의정부시',
  },
  119: {
    bigRegion: '경기도',
    smallRegion: '하남시',
  },
  120: {
    bigRegion: '경기도',
    smallRegion: '이천시',
  },
  121: {
    bigRegion: '경기도',
    smallRegion: '안성시',
  },
  122: {
    bigRegion: '경기도',
    smallRegion: '김포시',
  },
  123: {
    bigRegion: '경기도',
    smallRegion: '화성시',
  },
  124: {
    bigRegion: '경기도',
    smallRegion: '광주시',
  },
  125: {
    bigRegion: '경기도',
    smallRegion: '양주시',
  },
  126: {
    bigRegion: '경기도',
    smallRegion: '포천시',
  },
  127: {
    bigRegion: '경기도',
    smallRegion: '여주시',
  },
  128: {
    bigRegion: '경기도',
    smallRegion: '가평군',
  },
  129: {
    bigRegion: '경기도',
    smallRegion: '양평군',
  },
  130: {
    bigRegion: '경기도',
    smallRegion: '연천군',
  },
  131: {
    bigRegion: '강원특별자치도',
    smallRegion: '춘천시',
  },
  132: {
    bigRegion: '강원특별자치도',
    smallRegion: '원주시',
  },
  133: {
    bigRegion: '강원특별자치도',
    smallRegion: '강릉시',
  },
  134: {
    bigRegion: '강원특별자치도',
    smallRegion: '동해시',
  },
  135: {
    bigRegion: '강원특별자치도',
    smallRegion: '태백시',
  },
  136: {
    bigRegion: '강원특별자치도',
    smallRegion: '속초시',
  },
  137: {
    bigRegion: '강원특별자치도',
    smallRegion: '삼척시',
  },
  138: {
    bigRegion: '강원특별자치도',
    smallRegion: '홍천군',
  },
  139: {
    bigRegion: '강원특별자치도',
    smallRegion: '횡성군',
  },
  140: {
    bigRegion: '강원특별자치도',
    smallRegion: '영월군',
  },
  141: {
    bigRegion: '강원특별자치도',
    smallRegion: '평창군',
  },
  142: {
    bigRegion: '강원특별자치도',
    smallRegion: '정선군',
  },
  143: {
    bigRegion: '강원특별자치도',
    smallRegion: '철원군',
  },
  144: {
    bigRegion: '강원특별자치도',
    smallRegion: '화천군',
  },
  145: {
    bigRegion: '강원특별자치도',
    smallRegion: '양구군',
  },
  146: {
    bigRegion: '강원특별자치도',
    smallRegion: '인제군',
  },
  147: {
    bigRegion: '강원특별자치도',
    smallRegion: '고성군',
  },
  148: {
    bigRegion: '강원특별자치도',
    smallRegion: '양양군',
  },
  149: {
    bigRegion: '충청북도',
    smallRegion: '청주시',
  },
  150: {
    bigRegion: '충청북도',
    smallRegion: '충주시',
  },
  151: {
    bigRegion: '충청북도',
    smallRegion: '제천시',
  },
  152: {
    bigRegion: '충청북도',
    smallRegion: '보은군',
  },
  153: {
    bigRegion: '충청북도',
    smallRegion: '옥천군',
  },
  154: {
    bigRegion: '충청북도',
    smallRegion: '영동군',
  },
  155: {
    bigRegion: '충청북도',
    smallRegion: '진천군',
  },
  156: {
    bigRegion: '충청북도',
    smallRegion: '괴산군',
  },
  157: {
    bigRegion: '충청북도',
    smallRegion: '음성군',
  },
  158: {
    bigRegion: '충청북도',
    smallRegion: '단양군',
  },
  159: {
    bigRegion: '충청북도',
    smallRegion: '증평군',
  },
  160: {
    bigRegion: '충청남도',
    smallRegion: '천안시',
  },
  161: {
    bigRegion: '충청남도',
    smallRegion: '공주시',
  },
  162: {
    bigRegion: '충청남도',
    smallRegion: '보령시',
  },
  163: {
    bigRegion: '충청남도',
    smallRegion: '아산시',
  },
  164: {
    bigRegion: '충청남도',
    smallRegion: '서산시',
  },
  165: {
    bigRegion: '충청남도',
    smallRegion: '논산시',
  },
  166: {
    bigRegion: '충청남도',
    smallRegion: '계룡시',
  },
  167: {
    bigRegion: '충청남도',
    smallRegion: '당진시',
  },
  168: {
    bigRegion: '충청남도',
    smallRegion: '금산군',
  },
  169: {
    bigRegion: '충청남도',
    smallRegion: '부여군',
  },
  170: {
    bigRegion: '충청남도',
    smallRegion: '서천군',
  },
  171: {
    bigRegion: '충청남도',
    smallRegion: '청양군',
  },
  172: {
    bigRegion: '충청남도',
    smallRegion: '홍성군',
  },
  173: {
    bigRegion: '충청남도',
    smallRegion: '예산군',
  },
  174: {
    bigRegion: '충청남도',
    smallRegion: '태안군',
  },
  175: {
    bigRegion: '전북특별자치도',
    smallRegion: '전주시',
  },
  176: {
    bigRegion: '전북특별자치도',
    smallRegion: '군산시',
  },
  177: {
    bigRegion: '전북특별자치도',
    smallRegion: '익산시',
  },
  178: {
    bigRegion: '전북특별자치도',
    smallRegion: '정읍시',
  },
  179: {
    bigRegion: '전북특별자치도',
    smallRegion: '남원시',
  },
  180: {
    bigRegion: '전북특별자치도',
    smallRegion: '김제시',
  },
  181: {
    bigRegion: '전북특별자치도',
    smallRegion: '완주군',
  },
  182: {
    bigRegion: '전북특별자치도',
    smallRegion: '진안군',
  },
  183: {
    bigRegion: '전북특별자치도',
    smallRegion: '무주군',
  },
  184: {
    bigRegion: '전북특별자치도',
    smallRegion: '장수군',
  },
  185: {
    bigRegion: '전북특별자치도',
    smallRegion: '임실군',
  },
  186: {
    bigRegion: '전북특별자치도',
    smallRegion: '순창군',
  },
  187: {
    bigRegion: '전북특별자치도',
    smallRegion: '고창군',
  },
  188: {
    bigRegion: '전북특별자치도',
    smallRegion: '부안군',
  },
  189: {
    bigRegion: '전라남도',
    smallRegion: '목포시',
  },
  190: {
    bigRegion: '전라남도',
    smallRegion: '여수시',
  },
  191: {
    bigRegion: '전라남도',
    smallRegion: '순천시',
  },
  192: {
    bigRegion: '전라남도',
    smallRegion: '나주시',
  },
  193: {
    bigRegion: '전라남도',
    smallRegion: '광양시',
  },
  194: {
    bigRegion: '전라남도',
    smallRegion: '담양군',
  },
  195: {
    bigRegion: '전라남도',
    smallRegion: '곡성군',
  },
  196: {
    bigRegion: '전라남도',
    smallRegion: '구례군',
  },
  197: {
    bigRegion: '전라남도',
    smallRegion: '고흥군',
  },
  198: {
    bigRegion: '전라남도',
    smallRegion: '보성군',
  },
  199: {
    bigRegion: '전라남도',
    smallRegion: '화순군',
  },
  200: {
    bigRegion: '전라남도',
    smallRegion: '장흥군',
  },
  201: {
    bigRegion: '전라남도',
    smallRegion: '강진군',
  },
  202: {
    bigRegion: '전라남도',
    smallRegion: '해남군',
  },
  203: {
    bigRegion: '전라남도',
    smallRegion: '영암군',
  },
  204: {
    bigRegion: '전라남도',
    smallRegion: '무안군',
  },
  205: {
    bigRegion: '전라남도',
    smallRegion: '함평군',
  },
  206: {
    bigRegion: '전라남도',
    smallRegion: '영광군',
  },
  207: {
    bigRegion: '전라남도',
    smallRegion: '장성군',
  },
  208: {
    bigRegion: '전라남도',
    smallRegion: '완도군',
  },
  209: {
    bigRegion: '전라남도',
    smallRegion: '진도군',
  },
  210: {
    bigRegion: '전라남도',
    smallRegion: '신안군',
  },
  234: {
    bigRegion: '경상북도',
    smallRegion: '포항시',
  },
  235: {
    bigRegion: '경상북도',
    smallRegion: '경주시',
  },
  236: {
    bigRegion: '경상북도',
    smallRegion: '김천시',
  },
  237: {
    bigRegion: '경상북도',
    smallRegion: '안동시',
  },
  238: {
    bigRegion: '경상북도',
    smallRegion: '구미시',
  },
  239: {
    bigRegion: '경상북도',
    smallRegion: '영주시',
  },
  240: {
    bigRegion: '경상북도',
    smallRegion: '영천시',
  },
  241: {
    bigRegion: '경상북도',
    smallRegion: '상주시',
  },
  242: {
    bigRegion: '경상북도',
    smallRegion: '문경시',
  },
  243: {
    bigRegion: '경상북도',
    smallRegion: '경산시',
  },
  244: {
    bigRegion: '경상북도',
    smallRegion: '군위군',
  },
  245: {
    bigRegion: '경상북도',
    smallRegion: '의성군',
  },
  246: {
    bigRegion: '경상북도',
    smallRegion: '청송군',
  },
  247: {
    bigRegion: '경상북도',
    smallRegion: '영양군',
  },
  248: {
    bigRegion: '경상북도',
    smallRegion: '영덕군',
  },
  249: {
    bigRegion: '경상북도',
    smallRegion: '청도군',
  },
  250: {
    bigRegion: '경상북도',
    smallRegion: '고령군',
  },
  251: {
    bigRegion: '경상북도',
    smallRegion: '성주군',
  },
  252: {
    bigRegion: '경상북도',
    smallRegion: '칠곡군',
  },
  253: {
    bigRegion: '경상북도',
    smallRegion: '예천군',
  },
  254: {
    bigRegion: '경상북도',
    smallRegion: '봉화군',
  },
  255: {
    bigRegion: '경상북도',
    smallRegion: '울진군',
  },
  256: {
    bigRegion: '경상북도',
    smallRegion: '울릉군',
  },
  257: {
    bigRegion: '경상남도',
    smallRegion: '창원시',
  },
  258: {
    bigRegion: '경상남도',
    smallRegion: '진주시',
  },
  259: {
    bigRegion: '경상남도',
    smallRegion: '통영시',
  },
  260: {
    bigRegion: '경상남도',
    smallRegion: '사천시',
  },
  261: {
    bigRegion: '경상남도',
    smallRegion: '김해시',
  },
  262: {
    bigRegion: '경상남도',
    smallRegion: '밀양시',
  },
  263: {
    bigRegion: '경상남도',
    smallRegion: '거제시',
  },
  264: {
    bigRegion: '경상남도',
    smallRegion: '양산시',
  },
  265: {
    bigRegion: '경상남도',
    smallRegion: '의령군',
  },
  266: {
    bigRegion: '경상남도',
    smallRegion: '함안군',
  },
  267: {
    bigRegion: '경상남도',
    smallRegion: '창녕군',
  },
  268: {
    bigRegion: '경상남도',
    smallRegion: '고성군',
  },
  269: {
    bigRegion: '경상남도',
    smallRegion: '남해군',
  },
  270: {
    bigRegion: '경상남도',
    smallRegion: '하동군',
  },
  271: {
    bigRegion: '경상남도',
    smallRegion: '산청군',
  },
  272: {
    bigRegion: '경상남도',
    smallRegion: '함양군',
  },
  273: {
    bigRegion: '경상남도',
    smallRegion: '거창군',
  },
  274: {
    bigRegion: '경상남도',
    smallRegion: '합천군',
  },
  275: {
    bigRegion: '제주특별자치도',
    smallRegion: '서귀포시',
  },
  276: {
    bigRegion: '제주특별자치도',
    smallRegion: '제주시',
  },
  277: {
    bigRegion: '세종특별자치시',
    smallRegion: '어진동',
  },
} as const;
