'use client';

import { useState, useRef, useEffect } from 'react';
import CalendarIcon from './icons/calendar.svg';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { FILTER_PERIODS, FilterPeriod } from '../types/types';

interface AnalysisSectionHeaderProps {
  title: string;
  selectedPeriod: FilterPeriod;
  onChangePeriod: (period: FilterPeriod) => void;
  startDate: Date | null;
  endDate: Date | null;
  onChangeDateRange: (start: Date | null, end: Date | null) => void;
}

const AnalysisSectionHeader = ({
  title,
  selectedPeriod,
  onChangePeriod,
  startDate,
  endDate,
  onChangeDateRange,
}: AnalysisSectionHeaderProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const formatDateRange = () => {
    if (!startDate || !endDate) return '모든 기간';
    const start = dayjs(startDate).format('YYYY.MM.DD');
    const end = dayjs(endDate).format('YYYY.MM.DD');
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

  return (
    <div className="flex items-center justify-between">
      <span className="text-20 font-600 text-basic-black">{title}</span>
      <div className="flex items-center gap-16">
        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => {
              if (currentPeriod !== '전체') {
                setIsDatePickerOpen(!isDatePickerOpen);
              }
            }}
            disabled={currentPeriod === '전체'}
            className={`flex h-full items-center rounded-8 border border-basic-grey-200 bg-basic-white p-12 ${
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
            <div className="absolute left-0 top-full z-50 mt-4">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates as [Date | null, Date | null];
                  onChangeDateRange(start, end);
                  if (start && end) {
                    setIsDatePickerOpen(false);
                  }
                }}
                selectsRange
                startDate={startDate}
                endDate={endDate}
                inline
                className="rounded-8 border border-basic-grey-200 bg-basic-white shadow-lg"
                locale={ko}
              />
            </div>
          )}
        </div>
        <div className="h-46 flex items-start rounded-8 bg-basic-white p-4">
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
      </div>
    </div>
  );
};

export default AnalysisSectionHeader;
