export const calculatePercentage = (current: number, prev: number) => {
  if (!prev || prev === 0) return current > 0 ? '100%' : '-';
  // (Recent - PreRecent) / PreRecent
  const percent = ((current - prev) / prev) * 100;
  return percent.toFixed(1) + '%';
};
