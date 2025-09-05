import type { UsageHistoryItem as UsageHistoryItemType } from '@/types/usageHistory';
import UsageHistoryItem from './UsageHistoryItem';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface UsageHistoryListProps {
  items: UsageHistoryItemType[];
  hasMoreItems: boolean;
  onLoadMore: () => Promise<void>;
  isLoadingMore?: boolean;
  emptyMessage?: string;
}

const UsageHistoryList = ({
  items,
  hasMoreItems,
  onLoadMore,
  isLoadingMore = false,
  emptyMessage = '해당 조건에 맞는 이용 내역이 없습니다.',
}: UsageHistoryListProps) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-black bg-white">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white space-y-2 px-5 pt-3 pb-3">
      {items.map((item) => (
        <UsageHistoryItem
          key={item.id}
          storeName={item.storeName}
          usedDate={item.usedDate}
          originalPrice={item.originalPrice}
          discountPrice={item.discountPrice}
          category={item.category}
          storeClass={item.storeClass}
        />
      ))}

      {hasMoreItems && (
        <div className="pt-1">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="w-full pt-2.5 pb-2 text-sm text-center text-black font-semibold bg-white border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>로딩 중...</span>
              </div>
            ) : (
              '더보기'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UsageHistoryList;
