import BookmarkCard from '@/components/common/BookmarkCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { BookmarkStore } from '@/types/bookmark';

interface BookmarkListProps {
  bookmarks: BookmarkStore[];
  onBookmarkToggle: (storeId: string) => void;
  isLoadingMore: boolean;
}

const BookmarkList = ({ bookmarks, onBookmarkToggle, isLoadingMore }: BookmarkListProps) => {
  return (
    <>
      <div className="space-y-[12px]">
        {bookmarks.map((store) => (
          <BookmarkCard key={store.id} store={store} onBookmarkToggle={onBookmarkToggle} />
        ))}
      </div>

      {/* 무한스크롤 로딩 - 작은 핑크색 스피너 */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-4 mt-4">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-xs text-gray-500">더 불러오는 중...</span>
        </div>
      )}
    </>
  );
};

export default BookmarkList;
