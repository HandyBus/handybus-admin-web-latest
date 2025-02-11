import dayjs from 'dayjs';

export const dayjsTz = (date: string) => {
  return dayjs(date).tz().toDate();
};

export const today = () => {
  const today = dayjs().tz().toDate();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const now = () => {
  return dayjs().tz().toDate();
};

export const diffInDays = (date1: Date, date2: Date) => {
  const diff = date1.getTime() - date2.getTime();
  return diff / (1000 * 60 * 60 * 24);
};

export const toDateOnly = (date: Date) => {
  const ret = dayjs(date).tz().toDate();
  return ret;
};

const isDateOnly = (date: Date) => {
  return (
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0 &&
    date.getMilliseconds() === 0
  );
};

export const formatDate = (date: Date, type: 'date' | 'datetime' = 'date') => {
  if (type === 'datetime') {
    return dayjs(date).format('YYYY. MM. DD. HH:mm:ss');
  } else {
    if (!isDateOnly(date))
      console.warn('printing non-date only Date to YYYY. MM. DD');
    return dayjs(date).format('YYYY. MM. DD');
  }
};

export const formatDateString = (
  date: string | null | undefined,
  type: 'date' | 'datetime' = 'date',
  defaultValue?: string,
) => {
  if (!date) return defaultValue || '';
  return formatDate(dayjsTz(date), type);
};
