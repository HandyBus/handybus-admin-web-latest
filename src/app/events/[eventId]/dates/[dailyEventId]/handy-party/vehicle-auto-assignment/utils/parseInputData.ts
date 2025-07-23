import dayjs from 'dayjs';
import { HandyPartySheetData } from '../types/vehicleAutoAssignment.type';

// 사용되는 타다 시트 데이터 예시
// 강서권	고양종합운동장	오는편	2025-06-13 23:00	010-9303-0639	서울 구로구 신도림역 1번 출구	37.5094707	126.891882	4	4	37.9 	86.0 	23:00				14,000	경기32바9544	010-9303-0639

/**
 * 타다 시트 데이터 파싱 함수
 * @param text 타다 시트 데이터
 * @param dailyEventDate 행사일자
 * @param createCurrentTimeLog 현재 시간 로그 생성 함수
 * @returns 파싱된 데이터
 *
 * 1. 타다 시트 데이터 파싱
 * 2. 중복된 데이터의 갯수만큼 count 칼럼에 갯수를 추가하고, 중복된 데이터 행들은 제거
 * 3. 중복된 데이터 행들은 제거된 데이터를 반환
 */
interface Props {
  text: string;
  dailyEventDate: string;
  createCurrentTimeLog: (message: string) => void;
}
export const parseInputData = ({
  text,
  dailyEventDate,
  createCurrentTimeLog,
}: Props): HandyPartySheetData[] => {
  const parsedData = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const cols = line.split('\t');

      if (
        dayjs(cols[3]).format('YYYY-MM-DD') !==
        dayjs(dailyEventDate).format('YYYY-MM-DD')
      ) {
        createCurrentTimeLog(
          `입력하신 데이터의 ${cols[3]} 일자가 행사일자와 다릅니다. 행사일자 : ${dailyEventDate} 확인해주세요.`,
        );
      }

      return {
        region: cols[0] ?? '',
        tripType: cols[2] ?? '',
        targetTime: cols[3] ?? '',
        passengerPhoneNumber: convertPhoneNumberToInternational(cols[4] ?? ''),
        address: cols[5] ?? '',
        partyId: cols[8] ?? '',
        vehicleNumber: cols[17] ?? '',
        driverPhoneNumber: convertPhoneNumberToInternational(cols[18] ?? ''),
        count: 1,
      };
    });

  const groupedData = new Map<string, HandyPartySheetData>();
  parsedData.forEach((item) => {
    const key = `${item.region}|${item.tripType}|${item.targetTime}|${item.passengerPhoneNumber}|${item.address}|${item.partyId}|${item.vehicleNumber}|${item.driverPhoneNumber}`;

    if (groupedData.has(key)) {
      const existingItem = groupedData.get(key)!;
      existingItem.count! += 1;
    } else {
      groupedData.set(key, { ...item, count: 1 });
    }
  });
  console.log('👍🏻 groupedData', groupedData);
  return Array.from(groupedData.values());
};

/**
 * 010-0000-0000 형식의 전화번호를 +821000000000 형식으로 변환
 * @param phoneNumber - 변환할 전화번호 (예: "010-1234-5678")
 * @returns 변환된 전화번호 (예: "+821012345678")
 *
 * @example
 * convertPhoneNumberToInternational("010-1234-5678") // "+821012345678"
 * convertPhoneNumberToInternational("01012345678") // "+821012345678"
 * convertPhoneNumberToInternational("+82-10-1234-5678") // "+821012345678"
 */
export const convertPhoneNumberToInternational = (
  phoneNumber: string,
): string => {
  if (!phoneNumber) return '';

  // 하이픈 제거하고 숫자만 추출
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  // 010으로 시작하는 11자리 번호인지 확인
  if (cleanNumber.length === 11 && cleanNumber.startsWith('010')) {
    // 010 제거하고 나머지 번호 추출
    const remainingNumber = cleanNumber.substring(3);
    return `+8210${remainingNumber.substring(0, 4)}${remainingNumber.substring(4)}`;
  }

  // 다른 형식의 번호는 그대로 반환
  return phoneNumber;
};
