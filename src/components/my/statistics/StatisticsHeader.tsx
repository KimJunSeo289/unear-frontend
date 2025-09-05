import { useRef, useImperativeHandle, forwardRef } from 'react';
import GrowUpIcon from '@/assets/my/growup.svg?react';
import BackIcon from '@/assets/common/backIcon.svg?react';
import type { ProgressBar } from '@/hooks/my/statistics';
import type { CategoryHighlight } from '@/hooks/my/statistics/useCategoryHighlight';

// 진행률 바 애니메이션
import './animations.css';

interface StatisticsHeaderProps {
  currentYear: number;
  currentMonth: number;
  totalDiscountAmount: number;
  progressBars: ProgressBar[];
  highlightedCategory: CategoryHighlight;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canMoveToPrev: boolean;
  canMoveToNext: boolean;
  onBarClick: (
    category: string,
    position: { x: number; y: number },
    percentage: number,
    categoryName: string
  ) => void;
  onTooltipClose?: () => void;
  formatCurrency: (amount: number) => string;
}

export interface StatisticsHeaderRef {
  getBarPosition: (category: string) => { x: number; y: number } | null;
}

const StatisticsHeader = forwardRef<StatisticsHeaderRef, StatisticsHeaderProps>(
  (
    {
      currentYear,
      currentMonth,
      totalDiscountAmount,
      progressBars,
      highlightedCategory,
      onPrevMonth,
      onNextMonth,
      canMoveToPrev,
      canMoveToNext,
      onBarClick,
      onTooltipClose,
      formatCurrency,
    },
    ref
  ) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 월 변경 시 툴팁 닫기는 수동으로만 처리
    // useEffect에서 자동 닫기 제거

    // 외부에서 바 위치를 가져올 수 있도록 노출
    useImperativeHandle(ref, () => ({
      getBarPosition: (category: string) => {
        if (!progressBarRef.current) return null;

        const rect = progressBarRef.current.getBoundingClientRect();
        const targetBar = progressBars.find((bar) => bar.category === category);

        if (!targetBar) return null;

        // 해당 카테고리의 바 중앙 위치 계산
        let accumulatedWidth = 0;
        for (const bar of progressBars) {
          if (bar.category === category) {
            const barCenterX =
              rect.left + accumulatedWidth + ((bar.percentage / 100) * rect.width) / 2;
            return {
              x: barCenterX,
              y: rect.bottom,
            };
          }
          accumulatedWidth += (bar.percentage / 100) * rect.width;
        }

        return null;
      },
    }));

    const handleBarClick = (event: React.MouseEvent, bar: ProgressBar) => {
      event.stopPropagation(); // 이벤트 전파 방지

      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = event.clientX;
      const clickY = rect.bottom;

      onBarClick(bar.category, { x: clickX, y: clickY }, bar.displayPercentage, bar.categoryName);
    };

    // 날짜 표시 포맷팅 함수
    const formatDateDisplay = (year: number, month: number): string => {
      const currentYear = new Date().getFullYear();

      // 현재 년도면 월만 표시, 다른 년도면 년도도 표시
      if (year === currentYear) {
        return `${month}월`;
      } else {
        return `${year}년 ${month}월`;
      }
    };

    const handlePrevMonth = () => {
      onPrevMonth();
      if (onTooltipClose) {
        onTooltipClose();
      }
    };

    const handleNextMonth = () => {
      onNextMonth();
      if (onTooltipClose) {
        onTooltipClose();
      }
    };

    // 바 기준으로 툴팁 위치 계산
    const getTooltipStyle = () => {
      if (!highlightedCategory.category || !progressBarRef.current) return { display: 'none' };

      const targetBar = progressBars.find((bar) => bar.category === highlightedCategory.category);
      if (!targetBar) return { display: 'none' };

      // 바 내에서의 상대적 위치 계산
      let accumulatedPercentage = 0;
      for (const bar of progressBars) {
        if (bar.category === highlightedCategory.category) {
          const centerPercentage = accumulatedPercentage + bar.percentage / 2;
          return {
            position: 'absolute' as const,
            left: `${centerPercentage}%`,
            top: '100%',
            transform: 'translateX(-50%)',
            marginTop: '-4px',
          };
        }
        accumulatedPercentage += bar.percentage;
      }

      return { display: 'none' };
    };

    // 할인 금액이 0원인지 확인
    const isZeroDiscount = totalDiscountAmount === 0;

    return (
      <div className="bg-white" ref={containerRef}>
        <div className="px-5 pt-4 pb-1">
          {isZeroDiscount ? (
            // 0원일 때: 아이콘과 "멤버십 혜택으로" 텍스트 숨김
            <div className="text-center mb-6">
              <p className="text-lm font-semibold text-gray-600">아직 절약 내역이 없어요</p>
            </div>
          ) : (
            // 0원이 아닐 때: 기존 스타일 유지
            <>
              {/* 멤버십 혜택으로 타이틀 */}
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-2">
                  <GrowUpIcon className="w-6 h-6" />
                  <span className="text-m font-regular text-gray-500">멤버십 혜택으로</span>
                </div>
              </div>

              {/* 메인 타이틀 */}
              <div className="text-center mb-2">
                <p className="text-lm font-semibold text-black">
                  이번달{' '}
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(totalDiscountAmount)}
                  </span>
                  을 절약했어요!
                </p>
              </div>
            </>
          )}

          {/* 월 네비게이션 */}
          <div className="flex items-center justify-center mb-4">
            <button onClick={handlePrevMonth} disabled={!canMoveToPrev} data-nav-button>
              <BackIcon className={`w-5 h-5 ${!canMoveToPrev ? 'text-gray-300' : 'text-black'}`} />
            </button>
            <span className="mx-2 pt-1 text-lm font-semibold text-black">
              {formatDateDisplay(currentYear, currentMonth)}
            </span>
            <button onClick={handleNextMonth} disabled={!canMoveToNext} data-nav-button>
              <BackIcon
                className={`w-5 h-5 transform rotate-180 ${!canMoveToNext ? 'text-gray-300' : 'text-black'}`}
              />
            </button>
          </div>

          {/* 클릭 가능한 진행률 바 + 툴팁 */}
          <div className="mb-2 relative">
            {progressBars.length > 0 ? (
              <div
                ref={progressBarRef}
                className="flex rounded-full overflow-hidden h-[15px] bg-gray-200 relative"
              >
                {progressBars.map((bar, index) => (
                  <button
                    key={`${currentMonth}-${index}`}
                    className={`${bar.colorClass} ${bar.roundedClass} animate-fillBar cursor-pointer hover:brightness-110 transition-all duration-200`}
                    style={
                      {
                        '--target-width': `${bar.percentage}%`,
                        animationDelay: `${index * 50}ms`,
                        width: '0%',
                      } as React.CSSProperties
                    }
                    onClick={(e) => handleBarClick(e, bar)}
                    title={`${bar.categoryName}: ${bar.percentage.toFixed(1)}%`}
                    data-progress-bar
                  />
                ))}
              </div>
            ) : (
              <div className="flex rounded-full overflow-hidden h-[15px] bg-gray-200" />
            )}

            {/* 바 아래 고정 툴팁 */}
            {highlightedCategory.category && (
              <div
                className="z-50 bg-white rounded-lg px-3 py-1 shadow-lg pointer-events-none"
                style={getTooltipStyle()}
                data-tooltip
              >
                <p className="text-m font-regular text-black whitespace-nowrap">
                  {highlightedCategory.percentage}%
                </p>
                {/* 말풍선 꼬리 (위쪽을 향함) */}
                <div
                  className="absolute left-1/2 bottom-full transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '6px solid white',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatisticsHeader.displayName = 'StatisticsHeader';

export default StatisticsHeader;
