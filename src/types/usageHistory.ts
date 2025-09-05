import type { CategoryType, StoreClassType } from './myPage';

export interface UsageHistoryItem {
  id: string;
  storeName: string;
  usedDate: string;
  originalPrice: number;
  discountPrice: number;
  category: CategoryType;
  storeClass: StoreClassType;
  rawDate?: string; // 필터링을 위한 원본 날짜 데이터
}

export interface UsageHistoryStatsData {
  totalSavings: number;
  totalTransactions: number;
  totalItems: number;
  totalDiscount: number;
  totalOriginal: number;
}

export interface UsageHistoryFilter {
  category: string;
  period: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export type { CategoryType, StoreClassType };
