import type {
  CategoryData,
  CalculatedCategoryData,
  ApiMonthlyData,
  CalculatedMonthSummary,
} from './types';

export const useStatisticsCalculations = () => {
  // 전체 할인 금액 계산
  const calculateTotalDiscount = (categoryData: CategoryData[]): number => {
    return categoryData.reduce((total, item) => total + item.discountAmount, 0);
  };

  // 증감률 계산
  const calculateGrowthRate = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  // 월별 통계 계산
  const calculateMonthSummary = (
    apiData: ApiMonthlyData,
    prevData: ApiMonthlyData | null,
    usageAmount: number,
    prevUsageAmount: number
  ): CalculatedMonthSummary => {
    const discountAmount = calculateTotalDiscount(apiData.categoryData);

    let usageGrowth = 0;
    let discountGrowth = 0;

    if (prevData) {
      const prevDiscountAmount = calculateTotalDiscount(prevData.categoryData);
      usageGrowth = calculateGrowthRate(usageAmount, prevUsageAmount);
      discountGrowth = calculateGrowthRate(discountAmount, prevDiscountAmount);
    }

    return {
      usageAmount,
      discountAmount,
      usageGrowth,
      discountGrowth,
    };
  };

  // 카테고리별 퍼센트 계산
  const calculateCategoryPercentages = (categoryData: CategoryData[]): CalculatedCategoryData[] => {
    const totalDiscount = calculateTotalDiscount(categoryData);

    if (totalDiscount === 0) return [];

    return categoryData.map((item) => ({
      ...item,
      discountPercentage: Math.round((item.discountAmount / totalDiscount) * 100),
    }));
  };

  return {
    calculateTotalDiscount,
    calculateGrowthRate,
    calculateMonthSummary,
    calculateCategoryPercentages,
  };
};
