import { useState, useMemo } from 'react';
import type { UsageHistoryItem, UsageHistoryFilter } from '@/types/usageHistory';
import { filterUsageHistory, calculateStats } from '@/utils/usageHistory';

interface UseUsageHistoryProps {
  data: UsageHistoryItem[];
  initialPageSize?: number;
  pageSize?: number;
}

export const useUsageHistory = ({
  data,
  initialPageSize = 8,
  pageSize = 8,
}: UseUsageHistoryProps) => {
  const [visibleItemsCount, setVisibleItemsCount] = useState(initialPageSize);
  const [filter, setFilter] = useState<UsageHistoryFilter>({
    category: '전체',
    period: '전체',
  });

  const filteredData = useMemo(
    () => filterUsageHistory(data, filter.category, filter.period),
    [data, filter.category, filter.period]
  );

  const displayedData = useMemo(
    () => filteredData.slice(0, visibleItemsCount),
    [filteredData, visibleItemsCount]
  );

  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  const hasMoreItems = visibleItemsCount < filteredData.length;

  const handleFilterChange = (category: string, period: string) => {
    setFilter({ category, period });
    setVisibleItemsCount(initialPageSize); // 필터 변경 시 페이지네이션 리셋
  };

  const handleLoadMore = () => {
    setVisibleItemsCount((prev) => prev + pageSize);
  };

  const resetPagination = () => {
    setVisibleItemsCount(initialPageSize);
  };

  return {
    displayedData,
    filteredData,
    stats,
    filter,
    hasMoreItems,
    handleFilterChange,
    handleLoadMore,
    resetPagination,
  };
};
