import { useState } from 'react';
import type { CategoryData, ApiMonthlyData } from './types';

export const useStatisticsData = () => {
  const [currentMonth, setCurrentMonth] = useState(7);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // API에서 받아올 최소한의 데이터
  const apiMonthlyDataMap: Record<number, ApiMonthlyData> = {
    1: {
      month: 1,
      categoryData: [
        { category: 'CAFE', categoryName: '카페', discountAmount: 7200 },
        { category: 'SHOPPING', categoryName: '쇼핑', discountAmount: 5200 },
      ],
    },
    2: {
      month: 2,
      categoryData: [
        { category: 'FOOD', categoryName: '외식', discountAmount: 9100 },
        { category: 'BEAUTY', categoryName: '뷰티', discountAmount: 6700 },
      ],
    },
    3: {
      month: 3,
      categoryData: [],
    },
    4: {
      month: 4,
      categoryData: [
        { category: 'FOOD', categoryName: '외식', discountAmount: 18000 },
        { category: 'SHOPPING', categoryName: '쇼핑', discountAmount: 12000 },
      ],
    },
    5: {
      month: 5,
      categoryData: [
        { category: 'CAFE', categoryName: '카페', discountAmount: 16800 },
        { category: 'FOOD', categoryName: '외식', discountAmount: 11200 },
      ],
    },
    6: {
      month: 6,
      categoryData: [
        { category: 'FOOD', categoryName: '외식', discountAmount: 25200 },
        { category: 'CAFE', categoryName: '카페', discountAmount: 16800 },
      ],
    },
    7: {
      month: 7,
      categoryData: [
        { category: 'FOOD', categoryName: '외식', discountAmount: 8904 },
        { category: 'SHOPPING', categoryName: '쇼핑', discountAmount: 7420 },
        { category: 'CAFE', categoryName: '카페', discountAmount: 2544 },
        { category: 'BEAUTY', categoryName: '뷰티', discountAmount: 1696 },
        { category: 'CULTURE', categoryName: '문화', discountAmount: 636 },
      ],
    },
  };

  // 사용금액 데이터 (별도 관리)
  const usageAmountMap: Record<number, number> = {
    1: 89200,
    2: 102300,
    3: 0,
    4: 125600,
    5: 142800,
    6: 156900,
    7: 158300,
  };

  const currentApiData = apiMonthlyDataMap[currentMonth];
  const currentUsageAmount = usageAmountMap[currentMonth] || 0;

  // 전월 데이터 가져오기
  const getPreviousMonthData = (month: number): ApiMonthlyData | null => {
    if (month <= 1) return null;
    return apiMonthlyDataMap[month - 1] || null;
  };

  const getPreviousUsageAmount = (month: number): number => {
    if (month <= 1) return 0;
    return usageAmountMap[month - 1] || 0;
  };

  const previousMonthData = getPreviousMonthData(currentMonth);
  const previousUsageAmount = getPreviousUsageAmount(currentMonth);

  return {
    currentMonth,
    setCurrentMonth,
    showAllCategories,
    setShowAllCategories,
    currentApiData,
    previousMonthData,
    currentUsageAmount,
    previousUsageAmount,
  };
};
