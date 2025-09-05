import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StoryLayout from '@/components/story/StoryLayout';
import BookmarkCard from '@/components/common/BookmarkCard';
import PointNubiImage from '@/assets/story/pointNubi.png';
import type { BookmarkStore } from '@/types/bookmark';
import type { CategoryType, StoreClassType } from '@/types/myPage';
import type { EventType } from '@/components/common/StoreTypeIcon';
import { getRecommendedPlacesWithDetail } from '@/apis/getStoryRecommend';
import { useAuthStore } from '@/store/auth';
import { getFavoritePlaces } from '@/apis/getFavoritePlaces'; // 즐겨찾기 목록 API
import { toggleFavorite } from '@/apis/postFavorite'; // 즐겨찾기 토글 API
import LoadingSpinner from '@/components/common/LoadingSpinner';

// BookmarkStore 타입 확장 (기존 타입에 맞게 필수/선택적 필드 맞춤)
interface ExtendedBookmarkStore extends BookmarkStore {
  tel?: string;
  benefitDesc?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coupons?: any[];
  favorite?: boolean;
  eventTypeCode?: string;
  franchiseId?: number;
}

const StoryRecommendPage = () => {
  const location = useLocation();
  const diagnosisLabel = location.state?.diagnosis?.label ?? '쩝쩝박사';

  const [stores, setStores] = useState<ExtendedBookmarkStore[]>([]);
  const user = useAuthStore((state) => state.userInfo);
  const [loading, setLoading] = useState(false);

  // 즐겨찾기 토글 핸들러 (API 호출 + 상태 반영)
  const handleBookmarkToggle = async (storeId: string) => {
    try {
      // API 호출 (placeId는 number여야 하므로 변환)
      const placeIdNum = Number(storeId);
      await toggleFavorite(placeIdNum);

      // 상태 변경 (토글)
      setStores((prev: ExtendedBookmarkStore[]) =>
        prev.map((store) =>
          store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
        )
      );
    } catch (error) {}
  };

  useEffect(() => {
    const fetchStores = async () => {
      if (!user) return;
      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // 1) 추천 매장 조회
            const recommendedData = await getRecommendedPlacesWithDetail({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                tel: user.tel ?? '',
                birthdate: user.birthdate ?? '',
                gender: user.gender ?? '',
                membershipCode: user.membershipCode,
                provider: user.provider ?? '',
                providerId: user.providerId ?? '',
              },
            });

            // 2) 즐겨찾기 목록 조회
            const favoriteData = await getFavoritePlaces();

            // 3) 즐겨찾기 placeId 집합 생성 (검색용)
            const favoritePlaceIds = new Set(favoriteData.map((fav) => fav.placeId));

            // 4) 추천 매장 데이터 변환 + 즐겨찾기 여부 체크
            const storeList: ExtendedBookmarkStore[] = recommendedData.map((item) => ({
              id: String(item.placeId),
              placeId: item.placeId,
              name: item.name || item.placeName || '',
              address: item.address || '',
              distance: item.distanceKm
                ? `${item.distanceKm.toFixed(1)}km`
                : item.distanceInMeters
                  ? `${(item.distanceInMeters / 1000).toFixed(1)}km`
                  : '',
              hours:
                item.startTime !== undefined && item.endTime !== undefined
                  ? `${item.startTime}:00 ~ ${item.endTime}:00`
                  : '',
              category: (item.categoryCode as CategoryType) || 'CAFE',
              storeClass: (item.markerCode === 'FRANCHISE'
                ? 'FRANCHISE'
                : 'LOCAL') as StoreClassType,
              event: (item.eventTypeCode as EventType) || 'NONE',
              isBookmarked: favoritePlaceIds.has(item.placeId), // 즐겨찾기 여부 반영
              latitude: item.latitude,
              longitude: item.longitude,
              phoneNumber: item.tel,
              benefitDesc: item.benefitDesc,
              coupons: item.coupons,
              favorite: favoritePlaceIds.has(item.placeId), // 백엔드 favorite 필드는 신뢰하지 않고 교차 비교
              eventTypeCode: item.eventTypeCode,
              franchiseId: item.franchiseId,
            }));

            setStores(storeList);
          } catch (err) {
          } finally {
            setLoading(false);
          }
        },
        (_error) => {
          setLoading(false);
        }
      );
    };

    fetchStores();
  }, [user]);

  return (
    <StoryLayout headerTitle="추천 매장" bgColorClass="bg-storybackground1">
      {/* 컨텐츠 */}
      <div className="flex flex-col w-full h-full overflow-y-auto">
        {/* 상단 진단 결과 영역 */}
        <div className="sticky top-0 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <p className="text-white text-lm font-bold mb-1">[{diagnosisLabel}]</p>
              <p className="text-white text-m font-semibold mb-2">
                {user?.username ?? '사용자'}님이 좋아할 만한 제휴처
              </p>
              <p className="text-gray-300 text-sm font-regular">
                🔥내 주변 추천 매장을 확인해보세요🔥
              </p>
            </div>
            <div>
              <img src={PointNubiImage} alt="포인트 누비" />
            </div>
          </div>
        </div>

        {/* 추천 매장 리스트 */}
        <div className="space-y-4 w-full pt-4 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            stores.map((store) => (
              <BookmarkCard
                key={store.id}
                store={store}
                onBookmarkToggle={handleBookmarkToggle}
                isDarkMode={true}
              />
            ))
          )}
        </div>
      </div>
    </StoryLayout>
  );
};

export default StoryRecommendPage;
