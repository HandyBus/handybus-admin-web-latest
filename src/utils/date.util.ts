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

// const isDateOnly = (date: Date) => {
//   return (
//     date.getHours() === 0 &&
//     date.getMinutes() === 0 &&
//     date.getSeconds() === 0 &&
//     date.getMilliseconds() === 0
//   );
// };

export const formatDate = (date: Date, type: 'date' | 'datetime' = 'date') => {
  if (type === 'datetime') {
    return dayjs(date).format('YYYY. MM. DD. HH:mm:ss');
  } else {
    // if (!isDateOnly(date))
    //   console.warn('printing non-date only Date to YYYY. MM. DD');
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

export const convertToUTC = (dateString: string) => {
  const localDate = dayjs.tz(dateString, 'Asia/Seoul');
  const utcDate = localDate.utc();
  return utcDate.format('YYYY-MM-DD HH:mm:ss');
};
