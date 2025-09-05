import BackIcon from '@/assets/common/backIcon.svg?react';
import StatisticsChart from './StatisticsChart';
import type { StatisticsData } from '@/types/myPage';

interface StatisticsSectionProps extends StatisticsData {
  onDetailClick?: () => void;
}

const StatisticsSection = ({
  accumulatedSavings,
  chartData,
  onDetailClick,
}: StatisticsSectionProps) => {
  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick();
    } else {
    }
  };

  // 누적 할인액이 0원인지 확인
  const isZeroAccumulated = accumulatedSavings === '0원';

  return (
    <div className="w-full bg-white mt-3 h-[284px]">
      <div className="px-5 py-5">
        {/* 헤더 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-lm font-semibold text-black">개인별 통계</span>
            <button type="button" className="flex items-center" onClick={handleDetailClick}>
              <span className="text-m font-semibold text-black">자세히 보기</span>
              <BackIcon className="w-5 h-5 mb-0.5 text-black transform rotate-180" />
            </button>
          </div>
          {isZeroAccumulated ? (
            <p className="text-m font-semibold text-gray-500">아직 절약 내역이 없어요</p>
          ) : (
            <p className="text-m font-semibold text-gray-500">
              이번달 누적 할인액 {accumulatedSavings}
            </p>
          )}
        </div>

        {/* 바 차트 */}
        <StatisticsChart chartData={chartData} className="mt-7" />
      </div>
    </div>
  );
};

export default StatisticsSection;
