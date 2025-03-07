export const discountPercent = (price: number, priceAfterDiscount: number) => {
  const amount = ((price - priceAfterDiscount) / price) * 100;
  if (amount < 0) return '(오류: 얼리버드가 더 비쌉니다.)';
  return '(' + amount.toFixed(2) + '% 할인)';
};
