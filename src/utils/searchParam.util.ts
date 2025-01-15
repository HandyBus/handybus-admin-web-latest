const toSearchParams = <T>(params: Record<string, T> | undefined) => {
  const searchParams = new URLSearchParams();
  if (!params) {
    return searchParams;
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams;
};

export const toSearchParamString = <T>(
  params: Record<string, T> | undefined,
  prefix: '?' | '&' | '' = '',
) => {
  const searchParams = toSearchParams(params);
  return searchParams.toString() ? `${prefix}${searchParams.toString()}` : '';
};
