import { useState, useEffect, useMemo } from 'react';
import {
  getMyStatisticsSummary,
  type MyStatisticsSummaryResponse,
} from '@/apis/getMyStatisticsSummary';
import type { StatisticsData, ChartDataItem } from '@/types/myPage';

interface UseStatisticsSummaryReturn {
  statisticsData: StatisticsData;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

/**
 * 마이페이지 통계 요약 데이터를 관리하는 훅
 */
const useStatisticsSummary = (): UseStatisticsSummaryReturn => {
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
   * 금액을 한국어 형태로 포맷팅 (천원 단위 콤마 표시)
   * @param amount 숫자
   * @returns "16,000원" 형태
   */
  const formatAmount = (amount: number): string => {
    return `${amount.toLocaleString()}원`;
  };

  /**
   * API 데이터를 차트 데이터로 변환
   */
  const chartData: ChartDataItem[] = useMemo(() => {
    if (!summaryData?.recentMonthDiscounts) return [];

    // 백엔드에서 최신 월부터 내림차순으로 데이터를 보내므로
    // 배열을 뒤집어서 최신 월이 맨 오른쪽에 오도록 함
    const reversedData = [...summaryData.recentMonthDiscounts].reverse();

    return reversedData.map((item, index) => ({
      month: formatMonthToKorean(item.month),
      value: item.discount / 10000, // 만원 단위로 변환 (16000 -> 1.6)
      highlight: index === reversedData.length - 1, // 마지막(최신) 월을 하이라이트
    }));
  }, [summaryData]);

  /**
   * 통계 데이터 조합
   */
  const statisticsData: StatisticsData = useMemo(
    () => ({
      accumulatedSavings: summaryData ? formatAmount(summaryData.thisMonthDiscount) : '0원',
      chartData,
    }),
    [summaryData, chartData]
  );

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
        setError('통계 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('통계 데이터 로드 중 오류가 발생했습니다.');
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
  }, []);

  return {
    statisticsData,
    isLoading,
    error,
    refreshData,
  };
};

export default useStatisticsSummary;
