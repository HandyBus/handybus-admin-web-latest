import { EventsViewEntity } from '@/types/event.type';
import { RouteWithSales } from '../hooks/useGetSales';
import { formatDateString } from '@/utils/date.util';
import ExcelJS from 'exceljs';

interface ExcelExportData {
  dailyEventId: string;
  dailyEventDate: string;
  routeName: string;
  totalSales: number;
  totalSalesWithDiscount: number;
  vehicleCost: number;
  couponCost: number;
  operationCost: number | '';
  marketingCost: number | '';
  totalProfit: number;
  profitRate: number;
  passengerCount: number;
  vehicleCount: number;
  reservationCount: number;
  canceledReservationCount: number;
  cancellationRate: number;
}

interface EmptyRow {
  isEmpty: true;
}

type ExcelRow = ExcelExportData | EmptyRow;

export const convertSalesDataToExcelFormat = (
  dailyEventsWithRoutesWithSales: Array<{
    dailyEventId: string;
    dailyEventDate: string;
    routesWithSales: RouteWithSales[];
  }>,
  vehicleCosts: Record<string, number>,
  vehicleCounts: Record<string, number>,
  operationCost: number,
  marketingCost: number,
): ExcelRow[] => {
  const excelData: ExcelRow[] = [];

  dailyEventsWithRoutesWithSales.forEach((dailyEvent, index) => {
    const date = formatDateString(dailyEvent.dailyEventDate);

    dailyEvent.routesWithSales.forEach((route) => {
      const vehicleCost = vehicleCosts[route.shuttleRouteId] || 0;
      const vehicleCount = vehicleCounts[route.shuttleRouteId] || 0;

      // 쿠폰비 계산 (총 매출 - 실 매출)
      const couponCost = route.totalSales - route.totalSalesWithDiscount;

      // 총 이익 계산
      const totalProfit =
        route.totalSalesWithDiscount - vehicleCost * vehicleCount;

      // 이익률 계산 (소수점 형태로 저장, Excel에서 퍼센트 형식 적용)
      const profitRate =
        route.totalSales > 0 ? totalProfit / route.totalSales : 0;

      // 취소율 계산 (소수점 형태로 저장, Excel에서 퍼센트 형식 적용)
      const cancellationRate =
        route.totalReservationCount > 0
          ? route.canceledReservationCount /
            (route.totalReservationCount + route.canceledReservationCount)
          : 0;

      excelData.push({
        dailyEventId: dailyEvent.dailyEventId,
        dailyEventDate: date,
        routeName: route.name,
        totalSales: route.totalSales,
        totalSalesWithDiscount: route.totalSalesWithDiscount,
        vehicleCost,
        couponCost,
        operationCost: '', // 개별 노선은 빈 셀
        marketingCost: '', // 개별 노선은 빈 셀
        totalProfit,
        profitRate,
        passengerCount: route.totalPassengerCount,
        vehicleCount,
        reservationCount: route.totalReservationCount,
        canceledReservationCount: route.canceledReservationCount,
        cancellationRate,
      });
    });

    // 합계 행 추가
    const totalVehicleCost = dailyEvent.routesWithSales.reduce(
      (sum, route) =>
        sum +
        (vehicleCosts[route.shuttleRouteId] || 0) *
          (vehicleCounts[route.shuttleRouteId] || 0),
      0,
    );
    const totalVehicleCount = dailyEvent.routesWithSales.reduce(
      (sum, route) => sum + (vehicleCounts[route.shuttleRouteId] || 0),
      0,
    );

    const totalSales = dailyEvent.routesWithSales.reduce(
      (sum, route) => sum + route.totalSales,
      0,
    );
    const totalSalesWithDiscount = dailyEvent.routesWithSales.reduce(
      (sum, route) => sum + route.totalSalesWithDiscount,
      0,
    );
    const totalPassengerCount = dailyEvent.routesWithSales.reduce(
      (sum, route) => sum + route.totalPassengerCount,
      0,
    );
    const totalReservationCount = dailyEvent.routesWithSales.reduce(
      (sum, route) => sum + route.totalReservationCount,
      0,
    );
    const totalCanceledReservationCount = dailyEvent.routesWithSales.reduce(
      (sum, route) => sum + route.canceledReservationCount,
      0,
    );

    const totalCouponCost = totalSales - totalSalesWithDiscount;
    const totalOperationCost = operationCost;
    const totalMarketingCost = marketingCost;
    const totalProfit =
      totalSalesWithDiscount -
      totalVehicleCost -
      totalOperationCost -
      totalMarketingCost;
    const totalProfitRate = totalSales > 0 ? totalProfit / totalSales : 0;
    const totalCancellationRate =
      totalReservationCount > 0
        ? totalCanceledReservationCount /
          (totalReservationCount + totalCanceledReservationCount)
        : 0;

    excelData.push({
      dailyEventId: dailyEvent.dailyEventId,
      dailyEventDate: date,
      routeName: '합계',
      totalSales,
      totalSalesWithDiscount,
      vehicleCost: totalVehicleCost,
      couponCost: totalCouponCost,
      operationCost: totalOperationCost,
      marketingCost: totalMarketingCost,
      totalProfit,
      profitRate: totalProfitRate,
      passengerCount: totalPassengerCount,
      vehicleCount: totalVehicleCount,
      reservationCount: totalReservationCount,
      canceledReservationCount: totalCanceledReservationCount,
      cancellationRate: totalCancellationRate,
    });

    // 합계 행 이후에 빈 행 추가 (마지막 일자가 아닌 경우에만)
    const isLastDailyEvent =
      index === dailyEventsWithRoutesWithSales.length - 1;
    if (!isLastDailyEvent) {
      excelData.push({ isEmpty: true });
    }
  });

  return excelData;
};

export const downloadSalesExcel = async (
  event: EventsViewEntity,
  dailyEventsWithRoutesWithSales: Array<{
    dailyEventId: string;
    dailyEventDate: string;
    routesWithSales: RouteWithSales[];
  }>,
  vehicleCosts: Record<string, number>,
  vehicleCounts: Record<string, number>,
  operationCost: number,
  marketingCost: number,
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();

  // 전체 요약 시트 생성
  const summaryWorksheet = workbook.addWorksheet('전체 요약');
  createSummarySheet(
    summaryWorksheet,
    dailyEventsWithRoutesWithSales,
    vehicleCosts,
    vehicleCounts,
    operationCost,
    marketingCost,
  );

  // 각 일자별 시트 생성
  dailyEventsWithRoutesWithSales.forEach((dailyEvent) => {
    const date = formatDateString(dailyEvent.dailyEventDate);
    const worksheetName = date.replace(/\//g, '-'); // 시트명에 사용할 수 없는 문자 제거
    const worksheet = workbook.addWorksheet(worksheetName);
    createDailyEventSheet(
      worksheet,
      dailyEvent,
      vehicleCosts,
      vehicleCounts,
      operationCost,
      marketingCost,
    );
  });

  // Excel 파일 다운로드
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${event.eventName}_매출현황.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 전체 요약 시트 생성 함수
const createSummarySheet = (
  worksheet: ExcelJS.Worksheet,
  dailyEventsWithRoutesWithSales: Array<{
    dailyEventId: string;
    dailyEventDate: string;
    routesWithSales: RouteWithSales[];
  }>,
  vehicleCosts: Record<string, number>,
  vehicleCounts: Record<string, number>,
  operationCost: number,
  marketingCost: number,
) => {
  const excelData = convertSalesDataToExcelFormat(
    dailyEventsWithRoutesWithSales,
    vehicleCosts,
    vehicleCounts,
    operationCost,
    marketingCost,
  );

  // 헤더 설정
  const headers = [
    '일자',
    '노선명',
    '총 매출',
    '실 매출',
    '차량 대금',
    '쿠폰비',
    '운영비',
    '마케팅비',
    '총 이익',
    '이익률',
    '탑승자 수',
    '차량 수',
    '총 예약 수',
    '취소된 예약 수',
    '취소율',
  ];

  // 헤더 행 추가
  const headerRow = worksheet.addRow(headers);
  headers.forEach((_, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF6B7280' } },
      left: { style: 'thin', color: { argb: 'FF6B7280' } },
      bottom: { style: 'thin', color: { argb: 'FF6B7280' } },
      right: { style: 'thin', color: { argb: 'FF6B7280' } },
    };
  });

  // 데이터 행 추가
  excelData.forEach((row) => {
    if ('isEmpty' in row) {
      worksheet.addRow([]);
      return;
    }

    const dataRow = worksheet.addRow([
      row.dailyEventDate,
      row.routeName,
      row.totalSales,
      row.totalSalesWithDiscount,
      row.vehicleCost,
      row.couponCost,
      row.operationCost,
      row.marketingCost,
      row.totalProfit,
      row.profitRate,
      row.passengerCount,
      row.vehicleCount,
      row.reservationCount,
      row.canceledReservationCount,
      row.cancellationRate,
    ]);

    if (row.routeName === '합계') {
      dataRow.font = { bold: true };
      dataRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8F9FA' },
      };
    }

    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    });
  });

  worksheet.columns = [
    { width: 12 }, // 일자
    { width: 20 }, // 노선명
    { width: 12 }, // 총 매출
    { width: 12 }, // 실 매출
    { width: 12 }, // 차량 대금
    { width: 12 }, // 쿠폰비
    { width: 12 }, // 운영비
    { width: 12 }, // 마케팅비
    { width: 12 }, // 총 이익
    { width: 10 }, // 이익률
    { width: 10 }, // 탑승자 수
    { width: 10 }, // 차량 수
    { width: 10 }, // 총 예약 수
    { width: 12 }, // 취소된 예약 수
    { width: 10 }, // 취소율
  ];

  worksheet.getColumn(3).numFmt = '#,##0'; // 총 매출
  worksheet.getColumn(4).numFmt = '#,##0'; // 실 매출
  worksheet.getColumn(5).numFmt = '#,##0'; // 차량 대금
  worksheet.getColumn(6).numFmt = '#,##0'; // 쿠폰비
  worksheet.getColumn(7).numFmt = '#,##0'; // 운영비
  worksheet.getColumn(8).numFmt = '#,##0'; // 마케팅비
  worksheet.getColumn(9).numFmt = '#,##0'; // 총 이익
  worksheet.getColumn(10).numFmt = '0.00%'; // 이익률
  worksheet.getColumn(11).numFmt = '#,##0'; // 탑승자 수
  worksheet.getColumn(12).numFmt = '#,##0'; // 차량 수
  worksheet.getColumn(13).numFmt = '#,##0'; // 총 예약 수
  worksheet.getColumn(14).numFmt = '#,##0'; // 취소된 예약 수
  worksheet.getColumn(15).numFmt = '0.00%'; // 취소율
};

// 개별 일자 시트 생성 함수
const createDailyEventSheet = (
  worksheet: ExcelJS.Worksheet,
  dailyEvent: {
    dailyEventId: string;
    dailyEventDate: string;
    routesWithSales: RouteWithSales[];
  },
  vehicleCosts: Record<string, number>,
  vehicleCounts: Record<string, number>,
  operationCost: number,
  marketingCost: number,
) => {
  const date = formatDateString(dailyEvent.dailyEventDate);
  const routesWithSales = dailyEvent.routesWithSales;

  const titleRow = worksheet.addRow([`${date} 매출현황`]);

  const titleCell = titleRow.getCell(1);
  titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
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
  worksheet.mergeCells('A1:N1');

  const headers = [
    '노선명',
    '총 매출',
    '실 매출',
    '차량 대금',
    '쿠폰비',
    '운영비',
    '마케팅비',
    '총 이익',
    '이익률',
    '탑승자 수',
    '차량 수',
    '총 예약 수',
    '취소된 예약 수',
    '취소율',
  ];

  const headerRow = worksheet.addRow(headers);

  headers.forEach((_, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
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

  routesWithSales.forEach((route) => {
    const vehicleCost = vehicleCosts[route.shuttleRouteId] || 0;
    const vehicleCount = vehicleCounts[route.shuttleRouteId] || 0;
    const couponCost = route.totalSales - route.totalSalesWithDiscount;
    const totalProfit =
      route.totalSalesWithDiscount - vehicleCost * vehicleCount;
    const profitRate =
      route.totalSales > 0 ? totalProfit / route.totalSales : 0;
    const cancellationRate =
      route.totalReservationCount > 0
        ? route.canceledReservationCount /
          (route.totalReservationCount + route.canceledReservationCount)
        : 0;

    const dataRow = worksheet.addRow([
      route.name,
      route.totalSales,
      route.totalSalesWithDiscount,
      vehicleCost,
      couponCost,
      '', // 개별 노선은 빈 셀
      '', // 개별 노선은 빈 셀
      totalProfit,
      profitRate,
      route.totalPassengerCount,
      vehicleCount,
      route.totalReservationCount,
      route.canceledReservationCount,
      cancellationRate,
    ]);

    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };
    });
  });

  const totalVehicleCost = routesWithSales.reduce(
    (sum, route) =>
      sum +
      (vehicleCosts[route.shuttleRouteId] || 0) *
        (vehicleCounts[route.shuttleRouteId] || 0),
    0,
  );
  const totalVehicleCount = routesWithSales.reduce(
    (sum, route) => sum + (vehicleCounts[route.shuttleRouteId] || 0),
    0,
  );
  const totalSales = routesWithSales.reduce(
    (sum, route) => sum + route.totalSales,
    0,
  );
  const totalSalesWithDiscount = routesWithSales.reduce(
    (sum, route) => sum + route.totalSalesWithDiscount,
    0,
  );
  const totalPassengerCount = routesWithSales.reduce(
    (sum, route) => sum + route.totalPassengerCount,
    0,
  );
  const totalReservationCount = routesWithSales.reduce(
    (sum, route) => sum + route.totalReservationCount,
    0,
  );
  const totalCanceledReservationCount = routesWithSales.reduce(
    (sum, route) => sum + route.canceledReservationCount,
    0,
  );
  const totalCouponCost = totalSales - totalSalesWithDiscount;
  const totalProfit =
    totalSalesWithDiscount - totalVehicleCost - operationCost - marketingCost;
  const totalProfitRate = totalSales > 0 ? totalProfit / totalSales : 0;
  const totalCancellationRate =
    totalReservationCount > 0
      ? totalCanceledReservationCount /
        (totalReservationCount + totalCanceledReservationCount)
      : 0;

  const totalRow = worksheet.addRow([
    '합계',
    totalSales,
    totalSalesWithDiscount,
    totalVehicleCost,
    totalCouponCost,
    operationCost,
    marketingCost,
    totalProfit,
    totalProfitRate,
    totalPassengerCount,
    totalVehicleCount,
    totalReservationCount,
    totalCanceledReservationCount,
    totalCancellationRate,
  ]);

  totalRow.font = { bold: true };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8F9FA' },
  };
  totalRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    };
  });

  worksheet.columns = [
    { width: 20 }, // 노선명
    { width: 12 }, // 총 매출
    { width: 12 }, // 실 매출
    { width: 12 }, // 차량 대금
    { width: 12 }, // 쿠폰비
    { width: 12 }, // 운영비
    { width: 12 }, // 마케팅비
    { width: 12 }, // 총 이익
    { width: 10 }, // 이익률
    { width: 10 }, // 탑승자 수
    { width: 10 }, // 차량 수
    { width: 10 }, // 총 예약 수
    { width: 12 }, // 취소된 예약 수
    { width: 10 }, // 취소율
  ];

  worksheet.getColumn(2).numFmt = '#,##0'; // 총 매출
  worksheet.getColumn(3).numFmt = '#,##0'; // 실 매출
  worksheet.getColumn(4).numFmt = '#,##0'; // 차량 대금
  worksheet.getColumn(5).numFmt = '#,##0'; // 쿠폰비
  worksheet.getColumn(6).numFmt = '#,##0'; // 운영비
  worksheet.getColumn(7).numFmt = '#,##0'; // 마케팅비
  worksheet.getColumn(8).numFmt = '#,##0'; // 총 이익
  worksheet.getColumn(9).numFmt = '0.00%'; // 이익률
  worksheet.getColumn(10).numFmt = '#,##0'; // 탑승자 수
  worksheet.getColumn(11).numFmt = '#,##0'; // 차량 수
  worksheet.getColumn(12).numFmt = '#,##0'; // 총 예약 수
  worksheet.getColumn(13).numFmt = '#,##0'; // 취소된 예약 수
  worksheet.getColumn(14).numFmt = '0.00%'; // 취소율
};
