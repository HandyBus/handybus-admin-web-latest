import { useCallback } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import Stringifier from '@/utils/stringifier.util';
import { HANDY_PARTY_OPTIMIZER_MESSAGES } from '../constants/handyPartyOptimizer.constant';
import { HandyPartyReservationExcelData } from '../types/handyPartyOptimizer.type';
import {
  convertToKoreanMobileNumber,
  formatPhoneNumber,
} from '@/utils/phoneNumber.util';

interface EventInformation {
  eventName: string;
  eventLocationName: string;
  dailyEventDate: string;
}

interface Props {
  eventInformation: EventInformation | null;
}

const useExcelDownload = ({ eventInformation }: Props) => {
  const handleExcelDownload = useCallback(
    (stagedHandyPartyReservations: HandyPartyReservationExcelData[]) => {
      try {
        // 엑셀에 출력할 데이터 준비 (partyId 오름차순, 같은 partyId 내에서는 order 순으로 정렬)
        const excelData = stagedHandyPartyReservations
          .toSorted((a, b) => {
            // partyId로 먼저 정렬 (오름차순), 같은 partyId인 경우 order로 정렬 (오름차순)
            if (a.partyId !== b.partyId) {
              return a.partyId - b.partyId;
            }
            return a.order - b.order;
          })
          .map((item) => ({
            노선명: item.shuttleName,
            이름: item.name,
            방향: Stringifier.tripType(item.tripType),
            핸드폰번호: formatPhoneNumber(
              convertToKoreanMobileNumber(item.phoneNumber),
            ),
            주소: item.address,
            파티넘버: item.partyId,
            순서: item.order,
          }));

        // 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // 엑셀파일 생성
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'HandyParty Data');

        const now = dayjs().tz('Asia/Seoul');
        const fileName = `${eventInformation?.eventName}_행사날짜_${eventInformation?.dailyEventDate}_작성일_${now.format('YYYY-MM-DD-HH-mm')}.xlsx`;

        // 파일 다운로드
        XLSX.writeFile(workbook, fileName);

        toast.success(HANDY_PARTY_OPTIMIZER_MESSAGES.SUCCESS.EXCEL_DOWNLOADED);
      } catch (error) {
        console.error('엑셀 다운로드 중 오류 발생:', error);
        toast.error(HANDY_PARTY_OPTIMIZER_MESSAGES.ERROR.EXCEL_DOWNLOAD_ERROR);
      }
    },
    [eventInformation],
  );

  return { handleExcelDownload };
};

export default useExcelDownload;
