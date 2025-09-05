import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BookmarkCard from '@/components/junior/BookmarkCard';
import type { StoreInfo, CouponInfo } from '@/components/junior/BookmarkCard';
import { getPlaces } from '@/apis/getPlaces';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import { postDownloadCoupon } from '@/apis/postDownloadCoupon';
import { toggleFavorite } from '@/apis/postFavorite';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Place } from '@/types/map';
import type { CategoryType, EventType, StoreClassType } from '@/components/common/StoreTypeIcon';
import type { StoreStatusType } from '@/components/common/StoreStatus';
import { getCurrentLocation, calculateDistance, formatDistance } from '@/utils/distanceUtils';
import { showErrorToast, showToast } from '@/utils/toast';

// getPlaceDetail API가 반환하는 실제 데이터 구조에 맞춘 타입 정의
interface StoreData {
  placeId: number;
  name: string;
  address: string;
  hours: string;
  distance: string;
  latitude: number;
  longitude: number;
  tel: string;
  isBookmarked: boolean;
  category: CategoryType;
  eventTypeCode: EventType;
  status: StoreStatusType;
  benefitDesc?: string;
  coupons: CouponInfo[];
}

const JuniorMarket = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSeoulEventStores = async () => {
      try {
        setIsLoading(true);

        // 현재 위치 가져오기
        const currentLocation = await getCurrentLocation();
        let centerLatStr = '37.544581'; // 기본값 (서울시청)
        let centerLngStr = '127.055961';

        if (currentLocation) {
          centerLatStr = currentLocation.lat.toString();
          centerLngStr = currentLocation.lng.toString();
        } else {
          showErrorToast('현재 위치를 가져올 수 없어 기본 위치를 사용합니다.');
        }

        const seoulBounds = { swLat: 37.42, swLng: 126.73, neLat: 37.7, neLng: 127.2 };
        const allPlacesInSeoul: Place[] = await getPlaces(seoulBounds);
        const eventPlaces = allPlacesInSeoul.filter((p) => p.eventCode !== 'NONE');

        if (eventPlaces.length === 0) {
          setStores([]);
          setIsLoading(false);
          return;
        }

        const detailResults = await Promise.allSettled(
          eventPlaces.map(
            (place) =>
              getPlaceDetail(place.placeId, centerLatStr, centerLngStr) as Promise<StoreData>
          )
        );

        const successfulDetails = detailResults
          .filter(
            (result): result is PromiseFulfilledResult<StoreData> => result.status === 'fulfilled'
          )
          .map((result) => result.value);

        const finalStoreInfo: StoreInfo[] = successfulDetails.map((detail) => {
          const originalPlace = eventPlaces.find((p: Place) => p.placeId === detail.placeId)!;

          // 현재 위치가 있으면 직접 거리 계산, 없으면 API 응답 사용
          let calculatedDistance = detail.distance;
          if (currentLocation) {
            const distanceKm = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              detail.latitude,
              detail.longitude
            );
            calculatedDistance = formatDistance(distanceKm);
          }

          return {
            id: String(detail.placeId),
            name: detail.name,
            address: detail.address,
            hours: detail.hours,
            distance: calculatedDistance,
            latitude: detail.latitude,
            longitude: detail.longitude,
            isBookmarked: detail.isBookmarked,
            category: detail.category,
            event: detail.eventTypeCode,
            storeClass: originalPlace.markerCode,
            status: detail.status,
            benefitDesc: detail.benefitDesc,
            coupons: detail.coupons,
            phoneNumber: detail.tel,
          };
        });

        // 현재 위치가 있으면 거리순 정렬, 없으면 기본 정렬 (REQUIRE 맨 위)
        let sortedStores;
        if (currentLocation) {
          sortedStores = finalStoreInfo.sort((a, b) => {
            // REQUIRE 이벤트가 있으면 맨 위
            if (a.event === 'REQUIRE' && b.event !== 'REQUIRE') return -1;
            if (a.event !== 'REQUIRE' && b.event === 'REQUIRE') return 1;

            // 그 다음은 거리순
            const distanceA = parseFloat(a.distance.replace('km', '').replace('m', '')) || 0;
            const distanceB = parseFloat(b.distance.replace('km', '').replace('m', '')) || 0;
            return distanceA - distanceB;
          });
        } else {
          sortedStores = finalStoreInfo.sort((a, b) => {
            if (a.event === 'REQUIRE' && b.event !== 'REQUIRE') return -1;
            if (a.event !== 'REQUIRE' && b.event === 'REQUIRE') return 1;
            return 0;
          });
        }

        setStores(sortedStores);
      } catch (err) {
        setError('매장 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeoulEventStores();
  }, []);

  const handleLocationClick = (store: StoreInfo) => {
    navigate('/map', {
      state: {
        focusStore: {
          latitude: store.latitude,
          longitude: store.longitude,
          placeId: Number(store.id),
          placeName: store.name,
        },
      },
    });
  };

  const handleBookmarkToggle = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;

    const previousIsBookmarked = store.isBookmarked;
    setStores((prevStores) =>
      prevStores.map((s) => (s.id === storeId ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );

    try {
      await toggleFavorite(Number(storeId));
    } catch (err) {
      showToast('즐겨찾기 변경 실패:');
      setStores((prevStores) =>
        prevStores.map((s) => (s.id === storeId ? { ...s, isBookmarked: previousIsBookmarked } : s))
      );
    }
  };

  const handleExpandToggle = (storeId: string) => {
    setExpandedStores((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storeId)) {
        newSet.delete(storeId);
      } else {
        newSet.add(storeId);
      }
      return newSet;
    });
  };

  const handleCouponDownload = async (_storeId: string, couponTemplateId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponTemplateId));

    try {
      await postDownloadCoupon(Number(couponTemplateId));
      setDownloadedCoupons((prev) => new Set(prev).add(couponTemplateId));
    } catch (err) {
      alert('쿠폰 다운로드에 실패했습니다.');
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponTemplateId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm font-regular text-gray-600">매장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <p className="text-sm font-regular text-gray-600 text-center px-5">
            데이터를 불러오는 중 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-2 bg-white">
      <div className="m-2 mb-4">
        <p className="text-lm font-bold text-black">이번주니어 매장</p>
      </div>
      <div className="flex flex-col items-start gap-4">
        {stores.length > 0 ? (
          stores.map((store) => (
            <BookmarkCard
              key={store.id}
              store={store}
              onBookmarkToggle={() => handleBookmarkToggle(store.id)}
              isExpanded={expandedStores.has(store.id)}
              onExpandToggle={() => handleExpandToggle(store.id)}
              onCouponDownload={(couponTemplateId) =>
                handleCouponDownload(store.id, couponTemplateId)
              }
              downloadingCoupons={downloadingCoupons}
              downloadedCoupons={downloadedCoupons}
              onLocationClick={() => handleLocationClick(store)}
            />
          ))
        ) : (
          <div className="p-5 text-center text-gray-500">표시할 이벤트 매장이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default JuniorMarket;
