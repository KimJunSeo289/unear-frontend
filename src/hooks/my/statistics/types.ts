// 카테고리 데이터 타입
export interface CategoryData {
  category:
    | 'FOOD'
    | 'ACTIVITY'
    | 'EDUCATION'
    | 'CULTURE'
    | 'BAKERY'
    | 'LIFE'
    | 'SHOPPING'
    | 'CAFE'
    | 'BEAUTY'
    | 'POPUP';
  categoryName: string;
  discountAmount: number;
}

// 계산된 카테고리 데이터
export interface CalculatedCategoryData extends CategoryData {
  discountPercentage: number;
}

// API에서 받아오는 데이터
export interface ApiMonthlyData {
  month: number;
  categoryData: CategoryData[];
}

// 계산된 통계 데이터
export interface CalculatedMonthSummary {
  usageAmount: number;
  discountAmount: number;
  usageGrowth: number;
  discountGrowth: number;
}

// 진행률 바 데이터
export interface ProgressBar {
  category: string;
  categoryName: string;
  percentage: number;
  displayPercentage: number;
  colorClass: string;
  roundedClass: string;
}
