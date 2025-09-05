import { useEffect } from 'react';

interface UseInfiniteScrollProps {
  loadMoreData: () => void;
  hasMoreItems: boolean;
}

const useInfiniteScroll = ({ loadMoreData, hasMoreItems }: UseInfiniteScrollProps) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMoreItems) return;

      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreData, hasMoreItems]);
};

export default useInfiniteScroll;
