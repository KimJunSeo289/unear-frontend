import useStatisticsChart from '@/hooks/my/useStatisticsChart';
import type { ChartDataItem } from '@/types/myPage';

interface StatisticsChartProps {
  chartData: ChartDataItem[];
  className?: string;
}

const StatisticsChart = ({ chartData, className = '' }: StatisticsChartProps) => {
  const { calculateBarHeight } = useStatisticsChart({ chartData });

  // 데이터가 없을 때 처리
  if (!chartData || chartData.length === 0) {
    return (
      <div className={`flex justify-center items-center h-[160px] ${className}`}>
        <p className="text-sm text-gray-500">통계 데이터가 없습니다.</p>
      </div>
    );
  }

  const renderChartBar = (item: ChartDataItem, index: number) => {
    const { month, value, highlight } = item;
    const barHeight = Math.max(calculateBarHeight(value), 4);

    // 값 표시 포맷팅: 소수점 있으면 표시, 없으면 정수로 표시
    const formattedValue = value % 1 === 0 ? value.toString() : value.toFixed(1);

    return (
      <div key={index} className="flex flex-col items-center gap-1 w-[50px]">
        {/* 값 표시 */}
        <span className={`text-m font-semibold ${highlight ? 'text-primary' : 'text-black'}`}>
          {formattedValue}
        </span>

        {/* 바 차트 */}
        <div
          className="rounded-t-lg w-8"
          style={{
            height: `${barHeight}px`,
            backgroundColor: highlight ? '#E6007E' : '#6B7280', // primary, gray-500 색상을 직접 지정
          }}
        />

        {/* 월 표시 */}
        <span className="text-m font-semibold text-black">{month}</span>
      </div>
    );
  };

  return (
    <div className={`flex justify-between items-end h-[160px] ${className}`}>
      {chartData.map(renderChartBar)}
    </div>
  );
};

export default StatisticsChart;
