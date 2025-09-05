import { useState, useEffect } from 'react';
import {
  getMyStatisticsDetail,
  type MyStatisticsDetailResponse,
} from '@/apis/getMyStatisticsDetail';

interface UseStatisticsDetailReturn {
  statisticsDetail: MyStatisticsDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  refreshData: () => Promise<void>;
  changeMonth: (year: number, month: number) => Promise<void>;
  moveToPrevMonth: () => Promise<void>;
  moveToNextMonth: () => Promise<void>;
  canMoveToPrev: () => boolean;
  canMoveToNext: () => boolean;
}

/**
 * 개인별 통계 상세 데이터를 관리하는 훅
 */
const useStatisticsDetail = (): UseStatisticsDetailReturn => {
  const [statisticsDetail, setStatisticsDetail] = useState<MyStatisticsDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 날짜를 정확히 계산
  const getCurrentDate = () => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // 0부터 시작하므로 +1
    };
  };

  const currentDate = getCurrentDate();
  const [currentYear, setCurrentYear] = useState(currentDate.year);
  const [currentMonth, setCurrentMonth] = useState(currentDate.month);

  // 최소 날짜 계산 (5년 전 1월)
  const minDate = {
    year: currentDate.year - 5,
    month: 1,
  };

  // 최대 날짜 계산 (현재 월)
  const maxDate = {
    year: currentDate.year,
    month: currentDate.month,
  };

  /**
   * 날짜 비교 함수
   * @param year1 비교 년도 1
   * @param month1 비교 월 1
   * @param year2 비교 년도 2
   * @param month2 비교 월 2
   * @returns -1: 첫번째가 이전, 0: 같음, 1: 첫번째가 이후
   */
  const compareDate = (year1: number, month1: number, year2: number, month2: number): number => {
    if (year1 < year2) return -1;
    if (year1 > year2) return 1;
    if (month1 < month2) return -1;
    if (month1 > month2) return 1;
    return 0;
  };

  /**
   * 날짜가 유효한 범위 내에 있는지 확인
   */
  const isValidDateRange = (year: number, month: number): boolean => {
    const compareMin = compareDate(year, month, minDate.year, minDate.month);
    const compareMax = compareDate(year, month, maxDate.year, maxDate.month);
    return compareMin >= 0 && compareMax <= 0;
  };

  /**
   * 데이터 로드 함수
   */
  const loadData = async (year: number, month: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getMyStatisticsDetail(year, month);
      if (data) {
        setStatisticsDetail(data);
      } else {
        setError('통계 상세 데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('통계 상세 데이터 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 데이터 새로고침 함수 (현재 년/월 기준)
   */
  const refreshData = async (): Promise<void> => {
    await loadData(currentYear, currentMonth);
  };

  /**
   * 월 변경 함수 (년도 경계 처리 포함)
   */
  const changeMonth = async (year: number, month: number): Promise<void> => {
    // 유효한 범위 내에서만 변경 허용
    if (!isValidDateRange(year, month)) {
      return;
    }

    setCurrentYear(year);
    setCurrentMonth(month);
    await loadData(year, month);
  };

  /**
   * 이전 월로 이동 (년도 경계 처리)
   */
  const moveToPrevMonth = async (): Promise<void> => {
    let newYear = currentYear;
    let newMonth = currentMonth - 1;

    // 월이 0이 되면 이전 년도의 12월로
    if (newMonth < 1) {
      newYear = currentYear - 1;
      newMonth = 12;
    }

    await changeMonth(newYear, newMonth);
  };

  /**
   * 다음 월로 이동 (년도 경계 처리)
   */
  const moveToNextMonth = async (): Promise<void> => {
    let newYear = currentYear;
    let newMonth = currentMonth + 1;

    // 월이 13이 되면 다음 년도의 1월로
    if (newMonth > 12) {
      newYear = currentYear + 1;
      newMonth = 1;
    }

    await changeMonth(newYear, newMonth);
  };

  /**
   * 이전 월 이동 가능 여부 확인
   */
  const canMoveToPrev = (): boolean => {
    let newYear = currentYear;
    let newMonth = currentMonth - 1;

    if (newMonth < 1) {
      newYear = currentYear - 1;
      newMonth = 12;
    }

    return isValidDateRange(newYear, newMonth);
  };

  /**
   * 다음 월 이동 가능 여부 확인
   */
  const canMoveToNext = (): boolean => {
    let newYear = currentYear;
    let newMonth = currentMonth + 1;

    if (newMonth > 12) {
      newYear = currentYear + 1;
      newMonth = 1;
    }

    return isValidDateRange(newYear, newMonth);
  };

  // 컴포넌트 마운트 시 현재 월 데이터 로드
  useEffect(() => {
    loadData(currentYear, currentMonth);
  }, []); // 빈 배열로 한 번만 실행

  return {
    statisticsDetail,
    isLoading,
    error,
    currentYear,
    currentMonth,
    refreshData,
    changeMonth,
    moveToPrevMonth,
    moveToNextMonth,
    canMoveToPrev,
    canMoveToNext,
  };
};

export default useStatisticsDetail;
