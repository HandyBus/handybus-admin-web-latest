import { matches } from 'kled';

/**
 * fuzzy search를 통해 list를 필터링하고 정렬합니다.
 *
 * @param list 필터링할 list
 * @param query 검색어, 빈 경우 전체 list를 그대로 반환합니다.
 * @param accessor list의 각 item에서 검색어를 추출하는 함수
 * @param threshold (기본값: 0) 검색 결과의 최소 점수, 매우 낮게 설정하는 것을 추천합니다.
 * @returns
 */
export const filterByFuzzy = <T>(
  list: readonly T[],
  query: string,
  accessor: (t: T) => string,
  threshold: number = 0,
): T[] => {
  if (!query) return [...list];

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
