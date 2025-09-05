import { useEffect, useState } from 'react';
import type { Place } from '@/types/map';
import BottomSheet from '@/components/common/BottomSheet';
import StoreCouponCard from '@/components/common/StoreCouponCard';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import { getUserCouponDetail } from '@/apis/getUserCouponDetail';
import { toggleFavorite } from '@/apis/postFavorite';
import CouponModal from '../common/CouponModal';
import LoadingSpinner from '../common/LoadingSpinner';
import type { StoreData } from '@/types/storeDetail';
import type { UserCouponDetail } from '@/types/coupon';
import type { StoreStatusType } from '@/components/common/StoreStatus';
import type { CategoryType } from '@/components/common/StoreTypeIcon';
import type { MapContainerRef } from '@/components/map/MapContainer';

interface Props {
  results: Place[];
  keyword: string;
  isOpen: boolean;
  onClose: () => void;
  currentLat: string;
  currentLng: string;
  onBookmarkToggle: (placeId: number) => void;
  onCouponDownloaded: () => void;
  onCouponClick: (userCouponId: number, brand: string) => void;
  mapRef: React.RefObject<MapContainerRef | null>;
  onMarkerClick: (placeId: number, lat: string, lng: string) => void;
}

const BottomSheetSearchList = ({
  results,
  keyword,
  isOpen,
  onClose,
  currentLat,
  currentLng,
  onCouponDownloaded,
  onCouponClick,
  mapRef,
  onMarkerClick,
}: Props) => {
  const [storeList, setStoreList] = useState<StoreData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<UserCouponDetail | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const promises = results.map((place) =>
          getPlaceDetail(place.placeId, currentLat, currentLng)
        );
        const detailData = await Promise.all(promises);
        setStoreList(detailData);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && results.length > 0) fetchDetails();
  }, [isOpen, results, currentLat, currentLng]);

  const handleCardClick = async (userCouponId: number, brand: string) => {
    try {
      setSelectedBrand(brand);
      const detail = await getUserCouponDetail(userCouponId);
      setSelectedCoupon(detail);
      setIsModalOpen(true);
      onCouponClick(userCouponId, brand);
    } catch (err) {}
  };

  const handleCouponDownloaded = async (placeId: number) => {
    try {
      const updated = await getPlaceDetail(placeId, currentLat, currentLng);
      setStoreList((prev) => prev.map((store) => (store.placeId === placeId ? updated : store)));

      onCouponDownloaded();
    } catch (err) {}
  };

  const handleBookmarkToggle = async (placeId: number) => {
    const target = storeList.find((store) => store.placeId === placeId);
    if (!target) return;

    const prev = target.isBookmarked;
    const next = !prev;

    setStoreList((prevList) =>
      prevList.map((store) =>
        store.placeId === placeId ? { ...store, isBookmarked: next } : store
      )
    );

    try {
      await toggleFavorite(placeId);

      if (prev && !next && localStorage.getItem('isBookmarkOnly') === 'true') {
        window.dispatchEvent(new Event('refreshMapStores'));
      }
    } catch (err) {
      setStoreList((prevList) =>
        prevList.map((store) =>
          store.placeId === placeId ? { ...store, isBookmarked: prev } : store
        )
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
    setSelectedBrand('');
  };

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="flex items-center mb-4">
          <strong className="text-lg">'{keyword}' 검색 결과</strong>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="md" color="primary" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[23px] pb-4">
            {storeList.map((store) => {
              const now = new Date();
              const currentHour = now.getHours();
              const openHour = Number(store.hours.split(':')[0]);
              const closeHour = Number(store.hours.split('-')[1]?.trim()?.split(':')[0]) || 24;

              const isOpen = currentHour >= openHour && currentHour < closeHour;
              const status: StoreStatusType = isOpen ? '영업중' : '영업종료';

              return (
                <StoreCouponCard
                  key={`${store.placeId}-${store.isBookmarked}`}
                  store={{
                    id: String(store.placeId),
                    name: store.name,
                    address: store.address,
                    distance: store.distance,
                    hours: store.hours,
                    category: store.category as CategoryType,
                    status,
                    isBookmarked: store.isBookmarked,
                    latitude: store.latitude,
                    longitude: store.longitude,
                    tel: store.tel,
                    coupons: store.coupons.map((coupon) => ({
                      id: String(coupon.couponTemplateId),
                      title: coupon.couponName,
                      expiryDate: coupon.couponEnd.split('T')[0].replace(/-/g, '.'),
                      downloaded: coupon.downloaded,
                      userCouponId: coupon.userCouponId,
                      discountCode: coupon.discountCode,
                      membershipCode: coupon.membershipCode,
                      discountInfo: coupon.discountInfo,
                    })),
                  }}
                  onLocationClick={(lat, lng) => {
                    if (!mapRef?.current) {
                      return;
                    }
                    mapRef.current.setCenter(lat, lng);
                    mapRef.current.setSelectedMarker(store.placeId);
                    onClose();
                    onMarkerClick(store.placeId, String(lat), String(lng));
                  }}
                  onBookmarkToggle={() => handleBookmarkToggle(store.placeId)}
                  onCouponDownloaded={() => handleCouponDownloaded(store.placeId)}
                  onCouponClick={(userCouponId) => handleCardClick(userCouponId, store.name)}
                />
              );
            })}
          </div>
        )}
      </BottomSheet>

      {selectedCoupon && isModalOpen && (
        <CouponModal
          brand={selectedBrand}
          title={selectedCoupon.couponName}
          discountRate={
            selectedCoupon.discountCode === 'COUPON_PERCENT'
              ? `${selectedCoupon.discountPercent ?? 0}%`
              : selectedCoupon.discountCode === 'COUPON_FIXED'
                ? `${selectedCoupon.fixedDiscount?.toLocaleString() ?? 0}원`
                : '팝업매장쿠폰'
          }
          expireDate={selectedCoupon.couponEnd}
          barcodeValue={selectedCoupon.barcodeNumber}
          usageCondition={
            selectedCoupon.discountCode === 'COUPON_FIXED'
              ? `최소 ${selectedCoupon.minPurchaseAmount?.toLocaleString() ?? 0}원 이상 구매 시`
              : selectedCoupon.discountCode === 'COUPON_PERCENT'
                ? `최대 ${selectedCoupon.maxDiscountAmount?.toLocaleString() ?? 0}원 할인`
                : '팝업매장에서만 사용가능'
          }
          usageGuide={[
            '매장에서 결제 전 바코드 제시',
            '직원에게 쿠폰 사용 의사 전달',
            '할인 적용 후 결제',
          ]}
          caution={[
            '다른 할인 쿠폰과 중복 사용 불가',
            '사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ]}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default BottomSheetSearchList;
