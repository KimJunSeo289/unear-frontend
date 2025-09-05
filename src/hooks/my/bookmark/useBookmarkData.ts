import { useState, useEffect } from 'react';
import { getFavoritePlaces } from '@/apis/getFavoritePlaces';
import { convertFavoritePlacesToBookmarkStores } from '@/utils/bookmarkUtils';
import { getCurrentLocation, calculateDistance } from '@/utils/distanceUtils';
import type { BookmarkStore, FavoritePlace } from '@/types/bookmark';

interface UseBookmarkDataReturn {
  bookmarks: BookmarkStore[];
  displayedBookmarks: BookmarkStore[];
  isLoading: boolean;
  isLoadingMore: boolean;
  currentPage: number;
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkStore[]>>;
  setDisplayedBookmarks: React.Dispatch<React.SetStateAction<BookmarkStore[]>>;
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const useBookmarkData = (): UseBookmarkDataReturn => {
  const [bookmarks, setBookmarks] = useState<BookmarkStore[]>([]);
  const [displayedBookmarks, setDisplayedBookmarks] = useState<BookmarkStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /**
   * 현재 위치 기반으로 거리를 다시 계산하는 함수
   */
  const updateDistancesWithCurrentLocation = async (
    favoritePlaces: FavoritePlace[]
  ): Promise<FavoritePlace[]> => {
    try {
      const currentLocation = await getCurrentLocation();

      if (!currentLocation) {
        return favoritePlaces;
      }

      // 각 매장에 대해 현재 위치로부터의 거리를 다시 계산
      const updatedPlaces = favoritePlaces.map((place) => {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          place.latitude,
          place.longitude
        );

        return {
          ...place,
          distanceKm: distance,
        };
      });

      // 거리순으로 정렬
      return updatedPlaces.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } catch (error) {
      return favoritePlaces;
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        // 실제 API에서 즐겨찾기 데이터 가져오기
        const favoritePlaces = await getFavoritePlaces();

        // 현재 위치 기반으로 거리 재계산
        const updatedPlaces = await updateDistancesWithCurrentLocation(favoritePlaces);

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const convertedBookmarks = convertFavoritePlacesToBookmarkStores(updatedPlaces);

        setBookmarks(convertedBookmarks);
        setDisplayedBookmarks(convertedBookmarks.slice(0, itemsPerPage));
      } catch (error) {
        // 에러 발생 시 빈 배열로 설정
        setBookmarks([]);
        setDisplayedBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return {
    bookmarks,
    displayedBookmarks,
    isLoading,
    isLoadingMore,
    currentPage,
    setBookmarks,
    setDisplayedBookmarks,
    setIsLoadingMore,
    setCurrentPage,
  };
};

export default useBookmarkData;
