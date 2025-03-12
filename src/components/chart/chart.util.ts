import { COLORS } from './chart.const';

export const getColorByIndex = (index: number, colors?: string[]) => {
  return colors?.[index % colors.length] ?? COLORS[index % COLORS.length];
};

export const numberTickFormatter = (value: number) => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(1)}천만`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}만`;
  }
  return value.toString();
};

export const percentageTickFormatter = (value: number, maxValue: number) => {
  const percentage = (value / maxValue) * 100;
  return `${percentage.toFixed(0)}%`;
};
