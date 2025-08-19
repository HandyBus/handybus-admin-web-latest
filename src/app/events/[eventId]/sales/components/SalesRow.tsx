'use client';

import { useState } from 'react';
import { RouteWithSales } from '../hooks/useGetSales';

interface Props {
  routeWithSales: RouteWithSales;
  isTotalRow?: boolean;
  onVehicleCostChange?: (shuttleRouteId: string, cost: number) => void;
  onVehicleCountChange?: (shuttleRouteId: string, count: number) => void;
  onOperationCostChange?: (cost: number) => void;
  onMarketingCostChange?: (cost: number) => void;
  vehicleCost?: number;
  vehicleCount?: number;
  totalVehicleCost?: number;
  totalVehicleCount?: number;
  operationCost?: number;
  marketingCost?: number;
}

const SalesRow = ({
  routeWithSales,
  isTotalRow = false,
  onVehicleCostChange,
  onVehicleCountChange,
  onOperationCostChange,
  onMarketingCostChange,
  vehicleCost: initialVehicleCost = 0,
  vehicleCount: initialVehicleCount = 0,
  totalVehicleCost = 0,
  totalVehicleCount = 0,
  operationCost: initialOperationCost = 0,
  marketingCost: initialMarketingCost = 0,
}: Props) => {
  const shuttleRouteName = routeWithSales.name;
  const totalSales = routeWithSales.totalSales;
  const totalSalesWithDiscount = routeWithSales.totalSalesWithDiscount;
  const couponCost = totalSales - totalSalesWithDiscount;

  // 각 노선들에 대해 입력
  const [vehicleCost, setVehicleCost] = useState<string>(
    initialVehicleCost.toLocaleString(),
  );
  const [vehicleCount, setVehicleCount] = useState<string>(
    initialVehicleCount.toLocaleString(),
  );
  // 합계로만 입력
  const [totalRowOperatingCost, setTotalRowOperatingCost] = useState<string>(
    initialOperationCost.toLocaleString(),
  );
  const [totalRowMarketingCost, setTotalRowMarketingCost] = useState<string>(
    initialMarketingCost.toLocaleString(),
  );

  // 문자열을 숫자로 변환
  const getNumericValue = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  // 차량 대금 계산 (totalRow인 경우 합계 사용, 아닌 경우 입력값 사용)
  // 일반 row는 차량 대금 * 차량 수
  // total row는 각각 차량 대금과 차량 수를 계산한 합계
  const currentVehicleCost = isTotalRow
    ? totalVehicleCost
    : getNumericValue(vehicleCost) * getNumericValue(vehicleCount);

  const totalProfit = isTotalRow
    ? totalSales -
      couponCost -
      totalVehicleCost -
      getNumericValue(totalRowOperatingCost) -
      getNumericValue(totalRowMarketingCost)
    : totalSales - couponCost - currentVehicleCost;
  const profitRate =
    totalSales === 0
      ? 0
      : Math.round((totalProfit / totalSales) * 100 * 100) / 100;

  const totalReservationCount = routeWithSales.totalReservationCount;
  const canceledReservationCount = routeWithSales.canceledReservationCount;
  const canceledReservationRate =
    totalReservationCount + canceledReservationCount === 0
      ? 0
      : Math.round(
          (canceledReservationCount /
            (totalReservationCount + canceledReservationCount)) *
            100 *
            100,
        ) / 100;

  const handleNumberInput = (
    value: string,
    setter: (value: string) => void,
    allowDecimal: boolean = false,
  ) => {
    let numericValue: string;

    if (allowDecimal) {
      numericValue = value.replace(/[^0-9,.]/g, '');

      const dotCount = (numericValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        const parts = numericValue.split('.');
        numericValue = parts[0] + '.' + parts.slice(1).join('');
      }

      if (dotCount === 1) {
        const parts = numericValue.split('.');
        const integerPart = parts[0].replace(/^0+/, '') || '0';
        numericValue = integerPart + '.' + parts[1];
      }
    } else {
      numericValue = value.replace(/[^0-9,]/g, '');
    }

    if (numericValue === '') {
      setter('0');
      return;
    }

    const numberOnly = numericValue.replace(/,/g, '');

    if (numberOnly === '') {
      setter('0');
      return;
    }

    if (allowDecimal) {
      if (numberOnly.includes('.')) {
        const parts = numberOnly.split('.');
        const integerPart = parts[0].replace(/^0+/, '') || '0';
        const decimalPart = parts[1];
        setter(integerPart + '.' + decimalPart);
      } else {
        setter(numberOnly.replace(/^0+/, '') || '0');
      }
    } else {
      const formattedValue = parseInt(numberOnly, 10).toLocaleString();
      setter(formattedValue);
    }
  };

  // 차량 대금 입력 처리
  const handleVehicleCostInput = (value: string) => {
    handleNumberInput(value, setVehicleCost);

    if (onVehicleCostChange) {
      const numericValue = getNumericValue(value);
      onVehicleCostChange(routeWithSales.shuttleRouteId, numericValue);
    }
  };

  // 차량 수 입력 처리
  const handleVehicleCountInput = (value: string) => {
    handleNumberInput(value, setVehicleCount, true);

    if (onVehicleCountChange) {
      const numericValue = getNumericValue(value);
      onVehicleCountChange(routeWithSales.shuttleRouteId, numericValue);
    }
  };

  // 운영비 입력 처리
  const handleOperationCostInput = (value: string) => {
    handleNumberInput(value, setTotalRowOperatingCost);

    if (onOperationCostChange) {
      const numericValue = getNumericValue(value);
      onOperationCostChange(numericValue);
    }
  };

  // 마케팅비 입력 처리
  const handleMarketingCostInput = (value: string) => {
    handleNumberInput(value, setTotalRowMarketingCost);

    if (onMarketingCostChange) {
      const numericValue = getNumericValue(value);
      onMarketingCostChange(numericValue);
    }
  };

  return (
    <div className="grid h-36 w-full grid-cols-[repeat(14,1fr)] items-center border-b border-basic-grey-200">
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 노선명 */}
        {shuttleRouteName}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 총 매출 */}
        {totalSales.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 실 매출 */}
        {totalSalesWithDiscount.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 차량 대금 */}
        {isTotalRow ? (
          <span className="text-14 font-500">
            {totalVehicleCost.toLocaleString()}
          </span>
        ) : (
          <input
            type="text"
            value={vehicleCost}
            onChange={(e) => handleVehicleCostInput(e.target.value)}
            className="m-4 w-full border border-basic-grey-200 bg-transparent text-center text-14 font-500 outline-none"
          />
        )}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 쿠폰비 */}
        {couponCost.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-16 font-500 text-basic-black">
        {/* 운영비 */}
        {isTotalRow && (
          <input
            type="text"
            value={totalRowOperatingCost}
            onChange={(e) => handleOperationCostInput(e.target.value)}
            className="m-4 w-full border border-basic-grey-200 bg-transparent text-center text-14 font-500 outline-none"
          />
        )}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-16 font-500 text-basic-black">
        {/* 마케팅비 */}
        {isTotalRow && (
          <input
            type="text"
            value={totalRowMarketingCost}
            onChange={(e) => handleMarketingCostInput(e.target.value)}
            className="m-4 w-full border border-basic-grey-200 bg-transparent text-center text-14 font-500 outline-none"
          />
        )}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 총 이익 */}
        {totalProfit.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 이익률 */}
        {profitRate.toLocaleString()}%
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 탑승자 수*/}
        {routeWithSales.totalPassengerCount.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 차량 수 */}
        {isTotalRow ? (
          <span className="text-14 font-500">
            {totalVehicleCount.toLocaleString()}
          </span>
        ) : (
          <input
            type="text"
            value={vehicleCount}
            onChange={(e) => handleVehicleCountInput(e.target.value)}
            className="m-4 w-full border border-basic-grey-200 bg-transparent text-center text-14 font-500 outline-none"
          />
        )}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 총 예약 수 */}
        {totalReservationCount.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 취소된 예약 수 */}
        {canceledReservationCount.toLocaleString()}
      </div>
      <div className="flex h-full w-full items-center justify-center overflow-x-auto whitespace-nowrap break-keep border-r border-basic-grey-200 text-center text-14 font-500">
        {/* 취소율 */}
        {canceledReservationRate.toLocaleString()}%
      </div>
    </div>
  );
};

export default SalesRow;
