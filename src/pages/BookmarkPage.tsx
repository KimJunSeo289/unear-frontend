import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { BookmarkHeader, BookmarkList } from '@/components/my/bookmark';
import { useBookmarkData, useBookmarkHandlers, useInfiniteScroll } from '@/hooks/my/bookmark';

const BookmarkPage = () => {
  // 데이터 관리
  const {
    bookmarks,
    displayedBookmarks,
    isLoading,
    isLoadingMore,
    currentPage,
    setBookmarks,
    setDisplayedBookmarks,
    setIsLoadingMore,
    setCurrentPage,
  } = useBookmarkData();

  // 액션 핸들러
  const { handleBack, handleBookmarkToggle, loadMoreData } = useBookmarkHandlers({
    bookmarks,
    displayedBookmarks,
    currentPage,
    isLoadingMore,
    setBookmarks,
    setDisplayedBookmarks,
    setIsLoadingMore,
    setCurrentPage,
  });

  // 무한 스크롤
  const hasMoreItems = displayedBookmarks.length < bookmarks.length;
  useInfiniteScroll({ loadMoreData, hasMoreItems });

  if (isLoading) {
    return (
      <>
        <Header title="즐겨찾기" onBack={handleBack} />
        <div className="bg-background">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm font-regular text-gray-600">
              즐겨찾기 목록을 불러오는 중...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="즐겨찾기" onBack={handleBack} />

      <div className="bg-background">
        {displayedBookmarks.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-105px)]">
            <EmptyState message="즐겨찾기한 장소가 없습니다" />
          </div>
        ) : (
          <div className="px-5 pt-5 pb-20">
            {/* 헤더 - 즐겨찾기 개수 */}
            <BookmarkHeader totalCount={bookmarks.length} />

            {/* 북마크 리스트 */}
            <BookmarkList
              bookmarks={displayedBookmarks}
              onBookmarkToggle={handleBookmarkToggle}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkPage;
