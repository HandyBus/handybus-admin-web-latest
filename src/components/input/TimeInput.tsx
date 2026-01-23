'use client';

import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  disabled?: boolean;
  value: string | null; // HH:mm 형식
  setValue: (value: string | null) => void;
}

const TimeInput = ({ disabled, value, setValue }: Props) => {
  // HH:mm 형식의 문자열을 Date 객체로 변환 (오늘 날짜 사용)
  const getDateFromTime = (timeString: string | null) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return dayjs().hour(hours).minute(minutes).second(0).toDate();
  };

  // Date 객체를 HH:mm 형식의 문자열로 변환
  const getTimeFromDate = (date: Date | null) => {
    if (!date) return null;
    return dayjs(date).format('HH:mm');
  };

  return (
    <DatePicker
      disabled={disabled}
      selected={value ? getDateFromTime(value) : null}
      onChange={(date) => setValue(getTimeFromDate(date))}
      showIcon
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={5}
      dateFormat="HH:mm"
      className="w-full rounded-4 border border-basic-grey-200 outline-none focus:border-brand-primary-400"
      wrapperClassName="w-full"
    />
  );
};

export default TimeInput;
