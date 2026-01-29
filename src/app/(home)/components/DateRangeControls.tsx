import { useRef, useState, useEffect } from 'react';
import CalendarIcon from './icons/calendar.svg';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Input from '@/components/input/Input';
import DatePicker from 'react-datepicker';
import dayjs, { Dayjs } from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { FilterPeriod } from '../types/types';

interface DateRangeControlsProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onPrevClick: () => void;
  onNextClick: () => void;
  onDateRangeChange: (start: Dayjs | null, end: Dayjs | null) => void;
  onAllTimeClick: () => void;
  isAllTime: boolean;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  period?: FilterPeriod;
}

const DateRangeControls = ({
  startDate,
  endDate,
  onPrevClick,
  onNextClick,
  onDateRangeChange,
  onAllTimeClick,
  isAllTime,
  isPrevDisabled = false,
  isNextDisabled = false,
  period = '일간',
}: DateRangeControlsProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // 수기 입력 상태
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  // 팝업이 열리거나 날짜가 변경될 때 입력값 동기화
  useEffect(() => {
    if (isDatePickerOpen) {
      setStartInput(startDate ? startDate.format('YYYY.MM.DD') : '');
      setEndInput(endDate ? endDate.format('YYYY.MM.DD') : '');
    }
  }, [isDatePickerOpen, startDate, endDate]);

  const formatDateRange = () => {
    if (!startDate || !endDate) return '기간 선택';
    const start = startDate.format('YYYY.MM.DD');
    const end = endDate.format('YYYY.MM.DD');
    return `${start} - ${end}`;
  };

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

  const handleManualInputChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') setStartInput(value);
    else setEndInput(value);
  };

  const handleManualInputSubmit = () => {
    // Validate format YYYY.MM.DD or YYYY-MM-DD or YYYYMMDD
    const parseDate = (input: string) => {
      // 기호 제거
      const cleanInput = input.replace(/[\.\-\/]/g, '');
      if (cleanInput.length !== 8) return null;

      const date = dayjs(cleanInput, 'YYYYMMDD');
      if (!date.isValid()) return null;
      return date;
    };

    const newStart = parseDate(startInput);
    const newEnd = parseDate(endInput);

    if (newStart && newEnd) {
      // 기존 handleDateChange 로직과 동일하게 기간별 처리 적용
      if (period === '월간') {
        const s = newStart.startOf('month');
        const e = newEnd.endOf('month');
        onDateRangeChange(s, e);
      } else if (period === '주간') {
        const s = newStart.startOf('isoWeek');
        const e = newEnd.endOf('isoWeek');
        onDateRangeChange(s, e);
      } else {
        onDateRangeChange(newStart, newEnd);
      }
      setIsDatePickerOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualInputSubmit();
    }
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    if (period === '월간') {
      const newStart = start ? dayjs(start).startOf('month') : null;
      const newEnd = end ? dayjs(end).endOf('month') : null;
      onDateRangeChange(newStart, newEnd);
      if (start && end) setIsDatePickerOpen(false);
    } else if (period === '주간') {
      const newStart = start ? dayjs(start).startOf('isoWeek') : null;
      const newEnd = end ? dayjs(end).endOf('isoWeek') : null;

      onDateRangeChange(newStart, newEnd);
      if (start && end) setIsDatePickerOpen(false);
    } else {
      // 일간
      onDateRangeChange(start ? dayjs(start) : null, end ? dayjs(end) : null);
      if (start && end) setIsDatePickerOpen(false);
    }
  };

  const dayClassName = (date: Date) => {
    if (period === '주간' && hoveredDate) {
      // 마우스 오버된 날짜가 포함된 주 강조
      const hovered = dayjs(hoveredDate);
      const current = dayjs(date);
      if (current.isSame(hovered, 'isoWeek')) {
        return 'bg-basic-grey-200'; // Use your project's color palette
      }
    }
    return '';
  };

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={onPrevClick}
          disabled={isPrevDisabled}
          className={`flex h-48 w-48 items-center justify-center rounded-8 border border-basic-grey-200 bg-basic-white text-basic-grey-600 transition-colors ${
            isPrevDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'hover:border-basic-grey-400 hover:text-basic-black'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={onNextClick}
          disabled={isNextDisabled}
          className={`flex h-48 w-48 items-center justify-center rounded-8 border border-basic-grey-200 bg-basic-white text-basic-grey-600 transition-colors ${
            isNextDisabled
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
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className={`flex h-full w-220 cursor-pointer items-center rounded-8 border border-basic-grey-200 bg-basic-white p-12 hover:border-basic-grey-400`}
        >
          <div className="flex items-center gap-8">
            <CalendarIcon />
            <span className="text-14 font-500 text-basic-black">
              {formatDateRange()}
            </span>
          </div>
        </button>
        {isDatePickerOpen && (
          <div
            className="absolute left-0 top-full z-50 mt-4 flex flex-col gap-12 rounded-8 border border-basic-grey-200 bg-basic-white p-16 shadow-lg"
            onMouseLeave={() => setHoveredDate(null)}
          >
            <div className="flex items-center justify-between">
              <Input
                value={startInput}
                onChange={(e) =>
                  handleManualInputChange('start', e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="YYYY.MM.DD"
                className="h-32 w-108 text-14"
              />
              <span className="text-14 text-basic-grey-500">-</span>
              <Input
                value={endInput}
                onChange={(e) => handleManualInputChange('end', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="YYYY.MM.DD"
                className="h-32 w-108 text-14"
              />
            </div>
            <DatePicker
              selected={startDate ? startDate.toDate() : null}
              onChange={handleDateChange}
              selectsRange={true}
              startDate={startDate ? startDate.toDate() : null}
              endDate={endDate ? endDate.toDate() : null}
              minDate={dayjs('2025-02-12').toDate()}
              maxDate={dayjs().subtract(1, 'day').toDate()}
              inline
              // className="rounded-8 border border-basic-grey-200 bg-basic-white shadow-lg"
              locale={{ ...ko, options: { ...ko.options, weekStartsOn: 1 } }}
              dateFormat={period === '월간' ? 'yyyy.MM' : 'yyyy.MM.dd'}
              showMonthYearPicker={period === '월간'}
              // Weekly specific props
              dayClassName={dayClassName}
              onDayMouseEnter={(date) => setHoveredDate(date)}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAllTimeClick}
        className={`flex h-48 items-center justify-center rounded-8 border px-16 text-14 font-500 transition-colors ${
          isAllTime
            ? 'border-basic-black bg-basic-black text-basic-white'
            : 'border-basic-grey-200 bg-basic-white text-basic-grey-700 hover:border-basic-grey-400'
        }`}
      >
        전체
      </button>
    </div>
  );
};

export default DateRangeControls;
