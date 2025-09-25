'use client';

import { getDemands } from '@/services/demand.service';
import regionsData from '@/data/regions.json';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';

interface Props {
  eventId: string;
  dailyEventId: string;
}

interface RegionData {
  regionId: string;
  provinceFullName: string;
  cityFullName: string;
}

const useExportDemandRequestersList = ({ eventId, dailyEventId }: Props) => {
  const getAllDemands = async () => {
    const res = await getDemands({
      eventId,
      dailyEventId,
    });
    return res.shuttleDemands;
  };

  const getRegionInfo = (regionId: string): string => {
    const region = regionsData.regions.find(
      (r: RegionData) => r.regionId === regionId,
    );
    if (!region) {
      return '알수없는지역';
    }
    return `${region.provinceFullName} ${region.cityFullName}`;
  };

  const convertToExcelFormat = async () => {
    const demands = await getAllDemands();
    const result = [];

    const eventName = demands[0].event.eventName;
    const dailyEventDate = demands[0].event.dailyEvents.find(
      (dailyEvent) => dailyEvent.dailyEventId === dailyEventId,
    )?.date;

    for (const demand of demands) {
      // 사용자 정보가 없거나 이름/닉네임이 모두 없으면 제외 (탈퇴한 유저)
      if (!demand.userName && !demand.userNickname) {
        continue;
      }

      // 사용자명: name이 있으면 name, 없으면 nickname 사용
      const userName = demand.userName || demand.userNickname || '';

      // 전화번호 포맷팅
      const phoneNumber = demand.userPhoneNumber
        ? `010-${demand.userPhoneNumber.slice(5, 9)}-${demand.userPhoneNumber.slice(9)}`
        : '';

      // 지역 정보
      const region = getRegionInfo(demand.regionId);

      // 정류장명 (행사장행/귀가행에 따라 다름)
      const getStopName = () => {
        if (demand.type === 'TO_DESTINATION' || demand.type === 'ROUND_TRIP') {
          return demand.toDestinationRegionHub?.name || '';
        }
        if (demand.type === 'FROM_DESTINATION') {
          return demand.fromDestinationRegionHub?.name || '';
        }
        return '';
      };

      const stopName = getStopName();

      result.push({
        userName,
        phoneNumber,
        region,
        stopName,
        type: demand.type,
        createdAt: demand.createdAt,
      });
    }

    // 지역명, 정류장명, 이름 순으로 정렬
    return {
      eventName,
      dailyEventDate,
      result: result.sort((a, b) => {
        return (
          a.region.localeCompare(b.region) ||
          a.stopName.localeCompare(b.stopName) ||
          a.userName.localeCompare(b.userName) ||
          a.createdAt.localeCompare(b.createdAt)
        );
      }),
    };
  };

  const exportDemandRequestersList = async () => {
    const {
      eventName,
      dailyEventDate,
      result: excelData,
    } = await convertToExcelFormat();

    const formattedDailyEventDate = dayjs(dailyEventDate).format('YYYY-MM-DD');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('수요조사 신청자 명단');

    // 안내 문구 (첫 번째 행)
    const noticeCell = worksheet.getCell('A1');
    noticeCell.value = '수요조사 신청자 명단입니다.';
    noticeCell.font = {
      color: { argb: 'FF1E40A3' },
      bold: true,
      size: 11,
    };
    noticeCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' },
    };
    noticeCell.alignment = { horizontal: 'center', vertical: 'middle' };
    noticeCell.border = {
      top: { style: 'medium', color: { argb: 'FF1E40A3' } },
      left: { style: 'medium', color: { argb: 'FF1E40A3' } },
      bottom: { style: 'medium', color: { argb: 'FF1E40A3' } },
      right: { style: 'medium', color: { argb: 'FF1E40A3' } },
    };
    worksheet.mergeCells('A1:E1');

    // 제목 (둘째 행)
    const today = dayjs().tz('Asia/Seoul').format('MM/DD hh:mm');
    const titleCell = worksheet.getCell('A2');
    titleCell.value = `[${eventName}] [${formattedDailyEventDate}] 수요조사 신청자 명단 (${today} 기준)`;
    titleCell.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true,
      size: 13,
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' },
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'thick', color: { argb: 'FF1E40A3' } },
      left: { style: 'thick', color: { argb: 'FF1E40A3' } },
      bottom: { style: 'thick', color: { argb: 'FF1E40A3' } },
      right: { style: 'thick', color: { argb: 'FF1E40A3' } },
    };
    worksheet.mergeCells('A2:E2');

    // 헤더 (셋째 행)
    const headers = ['이름', '전화번호', '지역', '정류장명', '방향'];
    headers.forEach((header, headerIndex) => {
      const cell = worksheet.getCell(3, headerIndex + 1);
      cell.value = header;
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF374151' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF6B7280' } },
        left: { style: 'thin', color: { argb: 'FF6B7280' } },
        bottom: { style: 'thin', color: { argb: 'FF6B7280' } },
        right: { style: 'thin', color: { argb: 'FF6B7280' } },
      };
    });

    // 데이터 행
    excelData.forEach((demand, index) => {
      const rowIndex = index + 4;

      // 이름
      const nameCell = worksheet.getCell(rowIndex, 1);
      nameCell.value = demand.userName;
      nameCell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };

      // 전화번호
      const phoneCell = worksheet.getCell(rowIndex, 2);
      phoneCell.value = demand.phoneNumber;
      phoneCell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };

      // 지역
      const regionCell = worksheet.getCell(rowIndex, 3);
      regionCell.value = demand.region;
      regionCell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };

      // 정류장명
      const stopCell = worksheet.getCell(rowIndex, 4);
      stopCell.value = demand.stopName;
      stopCell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };

      // 방향
      const typeCell = worksheet.getCell(rowIndex, 5);
      const typeLabel =
        demand.type === 'TO_DESTINATION'
          ? '행사장행'
          : demand.type === 'FROM_DESTINATION'
            ? '귀가행'
            : '왕복';
      typeCell.value = typeLabel;
      typeCell.alignment = { horizontal: 'center' };
      typeCell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    });

    // 총 인원 표시
    const totalCell = worksheet.getCell(excelData.length + 4, 5);
    const totalCount = excelData.length;
    totalCell.value = `총 ${totalCount}명`;
    totalCell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    totalCell.font = {
      size: 11,
      bold: true,
    };
    totalCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF8F9FA' },
    };
    totalCell.border = {
      top: { style: 'thin', color: { argb: '12121212' } },
      left: { style: 'thin', color: { argb: '12121212' } },
      bottom: { style: 'thin', color: { argb: '12121212' } },
      right: { style: 'thin', color: { argb: '12121212' } },
    };

    // 컬럼 너비 설정
    worksheet.columns = [
      { width: 15 }, // 이름
      { width: 20 }, // 전화번호
      { width: 30 }, // 지역
      { width: 25 }, // 정류장명
      { width: 12 }, // 방향
    ];

    // 브라우저에서 Excel 파일 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `수요조사_신청자_명단_${eventName}_${formattedDailyEventDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return excelData;
  };

  return {
    exportDemandRequestersList,
  };
};

export default useExportDemandRequestersList;
