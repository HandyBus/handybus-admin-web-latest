'use client';

import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface Props {
  disabled?: boolean;
  value: string | null;
  setValue: (value: string | null) => void;
}

const DateTimeInput = ({ disabled, value, setValue }: Props) => {
  return (
    <DatePicker
      disabled={disabled}
      selected={value ? dayjs(value).tz('Asia/Seoul').toDate() : null}
      onChange={(date) =>
        date && setValue(dayjs.tz(date, 'Asia/Seoul').toISOString())
      }
      showIcon
      showTimeSelect
      dateFormat="yyyy. MM. dd HH:mm"
      className="rounded-[4px] border border-grey-200"
    />
  );
};

export default DateTimeInput;
