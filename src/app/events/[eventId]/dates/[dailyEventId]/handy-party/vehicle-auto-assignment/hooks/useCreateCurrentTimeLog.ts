import dayjs from 'dayjs';
import { useState } from 'react';

const useCreateCurrentTimeLog = () => {
  const [logText, setLogText] = useState<string[]>([]);

  const createCurrentTimeLog = (log: string) => {
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    setLogText((prev) => [...prev, `${currentTime} ${log}`]);
  };

  return { logText, createCurrentTimeLog };
};

export default useCreateCurrentTimeLog;
