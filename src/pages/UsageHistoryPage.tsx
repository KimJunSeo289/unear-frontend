import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import UsageHistoryStats from '@/components/my/usagehistory/UsageHistoryStats';
import UsageHistoryList from '@/components/my/usagehistory/UsageHistoryList';
import UsageHistoryFilter from '@/components/my/usagehistory/UsageHistoryFilter';
import useApiUsageHistory from '@/hooks/my/usagehistory/useApiUsageHistory';

const UsageHistoryPage = () => {
  const navigate = useNavigate();

  // API 기반 이용 내역 데이터 관리 (클라이언트 사이드 필터링 + 더보기)
  const {
    displayedData,
    stats,
    hasMoreItems,
    isLoading,
    isLoadingMore,
    error,
    handleFilterChange,
    handleLoadMore,
  } = useApiUsageHistory();

  const handleBack = () => navigate(-1);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <>
        <Header title="최근 이용 내역" onBack={handleBack} />
        <LoadingScreen message="이용 내역을 불러오는 중..." />
      </>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <>
        <Header title="최근 이용 내역" onBack={handleBack} />
        <div className="bg-gray-50 min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <p className="text-sm font-regular text-gray-600 text-center px-5">
              이용 내역을 불러오는 중 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="최근 이용 내역" onBack={handleBack} />

      <div className="bg-gray-50">
        {/* 통계 */}
        <UsageHistoryStats stats={stats} />

        {/* 필터 */}
        <UsageHistoryFilter onFilterChange={handleFilterChange} />

        {/* 이용 내역 리스트 */}
        <UsageHistoryList
          items={displayedData}
          hasMoreItems={hasMoreItems}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
        />
      </div>
    </>
  );
};

export default UsageHistoryPage;
