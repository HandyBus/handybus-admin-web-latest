import dayjs from 'dayjs';

export const dayjsTz = (date: string) => {
  return dayjs(date).tz().toDate();
};

export const today = () => {
  return dayjs().tz().startOf('day');
};

export const toDateOnly = (date: Date) => {
  const ret = dayjs(date).tz().toDate();
  return ret;
};

export const formatDate = (date: Date, type: 'date' | 'datetime' = 'date') => {
  if (type === 'datetime') {
    return dayjs(date).format('YYYY. MM. DD. HH:mm:ss');
  } else {
    return dayjs(date).format('YYYY. MM. DD');
  }
};

export const formatDateString = (
  date: string | null | undefined,
  type: 'date' | 'datetime' = 'date',
  defaultValue?: string,
) => {
  if (!date) {
    return defaultValue || '';
  }
  return formatDate(dayjsTz(date), type);
};
