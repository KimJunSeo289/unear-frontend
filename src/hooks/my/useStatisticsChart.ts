import { useMemo } from 'react';
import type { ChartDataItem } from '@/types/myPage';

interface UseStatisticsChartProps {
  chartData: ChartDataItem[];
}

interface UseStatisticsChartReturn {
  chartData: ChartDataItem[];
  maxValue: number;
  chartHeight: number;
  calculateBarHeight: (value: number) => number;
}

const useStatisticsChart = ({ chartData }: UseStatisticsChartProps): UseStatisticsChartReturn => {
  // 차트 설정값
  const chartHeight = 120; // 차트 영역 최대 높이

  // 최댓값 계산
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.value));
  }, [chartData]);

  // 바 높이 계산 함수
  const calculateBarHeight = useMemo(() => {
    return (value: number): number => {
      return maxValue > 0 ? (value / maxValue) * chartHeight : 4;
    };
  }, [maxValue, chartHeight]);

  return {
    chartData,
    maxValue,
    chartHeight,
    calculateBarHeight,
  };
};

export default useStatisticsChart;
