import { Dayjs } from 'dayjs';

const roundUpToNearestFiveMinutes = (time: Dayjs) => {
  const minutes = time.minute();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  return time.add(roundedMinutes - minutes, 'minute');
};

const roundDownToNearestFiveMinutes = (time: Dayjs) => {
  const minutes = time.minute();
  const roundedMinutes = Math.floor(minutes / 5) * 5;
  return time.subtract(minutes - roundedMinutes, 'minute');
};

export { roundUpToNearestFiveMinutes, roundDownToNearestFiveMinutes };
