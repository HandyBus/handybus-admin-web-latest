import dayjs from 'dayjs';

export const today = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now;
};

export const diffInDays = (date1: Date, date2: Date) => {
  const diff = date1.getTime() - date2.getTime();
  return diff / (1000 * 60 * 60 * 24);
};

export const toDateOnly = (date: Date) => {
  const ret = new Date(date);
  ret.setUTCHours(0, 0, 0, 0);
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
) => {
  if (!date) return '';
  return formatDate(new Date(date), type);
};
