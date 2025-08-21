import { EventsViewEntity } from '@/types/event.type';
import { RouteWithSales } from '../hooks/useGetSales';
import { formatDateString } from '@/utils/date.util';
import dayjs from 'dayjs';

interface ExcelExportData {
  dailyEventId: string;
  date: string;
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
    date: string;
    routesWithSales: RouteWithSales[];
  }>,
  vehicleCosts: Record<string, number>,
  vehicleCounts: Record<string, number>,
  operationCost: number,
  marketingCost: number,
): ExcelRow[] => {
  const excelData: ExcelRow[] = [];

  dailyEventsWithRoutesWithSales.forEach((dailyEvent, index) => {
    const date = formatDateString(dailyEvent.date);

    dailyEvent.routesWithSales.forEach((route) => {
      const vehicleCost = vehicleCosts[route.shuttleRouteId] || 0;
      const vehicleCount = vehicleCounts[route.shuttleRouteId] || 0;

      // 쿠폰비 계산 (총 매출 - 실 매출)
      const couponCost = route.totalSales - route.totalSalesWithDiscount;

      // 총 이익 계산
      const totalProfit = route.totalSalesWithDiscount - vehicleCost;

      // 이익률 계산
      const profitRate =
        route.totalSales > 0
          ? Math.round((totalProfit / route.totalSales) * 100 * 100) / 100
          : 0;

      // 취소율 계산
      const cancellationRate =
        route.totalReservationCount > 0
          ? Math.round(
              (route.canceledReservationCount /
                (route.totalReservationCount +
                  route.canceledReservationCount)) *
                100 *
                100,
            ) / 100
          : 0;

      excelData.push({
        dailyEventId: dailyEvent.dailyEventId,
        date,
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
      (sum, route) => sum + (vehicleCosts[route.shuttleRouteId] || 0),
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
    const totalProfitRate =
      totalSales > 0
        ? Math.round((totalProfit / totalSales) * 100 * 100) / 100
        : 0;
    const totalCancellationRate =
      totalReservationCount > 0
        ? Math.round(
            (totalCanceledReservationCount /
              (totalReservationCount + totalCanceledReservationCount)) *
              100 *
              100,
          ) / 100
        : 0;

    excelData.push({
      dailyEventId: dailyEvent.dailyEventId,
      date,
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

export const downloadSalesExcel = (
  event: EventsViewEntity,
  dailyEventsWithRoutesWithSales: Array<{
    dailyEventId: string;
    date: string;
    routesWithSales: RouteWithSales[];
  }>,
  vehicleCosts: Record<string, number>,
  vehicleCounts: Record<string, number>,
  operationCost: number,
  marketingCost: number,
): void => {
  const excelData = convertSalesDataToExcelFormat(
    dailyEventsWithRoutesWithSales,
    vehicleCosts,
    vehicleCounts,
    operationCost,
    marketingCost,
  );

  // CSV 형식으로 데이터 변환
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

  const csvContent = [
    headers.join(','),
    ...excelData.map((row) => {
      // 빈 행인 경우 빈 문자열 반환
      if ('isEmpty' in row) {
        return '';
      }

      return [
        row.date,
        `"${row.routeName}"`,
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
      ].join(',');
    }),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${event.eventName}_매출현황_${dayjs().format('YYYYMMDD')}.csv`,
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
