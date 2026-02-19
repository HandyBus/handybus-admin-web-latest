'use client';

import { useState, useMemo, useCallback } from 'react';
import Heading from '@/components/text/Heading';
import Dropdown from '@/components/input/Dropdown';
import DateInput from '@/components/input/DateInput';
import Button from '@/components/button/Button';
import { useGetEvents } from '@/services/event.service';
import {
  EventsViewEntity,
  EventDailyShuttlesInEventsViewEntity,
} from '@/types/event.type';
import { formatDateString } from '@/utils/date.util';
import dayjs from 'dayjs';
import BlueLink from '@/components/link/BlueLink';
import { Settings, X } from 'lucide-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { ANIMATION_DURATION } from '@/components/chart/chart.const';
import { numberTickFormatter } from '@/components/chart/chart.util';
import {
  formatDateToMMDD,
  STROKE_COLORS,
  REFERENCE_LINE_COLORS,
} from './utils/reservation-chart.util';
import { useSaleDateManagement } from './hooks/useSaleDateManagement';
import { useReservationChartData } from './hooks/useReservationChartData';

/** 차트 빈 상태 표시용 공통 컴포넌트 */
const CHART_PLACEHOLDER_STYLE =
  'flex h-[400px] items-center justify-center rounded-16 border border-basic-grey-200 bg-basic-white text-basic-grey-400';

const Page = () => {
  const { data: eventList, isLoading: isEventLoading } = useGetEvents();

  const [selectedEvent, setSelectedEvent] = useState<EventsViewEntity | null>(
    null,
  );
  const [selectedDailyEvent, setSelectedDailyEvent] =
    useState<EventDailyShuttlesInEventsViewEntity | null>(null);

  // 예매일 관리 훅
  const {
    preSaleDate,
    setPreSaleDate,
    generalSaleDate,
    setGeneralSaleDate,
    isEditing: isEditingSaleDate,
    isSaving: isSavingMetadata,
    toggleEditing: toggleSaleDateEditing,
    resetEditing: resetSaleDateEditing,
    handleSaveAndClose: handleSaveSaleDate,
  } = useSaleDateManagement({
    eventId: selectedEvent?.eventId ?? '',
  });

  // 차트 데이터 훅
  const { chartDataList, isLoading: isLoadingReservation } =
    useReservationChartData({
      eventId: selectedEvent?.eventId,
      dailyEventId: selectedDailyEvent?.dailyEventId,
    });

  // 이벤트 변경 시 일자별 이벤트 초기화
  const handleEventChange = useCallback(
    (event: EventsViewEntity | null) => {
      setSelectedEvent(event);
      setSelectedDailyEvent(null);
      resetSaleDateEditing();
    },
    [resetSaleDateEditing],
  );

  // 선택된 이벤트의 dailyEvent 목록 (날짜순 정렬)
  const sortedDailyEventList = useMemo(() => {
    if (!selectedEvent) return [];
    return [...selectedEvent.dailyEvents].sort((a, b) =>
      dayjs(a.dailyEventDate).diff(dayjs(b.dailyEventDate)),
    );
  }, [selectedEvent]);

  // ReferenceLine용 날짜 포맷 변환
  const preSaleDateFormatted = formatDateToMMDD(preSaleDate);
  const generalSaleDateFormatted = formatDateToMMDD(generalSaleDate);

  return (
    <main>
      <Heading className="flex items-baseline gap-20">
        행사별 예약자 수 추이 차트
        <BlueLink href="/events" className="text-14">
          대시보드로 돌아가기
        </BlueLink>
      </Heading>
      <div className="flex gap-24">
        {/* 좌측: 차트 영역 */}
        <div className="min-h-[400px] min-w-0 flex-1">
          {!selectedDailyEvent ? (
            <div className={CHART_PLACEHOLDER_STYLE}>
              이벤트와 일자별 행사를 선택해주세요
            </div>
          ) : isLoadingReservation ? (
            <div className={CHART_PLACEHOLDER_STYLE}>
              데이터를 불러오고 있습니다...
            </div>
          ) : chartDataList.length === 0 ? (
            <div className={CHART_PLACEHOLDER_STYLE}>
              예약 데이터가 없습니다
            </div>
          ) : (
            <article className="flex h-[400px] grow flex-col rounded-16 border border-basic-grey-200 bg-basic-white p-20">
              <Heading.h4 className="flex items-baseline text-14 font-600 text-basic-grey-700">
                <span className="shrink-0">
                  {selectedEvent?.eventName} -{' '}
                  {formatDateString(selectedDailyEvent.dailyEventDate, 'date')}
                </span>
                <span className="ml-[6px] line-clamp-1 self-center text-12 font-400 text-basic-grey-600">
                  예약자 수와 취소자 수는 별도로 표시됩니다
                </span>
              </Heading.h4>
              <div className="h-full w-full grow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartDataList}
                    margin={{ left: -10, right: 20 }}
                  >
                    <CartesianGrid stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="date"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      allowDataOverflow={true}
                      allowDecimals={false}
                      type="number"
                      domain={([dataMin, dataMax]: [number, number]) => {
                        const diff = 0.1;
                        const min =
                          Math.floor((dataMin * (1 - diff)) / 10) * 10;
                        const max = Math.ceil((dataMax * (1 + diff)) / 10) * 10;
                        return [min, max];
                      }}
                      tickFormatter={numberTickFormatter}
                    />
                    <Line
                      type="monotone"
                      dataKey="reservationCount"
                      name="예약자 수"
                      stroke={STROKE_COLORS.reservation}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: STROKE_COLORS.reservation }}
                      animationDuration={ANIMATION_DURATION}
                    />
                    <Line
                      type="monotone"
                      dataKey="cancelCount"
                      name="취소자 수"
                      stroke={STROKE_COLORS.cancel}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: STROKE_COLORS.cancel }}
                      animationDuration={ANIMATION_DURATION}
                    />
                    {/* 선예매일 표시 */}
                    {preSaleDateFormatted && (
                      <ReferenceLine
                        x={preSaleDateFormatted}
                        stroke={REFERENCE_LINE_COLORS.preSale}
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{
                          value: `선예매 (${preSaleDateFormatted})`,
                          position: 'insideLeft',
                          fill: REFERENCE_LINE_COLORS.preSale,
                          fontSize: 12,
                          dy: -20,
                        }}
                      />
                    )}
                    {/* 일반예매일 표시 */}
                    {generalSaleDateFormatted && (
                      <ReferenceLine
                        x={generalSaleDateFormatted}
                        stroke={REFERENCE_LINE_COLORS.generalSale}
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{
                          value: `일반예매 (${generalSaleDateFormatted})`,
                          position: 'right',
                          fill: REFERENCE_LINE_COLORS.generalSale,
                          fontSize: 12,
                        }}
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number, name: string) => [
                        value.toLocaleString('ko-KR'),
                        name,
                      ]}
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          )}
        </div>

        {/* 우측: 선택 패널 */}
        <div className="flex w-[320px] shrink-0 flex-col gap-24">
          {/* 이벤트 선택 드롭다운 */}
          <div className="rounded-16 border border-basic-grey-200 bg-basic-white p-20">
            <Heading.h5 className="!mb-12 !mt-0 !h-auto !p-0">
              이벤트 선택
            </Heading.h5>
            <Dropdown
              value={selectedEvent}
              onChange={handleEventChange}
              options={eventList ?? []}
              getOptionLabel={(event) => event.eventName}
              getOptionValue={(event) => event.eventId}
              placeholder={isEventLoading ? '로딩 중…' : '이벤트를 검색하세요'}
              isLoading={isEventLoading}
              searchable
              ariaLabel="이벤트 선택"
            />
          </div>

          {/* 선예매일 / 일반예매일 */}
          {selectedEvent && (
            <div className="flex flex-col gap-12 rounded-16 border border-basic-grey-200 bg-basic-white p-20">
              <div className="flex items-center justify-between">
                <Heading.h5 className="!mb-0 !mt-0 !h-auto !p-0">
                  예매일
                </Heading.h5>
                <button
                  type="button"
                  onClick={toggleSaleDateEditing}
                  className="rounded-4 p-4 text-basic-grey-500 transition-colors hover:bg-basic-grey-100 hover:text-basic-grey-700"
                  title={isEditingSaleDate ? '수정 취소' : '예매일 수정'}
                >
                  {isEditingSaleDate ? <X size={16} /> : <Settings size={16} />}
                </button>
              </div>
              {/* 읽기 모드 */}
              {!isEditingSaleDate && (
                <div className="gap-6 flex flex-col">
                  <div className="flex items-center justify-between text-14">
                    <span className="font-500 text-basic-grey-600">
                      선예매일
                    </span>
                    <span className="text-basic-grey-800 font-500">
                      {preSaleDate
                        ? formatDateString(preSaleDate, 'date')
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-14">
                    <span className="font-500 text-basic-grey-600">
                      일반예매일
                    </span>
                    <span className="text-basic-grey-800 font-500">
                      {generalSaleDate
                        ? formatDateString(generalSaleDate, 'date')
                        : '-'}
                    </span>
                  </div>
                </div>
              )}
              {/* 수정 모드 */}
              {isEditingSaleDate && (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <label className="text-12 font-500 text-basic-grey-600">
                      선예매일
                    </label>
                    <DateInput
                      value={preSaleDate ?? undefined}
                      setValue={setPreSaleDate}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-12 font-500 text-basic-grey-600">
                      일반예매일
                    </label>
                    <DateInput
                      value={generalSaleDate ?? undefined}
                      setValue={setGeneralSaleDate}
                    />
                  </div>
                  <Button
                    size="small"
                    variant="primary"
                    onClick={handleSaveSaleDate}
                    isLoading={isSavingMetadata}
                    className="mt-4 w-full"
                  >
                    예매일 저장
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 일자별 이벤트 선택 */}
          {selectedEvent && (
            <div className="rounded-16 border border-basic-grey-200 bg-basic-white p-20">
              <Heading.h5 className="!mb-12 !mt-0 !h-auto !p-0">
                일자별 행사 선택
              </Heading.h5>
              <div className="flex flex-col gap-8">
                {sortedDailyEventList.map((dailyEvent) => {
                  const isSelected =
                    selectedDailyEvent?.dailyEventId ===
                    dailyEvent.dailyEventId;
                  return (
                    <button
                      key={dailyEvent.dailyEventId}
                      type="button"
                      onClick={() => setSelectedDailyEvent(dailyEvent)}
                      className={`flex items-center justify-between rounded-8 border px-12 py-12 text-left text-14 font-500 transition-colors ${
                        isSelected
                          ? 'border-brand-primary-400 bg-brand-primary-50 text-brand-primary-400'
                          : 'border-basic-grey-200 bg-basic-white text-basic-grey-700 hover:bg-basic-grey-50'
                      }`}
                    >
                      <span>
                        {formatDateString(dailyEvent.dailyEventDate, 'date')}
                      </span>
                      <span
                        className={`py-2 rounded-full px-8 text-12 ${
                          dailyEvent.dailyEventStatus === 'OPEN'
                            ? 'bg-[#E8FFE6] text-[#00C83F]'
                            : dailyEvent.dailyEventStatus === 'INACTIVE'
                              ? 'bg-basic-grey-700 text-basic-white'
                              : 'bg-basic-grey-100 text-basic-grey-700'
                        }`}
                      >
                        {dailyEvent.dailyEventStatus}
                      </span>
                    </button>
                  );
                })}
                {sortedDailyEventList.length === 0 && (
                  <p className="py-8 text-center text-14 text-basic-grey-400">
                    일자별 행사가 없습니다
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
