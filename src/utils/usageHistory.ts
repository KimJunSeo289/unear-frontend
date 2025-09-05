import type { UsageHistoryItem, CategoryType, UsageHistoryStatsData } from '@/types/usageHistory';

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ko-KR')}원`;
};

export const getCategoryDisplayName = (category: CategoryType): string => {
  const categoryMap: Record<CategoryType, string> = {
    CAFE: '카페',
    FOOD: '푸드',
    LIFE: '편의점',
    SHOPPING: '쇼핑',
    CULTURE: '엔터테인먼트',
    BAKERY: '베이커리',
    ACTIVITY: '액티비티',
    EDUCATION: '교육',
    BEAUTY: '뷰티/건강',
    POPUP: '팝업스토어',
  };

  return categoryMap[category] || '기타';
};

export const calculateStats = (items: UsageHistoryItem[]): UsageHistoryStatsData => ({
  totalSavings: items.reduce((sum, item) => sum + item.discountPrice, 0),
  totalTransactions: items.length,
  totalItems: items.length,
  totalDiscount: items.reduce((sum, item) => sum + item.discountPrice, 0),
  totalOriginal: items.reduce((sum, item) => sum + item.originalPrice, 0),
});

export const filterUsageHistory = (
  items: UsageHistoryItem[],
  categoryFilter: string,
  periodFilter: string
): UsageHistoryItem[] => {
  return items.filter((item) => {
    const categoryMatch =
      categoryFilter === '전체' || getCategoryDisplayName(item.category) === categoryFilter;

    // 기간 필터 로직 - 현재는 전체만 처리, 추후 확장 가능
    const periodMatch = periodFilter === '전체';

    return categoryMatch && periodMatch;
  });
};
