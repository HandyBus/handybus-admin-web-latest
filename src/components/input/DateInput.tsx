'use client';

import { toDateOnly } from '@/utils/date.util';
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
      selected={new Date(value)}
      onChange={(date) => date && setValue(toDateOnly(date).toISOString())}
      showIcon
      dateFormat="yyyy-MM-dd"
      className="rounded-[4px] border border-grey-200"
    />
  );
};

export default DateInput;
