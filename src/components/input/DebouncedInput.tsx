import { useEffect, useState } from 'react';
import Input from './Input';

interface Props {
  value: string;
  setValue: (value: string) => void;
  delay?: number;
  placeholder?: string;
}

const DebouncedInput = ({
  value: debouncedValue,
  setValue: setDebouncedValue,
  delay = 200,
  ...props
}: Props) => {
  const [value, setValue] = useState(debouncedValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);

  return <Input value={value} setValue={setValue} {...props} />;
};

export default DebouncedInput;
