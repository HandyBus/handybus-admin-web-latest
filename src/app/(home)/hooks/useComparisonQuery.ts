import { useQuery } from '@tanstack/react-query';

interface UseComparisonQueryProps<T> {
  queryKey: string[];
  fetcher: (startDate: string, endDate: string) => Promise<T>;
  currentStartDate: string;
  currentEndDate: string;
  prevStartDate: string;
  prevEndDate: string;
  enabled?: boolean;
}

export const useComparisonQuery = <T>({
  queryKey,
  fetcher,
  currentStartDate,
  currentEndDate,
  prevStartDate,
  prevEndDate,
  enabled = true,
}: UseComparisonQueryProps<T>) => {
  const { data: currentData, isLoading: isCurrentLoading } = useQuery({
    queryKey: [...queryKey, currentStartDate, currentEndDate],
    queryFn: () => fetcher(currentStartDate, currentEndDate),
    enabled,
  });

  const { data: prevData, isLoading: isPrevLoading } = useQuery({
    queryKey: [...queryKey, prevStartDate, prevEndDate],
    queryFn: () => fetcher(prevStartDate, prevEndDate),
    enabled: enabled && !!prevStartDate && !!prevEndDate,
  });

  return {
    currentData,
    prevData,
    isLoading: isCurrentLoading || isPrevLoading,
  };
};
