import { useRef, useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  StatisticsHeader,
  CategoryDiscountList,
  UsageDiscountSummary,
  MonthlyDiscountChart,
} from '@/components/my/statistics';
import type { StatisticsHeaderRef } from '@/components/my/statistics/StatisticsHeader';
import useStatisticsDetail from '@/hooks/my/statistics/useStatisticsDetail';
import useMonthlyChartData from '@/hooks/my/statistics/useMonthlyChartData';
import { useNavigate } from 'react-router-dom';
import {
  useStatisticsCalculations,
  useProgressBars,
  useCategoryHighlight,
} from '@/hooks/my/statistics';
import type { CategoryData } from '@/hooks/my/statistics/types';

const StatisticsDetailPage = () => {
  const statisticsHeaderRef = useRef<StatisticsHeaderRef>(null);
  const navigate = useNavigate();

  // API 데이터 관리
  const {
    statisticsDetail,
    isLoading,
    error,
    currentYear,
    currentMonth,
    moveToPrevMonth,
    moveToNextMonth,
    canMoveToPrev,
    canMoveToNext,
  } = useStatisticsDetail();

  // 월별 차트 데이터 관리
  const {
    chartData,
    averageAmount,
    currentMonthAmount,
    isLoading: chartLoading,
    error: chartError,
  } = useMonthlyChartData(currentYear, currentMonth);

  // 더보기 상태 관리
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 계산 로직
  const { calculateCategoryPercentages } = useStatisticsCalculations();

  // 진행률 바 관련
  const { generateProgressBars } = useProgressBars();

  // 카테고리 하이라이트 관련
  const { highlightedCategory, highlightCategory, clearHighlight, shouldBeTransparent } =
    useCategoryHighlight();

  // 전체 페이지 클릭 시 하이라이트 해제
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 진행률 바, 카테고리 카드, 툴팁, 더보기 버튼, 네비게이션 버튼을 클릭한 경우가 아니라면 하이라이트 해제
      const isProgressBar = target.closest('[data-progress-bar]');
      const isCategoryCard = target.closest('[data-category-card]');
      const isTooltip = target.closest('[data-tooltip]');
      const isToggleButton = target.closest('[data-toggle-button]');
      const isNavButton = target.closest('[data-nav-button]');

      if (!isProgressBar && !isCategoryCard && !isTooltip && !isToggleButton && !isNavButton) {
        clearHighlight();
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [clearHighlight]);

  // 카테고리 이름 매핑 함수
  const getCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      SHOPPING: '쇼핑',
      ACTIVITY: '액티비티',
      LIFE: '라이프',
      FOOD: '외식',
      CULTURE: '문화',
      BEAUTY: '뷰티',
      CAFE: '카페',
      EDUCATION: '교육',
      BAKERY: '베이커리',
      POPUP: '팝업',
    };
    return categoryNames[category] || category;
  };

  // API 데이터에서 카테고리 데이터 변환
  const categoryApiData = statisticsDetail
    ? {
        categoryData: Object.entries(statisticsDetail.discountByCategory).map(
          ([category, amount]) => ({
            category: category as CategoryData['category'],
            categoryName: getCategoryName(category),
            discountAmount: amount,
          })
        ),
      }
    : { categoryData: [] };

  // 계산된 데이터들
  const totalDiscountAmount = statisticsDetail?.totalDiscount || 0;
  const calculatedCategoryData = calculateCategoryPercentages(categoryApiData.categoryData);
  const progressBars = generateProgressBars(calculatedCategoryData, totalDiscountAmount);

  // 이벤트 핸들러
  const handlePrevMonth = async () => {
    await moveToPrevMonth();
    clearHighlight();
  };

  const handleNextMonth = async () => {
    await moveToNextMonth();
    clearHighlight();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <>
        <Header title="개인별 통계" onBack={handleBack} />
        <div className="bg-background min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm font-regular text-gray-600">통계 데이터를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <>
        <Header title="개인별 통계" onBack={handleBack} />
        <div className="bg-background min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <p className="text-sm font-regular text-gray-600 text-center px-5">
              통계 데이터를 불러오는 중 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </>
    );
  }

  // 포맷팅 함수
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('ko-KR')}원`;
  };

  const formatGrowth = (growth: number): string => {
    return `전월 대비 ${growth > 0 ? '+' : ''}${growth}%`;
  };

  // 바 클릭 핸들러 (바에서 직접 클릭)
  const handleBarClick = (
    category: string,
    position: { x: number; y: number },
    percentage: number,
    categoryName: string
  ) => {
    if (highlightedCategory.category === category) {
      clearHighlight();
    } else {
      highlightCategory(category, position, percentage, categoryName);
    }
  };

  // 카드 클릭 핸들러 (카드에서 클릭했지만 바 위치에 툴팁 표시)
  const handleCardClick = (category: string, percentage: number, categoryName: string) => {
    if (highlightedCategory.category === category) {
      clearHighlight();
      return;
    }

    // 바의 위치를 가져와서 툴팁 표시
    const barPosition = statisticsHeaderRef.current?.getBarPosition(category);
    if (barPosition) {
      highlightCategory(category, barPosition, percentage, categoryName);
    }
  };

  // 계산된 요약 데이터 (UsageDiscountSummary용) - API 데이터 사용
  const calculatedSummary = {
    usageAmount: statisticsDetail?.totalSpent || 0,
    discountAmount: totalDiscountAmount,
    usageGrowth: statisticsDetail?.spentChangeRatio || 0,
    discountGrowth: statisticsDetail?.discountChangeRatio || 0,
  };

  return (
    <>
      <Header title="개인별 통계" onBack={handleBack} />

      <div className="bg-background mb-3 relative">
        {/* 헤더 및 진행률 바 섹션 */}
        <StatisticsHeader
          ref={statisticsHeaderRef}
          currentYear={currentYear}
          currentMonth={currentMonth}
          totalDiscountAmount={totalDiscountAmount}
          progressBars={progressBars}
          highlightedCategory={highlightedCategory}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          canMoveToPrev={canMoveToPrev()}
          canMoveToNext={canMoveToNext()}
          onBarClick={handleBarClick}
          onTooltipClose={clearHighlight}
          formatCurrency={formatCurrency}
        />

        {/* 카테고리별 할인 리스트 */}
        <CategoryDiscountList
          calculatedCategoryData={calculatedCategoryData}
          currentMonth={currentMonth}
          showAllCategories={showAllCategories}
          onToggleCategories={handleToggleCategories}
          onCardClick={handleCardClick}
          shouldBeTransparent={shouldBeTransparent}
        />

        {/* 사용금액/할인금액 요약 */}
        <UsageDiscountSummary
          calculatedSummary={calculatedSummary}
          totalDiscountAmount={totalDiscountAmount}
          formatCurrency={formatCurrency}
          formatGrowth={formatGrowth}
        />

        {/* 월별 누적 할인액 차트 */}
        <MonthlyDiscountChart
          chartData={chartData}
          averageAmount={averageAmount}
          currentMonthAmount={currentMonthAmount}
          isLoading={chartLoading}
          error={chartError}
        />
      </div>
    </>
  );
};

export default StatisticsDetailPage;
