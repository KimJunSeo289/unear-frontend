import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import type { UserProfile, MembershipBenefit, StatisticsData } from '@/types/myPage';
import type { UsageHistoryItem } from '@/types/usageHistory';
import useCouponCount from './useCouponCount';
import useStatisticsSummary from './useStatisticsSummary';
import useRecentUsageHistory from './useRecentUsageHistory';

interface UseMyPageDataReturn {
  userProfile: UserProfile;
  membershipBenefit: MembershipBenefit;
  statisticsData: StatisticsData;
  recentUsageHistory: UsageHistoryItem[];
  isLoading: boolean; // 전체 로딩 상태 (모든 API 로딩을 통합한 상태)
  refreshData: () => Promise<void>;
  userProvider: string | null;
  error: string | null; // 통합 에러 상태
}

const useMyPageData = (): UseMyPageDataReturn => {
  const [manualRefreshLoading, setManualRefreshLoading] = useState(false); // 수동 새로고침 로딩
  const couponCount = useCouponCount();

  // 통계 데이터 훅 사용
  const {
    statisticsData,
    isLoading: statisticsLoading,
    error: statisticsError,
    refreshData: refreshStatistics,
  } = useStatisticsSummary();

  // 이용 내역 데이터 훅 사용
  const {
    recentUsageHistory,
    isLoading: usageHistoryLoading,
    error: usageHistoryError,
    refreshData: refreshUsageHistory,
  } = useRecentUsageHistory();

  // 전체 로딩 상태: 모든 API가 로딩 중이면 true
  const isLoading = statisticsLoading || usageHistoryLoading || manualRefreshLoading;

  // 통합 에러 상태: 어떤 API라도 에러가 있으면 에러 메시지 표시
  const error = statisticsError || usageHistoryError;

  // Zustand store에서 사용자 정보 가져오기
  const { getUserDisplayName, getUserGrade, getUserProvider } = useAuthStore();

  // 사용자 프로필 데이터 - Zustand store 사용
  const userProfile: UserProfile = useMemo(() => {
    const userGrade = getUserGrade();
    const mappedGrade = userGrade === 'BASIC' ? '우수' : (userGrade as 'VIP' | 'VVIP');

    return {
      name: getUserDisplayName(),
      grade: mappedGrade,
      greeting: '오늘도 알뜰한 하루 되세요! ✨',
    };
  }, [getUserDisplayName, getUserGrade]);

  // 멤버십 혜택 데이터 - 실제 API 데이터 사용
  const membershipBenefit: MembershipBenefit = useMemo(
    () => ({
      currentMonthSavings: statisticsData.accumulatedSavings, // API에서 가져온 이번달 할인액
      couponCount,
    }),
    [statisticsData.accumulatedSavings, couponCount]
  );

  // 통계 차트 데이터 - API에서 가져온 데이터 사용
  // (useStatisticsSummary 훅에서 이미 처리됨)

  // 통계 데이터 - API에서 가져온 실제 데이터 사용
  // (useStatisticsSummary 훅에서 이미 처리됨)

  // 최근 이용 내역 데이터 - API에서 가져온 실제 데이터 사용
  // (useRecentUsageHistory 훅에서 이미 처리됨)

  // 데이터 수동 새로고침 함수
  const refreshData = async (): Promise<void> => {
    setManualRefreshLoading(true);
    try {
      // 모든 데이터를 동시에 새로고침
      await Promise.all([
        refreshStatistics(),
        refreshUsageHistory(),
        // TODO: 다른 API 호출 (쿠폰 카운트 등)
      ]);
    } catch (error) {
    } finally {
      setManualRefreshLoading(false);
    }
  };

  return {
    userProfile,
    membershipBenefit,
    statisticsData,
    recentUsageHistory,
    isLoading,
    refreshData,
    userProvider: getUserProvider(),
    error,
  };
};

export default useMyPageData;
