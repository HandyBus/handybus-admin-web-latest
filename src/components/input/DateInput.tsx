'use client';

import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
interface Props {
  disabled?: boolean;
  value?: string;
  setValue?: (value: string | null) => void;
}

const DateInput = ({ disabled, value, setValue }: Props) => {
  return (
    <DatePicker
      disabled={disabled}
      selected={value ? dayjs(value).tz('Asia/Seoul').toDate() : undefined}
      onChange={
        setValue
          ? (date) =>
              date &&
              setValue(dayjs(date, 'Asia/Seoul').startOf('day').toISOString())
          : undefined
      }
      showIcon
      placeholderText=" 날짜를 선택해주세요"
      dateFormat=" yyyy-MM-dd"
      className="rounded-[4px] border border-basic-grey-200"
    />
  );
};

export default DateInput;
