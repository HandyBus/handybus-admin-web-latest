'use client';

import { useCallback, useState, useEffect } from 'react';
import { EventsViewEntity } from '@/types/event.type';
import { AdminShuttleRoutesViewEntity } from '@/types/shuttleRoute.type';
import useGetSales, { RouteWithSales } from '../hooks/useGetSales';
import SalesRow from './SalesRow';
import Heading from '@/components/text/Heading';
import { formatDateString } from '@/utils/date.util';
import { downloadSalesExcel } from '../utils/excel.util';

interface Props {
  event: EventsViewEntity;
  shuttleRoutes: AdminShuttleRoutesViewEntity[];
}

const SalesTable = ({ event, shuttleRoutes }: Props) => {
  const dailyEventsWithRoutesWithSales = useGetSales(event, shuttleRoutes);

  const [vehicleCosts, setVehicleCosts] = useState<Record<string, number>>({});
  const [vehicleCounts, setVehicleCounts] = useState<Record<string, number>>(
    {},
  );
  const [operationCost, setOperationCost] = useState<number>(0);
  const [marketingCost, setMarketingCost] = useState<number>(0);

  const handleVehicleCostChange = (shuttleRouteId: string, cost: number) => {
    setVehicleCosts((prev) => ({
      ...prev,
      [shuttleRouteId]: cost,
    }));
  };

  const handleVehicleCountChange = (shuttleRouteId: string, count: number) => {
    setVehicleCounts((prev) => ({
      ...prev,
      [shuttleRouteId]: count,
    }));
  };

  const handleOperationCostChange = (cost: number) => {
    setOperationCost(cost);
  };

  const handleMarketingCostChange = (cost: number) => {
    setMarketingCost(cost);
  };

  const handleExcelDownload = useCallback(() => {
    if (!dailyEventsWithRoutesWithSales) {
      return;
    }
    downloadSalesExcel(
      event,
      dailyEventsWithRoutesWithSales,
      vehicleCosts,
      vehicleCounts,
      operationCost,
      marketingCost,
    );
  }, [
    dailyEventsWithRoutesWithSales,
    event,
    vehicleCosts,
    vehicleCounts,
    operationCost,
    marketingCost,
  ]);

  useEffect(() => {
    const downloadButton = document.getElementById('download-button');
    if (downloadButton) {
      downloadButton.addEventListener('click', handleExcelDownload);

      return () => {
        downloadButton.removeEventListener('click', handleExcelDownload);
      };
    }
  }, [handleExcelDownload]);

  return (
    <div className="flex flex-col gap-16">
      {dailyEventsWithRoutesWithSales &&
        dailyEventsWithRoutesWithSales.map((dailyEventWithRoutesWithSales) => {
          const date = formatDateString(dailyEventWithRoutesWithSales.date);
          const routesWithSales = dailyEventWithRoutesWithSales.routesWithSales;

          const totalVehicleCost = routesWithSales.reduce(
            (sum, routeWithSales) => {
              return (
                sum +
                (vehicleCosts[routeWithSales.shuttleRouteId] || 0) *
                  (vehicleCounts[routeWithSales.shuttleRouteId] || 0)
              );
            },
            0,
          );

          const totalVehicleCount = routesWithSales.reduce(
            (sum, routeWithSales) => {
              return sum + (vehicleCounts[routeWithSales.shuttleRouteId] || 0);
            },
            0,
          );

          const totalRowRouteWithSales: RouteWithSales = routesWithSales.reduce(
            (acc, routeWithSales) => {
              return {
                ...acc,
                totalSales: acc.totalSales + routeWithSales.totalSales,
                totalSalesWithDiscount:
                  acc.totalSalesWithDiscount +
                  routeWithSales.totalSalesWithDiscount,
                totalPassengerCount:
                  acc.totalPassengerCount + routeWithSales.totalPassengerCount,
                totalReservationCount:
                  acc.totalReservationCount +
                  routeWithSales.totalReservationCount,
                canceledReservationCount:
                  acc.canceledReservationCount +
                  routeWithSales.canceledReservationCount,
              };
            },
            {
              ...routesWithSales[0],
              shuttleRouteId: 'total',
              name: '합계',
              totalSales: 0,
              totalSalesWithDiscount: 0,
              totalPassengerCount: 0,
              totalReservationCount: 0,
              canceledReservationCount: 0,
            },
          );
          return (
            <div key={dailyEventWithRoutesWithSales.dailyEventId}>
              <Heading.h4>{date}</Heading.h4>
              <div className="overflow-hidden rounded-8 bg-basic-white shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]">
                <div className="grid h-[32px] grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center bg-basic-grey-200">
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    노선명
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    총 매출
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    실 매출
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    차량 대금
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    쿠폰비
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    운영비
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    마케팅비
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    총 이익
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    이익률
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    탑승자 수
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    차량 수
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    총 예약 수
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep border-r border-basic-white text-center text-16 font-500 text-basic-black">
                    취소된 예약 수
                  </h4>
                  <h4 className="flex h-full items-center justify-center whitespace-nowrap break-keep text-center text-16 font-500 text-basic-black">
                    취소율
                  </h4>
                </div>
                <div className="flex w-full flex-col">
                  {routesWithSales?.map((routeWithSales) => {
                    return (
                      <SalesRow
                        key={routeWithSales.shuttleRouteId}
                        routeWithSales={routeWithSales}
                        onVehicleCostChange={handleVehicleCostChange}
                        onVehicleCountChange={handleVehicleCountChange}
                        vehicleCost={
                          vehicleCosts[routeWithSales.shuttleRouteId] || 0
                        }
                        vehicleCount={
                          vehicleCounts[routeWithSales.shuttleRouteId] || 0
                        }
                      />
                    );
                  })}
                  <SalesRow
                    key="total"
                    routeWithSales={totalRowRouteWithSales}
                    isTotalRow
                    totalVehicleCost={totalVehicleCost}
                    totalVehicleCount={totalVehicleCount}
                    operationCost={operationCost}
                    marketingCost={marketingCost}
                    onOperationCostChange={handleOperationCostChange}
                    onMarketingCostChange={handleMarketingCostChange}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SalesTable;
