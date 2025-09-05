import StatisticsChart from '@/components/my/StatisticsChart';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface MonthlyDiscountChartProps {
  chartData: Array<{
    month: string;
    value: number;
    highlight?: boolean;
  }>;
  averageAmount: string;
  currentMonthAmount: string;
  isLoading?: boolean;
  error?: string | null;
}

const MonthlyDiscountChart = ({
  chartData,
  averageAmount,
  currentMonthAmount,
  isLoading = false,
  error = null,
}: MonthlyDiscountChartProps) => {
  // 현재 월 할인액이 0원인지 확인
  const isZeroCurrentMonth = currentMonthAmount === '0원';

  return (
    <div className="bg-white mt-3">
      <div className="px-5 py-5">
        <h3 className="text-lm font-semibold text-black">월별 누적 할인액</h3>
        {isZeroCurrentMonth ? (
          <p className="text-m font-semibold text-gray-500 mb-6">아직 절약 내역이 없어요</p>
        ) : (
          <p className="text-m font-semibold text-gray-500 mb-6">
            이번달 누적 할인액 {currentMonthAmount}
          </p>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center mb-6 h-[160px]">
            <LoadingSpinner size="md" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="flex justify-center items-center mb-6 h-[160px]">
            <p className="text-sm text-gray-500">차트 데이터를 불러올 수 없습니다.</p>
          </div>
        )}

        {/* 차트 */}
        {!isLoading && !error && (
          <div className="mb-6">
            <StatisticsChart chartData={chartData} />
          </div>
        )}

        {/* 범례 */}
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              <span className="text-m font-semibold text-black mt-[3px]">현재 월</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-m font-semibold text-black mt-[3px]">이전 월</span>
            </div>
            <div className="flex items-center">
              <span className="text-m font-semibold text-black mt-[3px]">평균:{averageAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDiscountChart;
