import { useState, useEffect, useMemo } from 'react';
import {
  getRecentUsageHistory,
  type UsageHistoryItem as ApiUsageHistoryItem,
} from '@/apis/getUserUsageHistory';
import type { UsageHistoryItem } from '@/types/usageHistory';

interface UseRecentUsageHistoryReturn {
  recentUsageHistory: UsageHistoryItem[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

/**
 * 최근 이용 내역 데이터를 관리하는 훅 (마이페이지용)
 */
const useRecentUsageHistory = (): UseRecentUsageHistoryReturn => {
  const [apiData, setApiData] = useState<ApiUsageHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 날짜 포맷팅
   * @param dateStr "2025-07-29T00:00:00" 형태
   * @returns "7월 29일" 형태
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  /**
   * 시간 포맷팅
   * @param dateStr "2025-07-29T00:00:00" 형태
   * @returns "00:00" 형태
   */
  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  /**
   * 카테고리 매핑
   * @param apiCategory API에서 받은 카테고리
   * @returns 프론트엔드에서 사용하는 카테고리
   */
  const mapCategory = (apiCategory: string): UsageHistoryItem['category'] => {
    const categoryMap: Record<string, UsageHistoryItem['category']> = {
      SHOPPING: 'SHOPPING',
      ACTIVITY: 'ACTIVITY',
      LIFE: 'LIFE',
      FOOD: 'FOOD',
      CULTURE: 'CULTURE',
      BEAUTY: 'BEAUTY',
      CAFE: 'CAFE',
      EDUCATION: 'EDUCATION',
      BAKERY: 'BAKERY',
      POPUP: 'POPUP',
    };

    return categoryMap[apiCategory] || 'LIFE';
  };

  /**
   * API 데이터를 프론트엔드 형태로 변환
   */
  const recentUsageHistory: UsageHistoryItem[] = useMemo(() => {
    return apiData.map((item, index) => ({
      id: `${index + 1}`, // API에 id가 없으므로 인덱스 사용
      storeName: item.placeName,
      usedDate: `${formatDate(item.usedAt)} ${formatTime(item.usedAt)}`,
      originalPrice: item.originalAmount,
      discountPrice: item.totalDiscountAmount,
      category: mapCategory(item.placeCategory),
      storeClass: 'FRANCHISE' as const, // API에 해당 정보가 없으므로 기본값
    }));
  }, [apiData]);

  /**
   * 데이터 로드 함수
   */
  const loadData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getRecentUsageHistory();
      if (data) {
        setApiData(data);
      } else {
        setApiData([]);
      }
    } catch (err) {
      setError('이용 내역을 불러올 수 없습니다.');
      setApiData([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 데이터 새로고침 함수
   */
  const refreshData = async (): Promise<void> => {
    await loadData();
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  return {
    recentUsageHistory,
    isLoading,
    error,
    refreshData,
  };
};

export default useRecentUsageHistory;
