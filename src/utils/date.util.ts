export const today = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const diffInDays = (date1: Date, date2: Date) => {
  const diff = date1.getTime() - date2.getTime();
  return diff / (1000 * 60 * 60 * 24);
};

export const toDateOnly = (date: Date) => {
  const ret = new Date(date);
  ret.setHours(0, 0, 0, 0);
  return ret;
};
