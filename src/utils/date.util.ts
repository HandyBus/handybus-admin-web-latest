import dayjs, { Dayjs } from 'dayjs';

const formatDate = (date: Dayjs, type: 'date' | 'datetime' = 'date') => {
  if (type === 'datetime') {
    return date.format('YYYY. MM. DD. HH:mm:ss');
  } else {
    return date.format('YYYY. MM. DD');
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
  return formatDate(dayjs(date).tz('Asia/Seoul'), type);
};
