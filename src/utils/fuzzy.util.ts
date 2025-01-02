import { matches } from 'kled';

export const filterByFuzzy = <T>(
  list: readonly T[],
  query: string,
  accessor: (t: T) => string,
  threshold: number = 0,
) => {
  return list
    .map((item) => {
      const value = accessor(item);
      return {
        item,
        score:
          query.length > value.length
            ? matches(value, query)
            : matches(query, value),
      };
    })
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > threshold)
    .map((item) => item.item);
};
