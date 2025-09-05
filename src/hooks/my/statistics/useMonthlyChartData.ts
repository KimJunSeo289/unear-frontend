import { useState, useEffect, useMemo } from 'react';
import {
  getMyStatisticsSummary,
  type MyStatisticsSummaryResponse,
} from '@/apis/getMyStatisticsSummary';
import type { ChartDataItem } from '@/types/myPage';

interface UseMonthlyChartDataReturn {
  chartData: ChartDataItem[];
  averageAmount: string;
  currentMonthAmount: string;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

/**
 * 월별 할인액 차트 데이터를 관리하는 훅
 */
const useMonthlyChartData = (
  _currentYear: number,
  _currentMonth: number
): UseMonthlyChartDataReturn => {
  const [summaryData, setSummaryData] = useState<MyStatisticsSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 월 문자열을 한국어 형태로 변환
   * @param monthStr "2025-07" 형태
   * @returns "7월" 형태
   */
  const formatMonthToKorean = (monthStr: string): string => {
    const [, month] = monthStr.split('-');
    return `${parseInt(month, 10)}월`;
  };

  /**
   * 금액을 한국어 형태로 포맷팅
   * @param amount 숫자
   * @returns "16,000원" 형태
   */
  const formatAmount = (amount: number): string => {
    return `${amount.toLocaleString()}원`;
  };

  /**
   * 평균 금액 계산
   */
  const calculateAverage = (discounts: number[]): number => {
    if (discounts.length === 0) return 0;
    const total = discounts.reduce((sum, amount) => sum + amount, 0);
    return Math.round(total / discounts.length);
  };

  /**
   * API 데이터를 차트 데이터로 변환
   */
  const chartData: ChartDataItem[] = useMemo(() => {
    if (!summaryData?.recentMonthDiscounts) return [];

    // 백엔드에서 최신 월부터 내림차순으로 데이터를 보내므로
    // 배열을 뒤집어서 최신 월이 맨 오른쪽에 오도록 함
    const reversedData = [...summaryData.recentMonthDiscounts].reverse();

    // 실제 현재 월 계산 (오늘 날짜 기준)
    const now = new Date();
    const actualCurrentYear = now.getFullYear();
    const actualCurrentMonth = now.getMonth() + 1; // 0부터 시작하므로 +1

    return reversedData.map((item) => {
      const [year, month] = item.month.split('-');
      const isActualCurrentMonth =
        parseInt(year, 10) === actualCurrentYear && parseInt(month, 10) === actualCurrentMonth;

      return {
        month: formatMonthToKorean(item.month),
        value: item.discount / 10000, // 만원 단위로 변환 (16000 -> 1.6)
        highlight: isActualCurrentMonth, // 실제 현재 월만 하이라이트
      };
    });
  }, [summaryData]); // currentYear, currentMonth 의존성 제거

  /**
   * 평균 할인액 계산
   */
  const averageAmount: string = useMemo(() => {
    if (!summaryData?.recentMonthDiscounts) return '0원';

    const discounts = summaryData.recentMonthDiscounts.map((item) => item.discount);
    const average = calculateAverage(discounts);
    return formatAmount(average);
  }, [summaryData]);

  /**
   * 현재 월 할인액
   */
  const currentMonthAmount: string = useMemo(() => {
    if (!summaryData) return '0원';
    return formatAmount(summaryData.thisMonthDiscount);
  }, [summaryData]);

  /**
   * 데이터 로드 함수
   */
  const loadData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getMyStatisticsSummary();
      if (data) {
        setSummaryData(data);
      } else {
        setError('월별 차트 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('월별 차트 데이터 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 데이터 새로고침 함수
   */
  const refreshData = async (): Promise<void> => {
    await loadData();
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []); // 빈 배열로 한 번만 실행

  return {
    chartData,
    averageAmount,
    currentMonthAmount,
    isLoading,
    error,
    refreshData,
  };
};

export default useMonthlyChartData;
