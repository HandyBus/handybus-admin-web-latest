/**
 * 할인율을 계산하여 포맷팅합니다.
 */
export const calculateDiscountPercent = (
  regular: number,
  earlybird: number,
): string => {
  if (regular === 0 || earlybird === 0) return '';
  const discount = (((regular - earlybird) / regular) * 100).toFixed(0);
  return `(${discount}% 할인)`;
};
