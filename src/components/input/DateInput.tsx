'use client';

import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
interface Props {
  disabled?: boolean;
  value: string;
  setValue: (value: string | null) => void;
}

const DateInput = ({ disabled, value, setValue }: Props) => {
  return (
    <DatePicker
      disabled={disabled}
      selected={dayjs(value).tz('Asia/Seoul').toDate()}
      onChange={(date) =>
        date && setValue(dayjs(date, 'Asia/Seoul').startOf('day').toISOString())
      }
      showIcon
      dateFormat=" yyyy-MM-dd"
      className="rounded-[4px] border border-grey-200"
    />
  );
};

export default DateInput;
