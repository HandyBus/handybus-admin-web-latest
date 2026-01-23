import { useState, useRef, useEffect, useCallback } from 'react';
import CalendarIcon from './icons/calendar.svg';
import DatePicker from 'react-datepicker';
import dayjs, { Dayjs } from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { FILTER_PERIODS, FilterPeriod } from '../types/types';
import Heading from '@/components/text/Heading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnalysisSectionHeaderProps {
  title: string;
  selectedPeriod: FilterPeriod;
  onChangePeriod: (period: FilterPeriod) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onChangeDateRange: (start: Dayjs | null, end: Dayjs | null) => void;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  isNavigationDisabled?: boolean;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

const AnalysisSectionHeader = ({
  title,
  selectedPeriod,
  onChangePeriod,
  startDate,
  endDate,
  onChangeDateRange,
  onPrevClick,
  onNextClick,
  isNavigationDisabled = false,
  isPrevDisabled = false,
  isNextDisabled = false,
}: AnalysisSectionHeaderProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const formatDateRange = () => {
    if (!startDate || !endDate) return '모든 기간';
    const start = startDate.format('YYYY.MM.DD');
    const end = endDate.format('YYYY.MM.DD');
    return `${start} - ${end}`;
  };

  const currentPeriod = selectedPeriod;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    if (currentPeriod === '주간') {
      // 주 단위로 스냅 (Snap) - isoWeek는 월요일 시작
      const newStart = start ? dayjs(start).startOf('isoWeek') : null;
      const newEnd = end ? dayjs(end).endOf('isoWeek') : null;

      onChangeDateRange(newStart, newEnd);
      if (newStart && newEnd) {
        setIsDatePickerOpen(false);
      }
    } else {
      onChangeDateRange(start ? dayjs(start) : null, end ? dayjs(end) : null);
      if (start && end) {
        setIsDatePickerOpen(false);
      }
    }
  };

  const getWeeklyHighlightClass = useCallback(
    (date: Date) => {
      if (currentPeriod !== '주간' || !hoveredDate) return '';

      const startOfWeek = hoveredDate.startOf('isoWeek');
      const endOfWeek = hoveredDate.endOf('isoWeek');
      const targetDate = dayjs(date);

      if (
        targetDate.isAfter(startOfWeek.subtract(1, 'day')) &&
        targetDate.isBefore(endOfWeek) // NOTE: 원래 코드는 .add(1, 'day')가 추가되어있는데, +1 날짜 까지 스타일링되는 이슈가 있음.
      ) {
        return 'bg-basic-grey-200 !text-basic-black';
      }
      return '';
    },
    [currentPeriod, hoveredDate],
  );

  return (
    <div className="flex items-center justify-between">
      <Heading.h2>{title}</Heading.h2>
      <div className="flex items-center gap-16">
        <div className="flex h-[46px] items-start rounded-8 bg-basic-white p-4">
          {FILTER_PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => onChangePeriod(period)}
              className={`flex h-36 w-56 items-center justify-center rounded-8 text-14 font-500 ${
                currentPeriod === period
                  ? 'bg-basic-black text-basic-white'
                  : 'text-basic-grey-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={onPrevClick}
            disabled={isNavigationDisabled || isPrevDisabled}
            className={`flex h-48 w-48 items-center justify-center rounded-8 border border-basic-grey-200 bg-basic-white text-basic-grey-600 transition-colors ${
              isNavigationDisabled || isPrevDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-basic-grey-400 hover:text-basic-black'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={onNextClick}
            disabled={isNavigationDisabled || isNextDisabled}
            className={`flex h-48 w-48 items-center justify-center rounded-8 border border-basic-grey-200 bg-basic-white text-basic-grey-600 transition-colors ${
              isNavigationDisabled || isNextDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-basic-grey-400 hover:text-basic-black'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => {
              if (currentPeriod !== '전체') {
                setIsDatePickerOpen(!isDatePickerOpen);
              }
            }}
            disabled={currentPeriod === '전체'}
            className={`flex h-full w-220 items-center rounded-8 border border-basic-grey-200 bg-basic-white p-12 ${
              currentPeriod === '전체'
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-basic-grey-400'
            }`}
          >
            <div className="flex items-center gap-8">
              <CalendarIcon />
              <span
                className={`text-14 font-500 ${
                  currentPeriod === '전체'
                    ? 'text-basic-grey-400'
                    : 'text-basic-black'
                }`}
              >
                {formatDateRange()}
              </span>
            </div>
          </button>
          {isDatePickerOpen && currentPeriod !== '전체' && (
            <div
              className="absolute left-0 top-full z-50 mt-4"
              onMouseLeave={() => setHoveredDate(null)}
            >
              <DatePicker
                selected={startDate ? startDate.toDate() : null}
                onChange={handleDateChange}
                onDayMouseEnter={(date) => {
                  if (currentPeriod === '주간') {
                    setHoveredDate(dayjs(date));
                  }
                }}
                dayClassName={getWeeklyHighlightClass}
                selectsRange
                startDate={startDate ? startDate.toDate() : null}
                endDate={endDate ? endDate.toDate() : null}
                minDate={dayjs('2025-02-12').toDate()}
                maxDate={dayjs().toDate()}
                inline
                className="rounded-8 border border-basic-grey-200 bg-basic-white shadow-lg"
                locale={{ ...ko, options: { ...ko.options, weekStartsOn: 1 } }}
                showMonthYearPicker={currentPeriod === '월간'}
                dateFormat={currentPeriod === '월간' ? 'yyyy.MM' : 'yyyy.MM.dd'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisSectionHeader;
