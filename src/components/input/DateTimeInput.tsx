'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
interface Props {
  disabled?: boolean;
  value: Date | null;
  setValue: (value: Date | null) => void;
}

const DateTimeInput = ({ disabled, value, setValue }: Props) => {
  return (
    <DatePicker
      disabled={disabled}
      selected={value}
      onChange={(date) => setValue(date)}
      showIcon
      showTimeSelect
      dateFormat="yyyy-MM-dd HH:mm:ss"
    />
  );
};

export default DateTimeInput;
