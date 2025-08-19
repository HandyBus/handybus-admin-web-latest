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
    <div>
      <DatePicker
        disabled={disabled}
        selected={value ? dayjs(value).tz('Asia/Seoul').toDate() : null}
        onChange={(date) =>
          date && setValue(dayjs.tz(date, 'Asia/Seoul').toISOString())
        }
        showIcon
        showTimeSelect
        dateFormat="yyyy. MM. dd HH:mm"
        className="rounded-4 border border-basic-grey-200 border-transparent outline-none focus:border-brand-primary-400"
      />
    </div>
  );
};

export default DateTimeInput;
