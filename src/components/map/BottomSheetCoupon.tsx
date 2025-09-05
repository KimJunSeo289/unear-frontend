import { useState, useEffect } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import CouponCard from '@/components/common/CouponCard';
import StoreCouponCard from '@/components/common/StoreCouponCard';
import EmptyState from '@/components/common/EmptyState';
import ClockIcon from '@/assets/map/mapCouponWatchIcon.svg?react';
import MarkerIcon from '@/assets/map/mapCouponLocationIcon.svg?react';
import MapCouponIcon from '@/assets/map/mapCouponSheetIcon.svg?react';
import type { CategoryType } from '@/components/common/StoreTypeIcon';
import type { StoreStatusType } from '@/components/common/StoreStatus';
import CouponModal from '@/components/common/CouponModal';
import { getUserCoupons } from '@/apis/getUserCoupons';
import { getUserCouponDetail } from '@/apis/getUserCouponDetail';
import { getNearbyStores } from '@/apis/getNearbyStores';
import { toggleFavorite } from '@/apis/postFavorite';
import { isExpiringSoon } from '@/utils/isExpiringSoon';
import type { UserCoupon, UserCouponDetail } from '@/types/coupon';
import type { NearbyStore, NearbyCoupon } from '@/types/store';
import type { MapContainerRef } from '@/components/map/MapContainer';
import type { RefObject } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface BottomSheetCouponProps {
  isOpen: boolean;
  onClose: () => void;
  mapRef: RefObject<MapContainerRef | null>;
  onMarkerClick: (placeId: number, lat: string, lng: string) => void;
}

const BottomSheetCoupon = ({ isOpen, onClose, mapRef, onMarkerClick }: BottomSheetCouponProps) => {
  const [activeTab, setActiveTab] = useState<'couponbox' | 'nearby'>('couponbox');
  const [selectedCoupon, setSelectedCoupon] = useState<UserCouponDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([]);
  const [shouldRefreshNearby, setShouldRefreshNearby] = useState(false);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [isLoadingNearbyStores, setIsLoadingNearbyStores] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const handleCardClick = async (couponId: number) => {
    try {
      const brandName = coupons.find((c) => c.userCouponId === couponId)?.name ?? '';
      setSelectedBrand(brandName);
      const detail = await getUserCouponDetail(couponId);
      if (detail) {
        setSelectedCoupon(detail);
        setIsModalOpen(true);
      }
    } catch (err) {}
  };

  const handleBookmarkToggle = async (storeId: string, isBookmarked: boolean) => {
    setNearbyStores((prev) =>
      prev.map((store) =>
        String(store.placeId) === storeId ? { ...store, favorite: !isBookmarked } : store
      )
    );

    try {
      await toggleFavorite(Number(storeId));
    } catch (error) {
      setNearbyStores((prev) =>
        prev.map((store) =>
          String(store.placeId) === storeId ? { ...store, favorite: isBookmarked } : store
        )
      );
    }
  };

  const handleCouponDownloaded = async () => {
    await refreshUserCoupons();
    setShouldRefreshNearby(true);
  };

  const refreshUserCoupons = async () => {
    const { coupons } = await getUserCoupons();
    setCoupons(coupons);
  };

  const handleClose = () => {
    setShouldRefreshNearby(true);
    onClose();
  };

  const handleTabChange = (tab: 'couponbox' | 'nearby') => {
    if (tab === 'couponbox') {
      setShouldRefreshNearby(true);
    }
    setActiveTab(tab);
    setLocationError(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoadingCoupons(true);
      const { coupons } = await getUserCoupons();
      setCoupons(coupons);
      setIsLoadingCoupons(false);
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (activeTab !== 'nearby' || !isOpen) return;

    const fetchNearbyStores = async () => {
      try {
        if (!navigator.geolocation) {
          setLocationError(true);
          setIsLoadingNearbyStores(false);
          return;
        }
        setIsLoadingNearbyStores(true);
        setLocationError(false);

        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            const stores = await getNearbyStores(coords.latitude, coords.longitude);
            setNearbyStores(stores);
            setShouldRefreshNearby(false);
            setIsLoadingNearbyStores(false);
          },
          (_err) => {
            setLocationError(true);
            setIsLoadingNearbyStores(false);
          }
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setLocationError(true);
        setIsLoadingNearbyStores(false);
      }
    };

    if (shouldRefreshNearby || nearbyStores.length === 0) {
      fetchNearbyStores();
    }
  }, [activeTab, isOpen, shouldRefreshNearby]);

  useEffect(() => {
    if (isOpen && activeTab === 'couponbox') {
      refreshUserCoupons();
    }
  }, [isOpen, activeTab]);

  const expiringSoonCoupons = Array.isArray(coupons) ? coupons.filter(isExpiringSoon) : [];

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={handleClose} disablePadding={true}>
        <div className="w-full h-[520px] flex flex-col">
          {/* 탭 바 영역: 고정 */}
          <div className="shrink-0 pt-4 bg-white z-10">
            <div className="flex text-m font-semibold text-center">
              <button
                onClick={() => handleTabChange('couponbox')}
                className={`flex-1 pb-1 -mb-[1px] ${
                  activeTab === 'couponbox'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 border-b-2 border-gray-300'
                }`}
              >
                쿠폰함
              </button>
              <button
                onClick={() => handleTabChange('nearby')}
                className={`flex-1 pb-1 -mb-[1px] ${
                  activeTab === 'nearby'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 border-b-2 border-gray-300'
                }`}
              >
                주변 매장
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역: 스크롤 대상 */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'couponbox' &&
              (isLoadingCoupons ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 곧 만료 예정 */}
                  <div className="mt-4 ml-5 mr-5">
                    <div className="flex items-center gap-x-2 mb-2">
                      <ClockIcon className="w-4 h-4 shrink-0" />
                      <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">
                        곧 만료 예정
                      </span>
                      <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px]">
                        <span className="text-s font-semibold text-pink-700 mt-[3px]">
                          {expiringSoonCoupons.length}개
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {expiringSoonCoupons.map((coupon) => (
                        <CouponCard
                          key={`soon-${coupon.userCouponId}`}
                          brand={coupon.name}
                          title={coupon.couponName}
                          validUntil={coupon.couponEnd}
                          category={coupon.categoryCode}
                          storeClass={coupon.markerCode}
                          onClick={() => handleCardClick(coupon.userCouponId)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 전체 쿠폰 */}
                  <div className="mt-6 ml-5 mr-5 pb-[10px]">
                    <div className="flex items-center gap-x-2 mb-2">
                      <MapCouponIcon className="w-5 h-5 shrink-0" />
                      <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">
                        전체 쿠폰
                      </span>
                      <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px]">
                        <span className="text-s font-semibold text-pink-700 mt-[3px]">
                          {coupons.length}개
                        </span>
                      </div>
                    </div>

                    {coupons.length === 0 ? (
                      <div className="flex justify-center items-center py-8">
                        <EmptyState message="사용할 수 있는 쿠폰이 없어요" />
                      </div>
                    ) : (
                      <div className="space-y-[14px]">
                        {coupons.map((coupon) => (
                          <CouponCard
                            key={`all-${coupon.userCouponId}`}
                            brand={coupon.name}
                            title={coupon.couponName}
                            validUntil={coupon.couponEnd}
                            category={coupon.categoryCode}
                            storeClass={coupon.markerCode}
                            onClick={() => handleCardClick(coupon.userCouponId)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {activeTab === 'nearby' &&
              (isLoadingNearbyStores ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner size="lg" />
                </div>
              ) : locationError ? (
                <div className="flex justify-center items-center h-full">
                  <EmptyState message={`불러올 매장이 없어요.\n위치정보를 확인해주세요!`} />
                </div>
              ) : (
                <div className="mt-4 ml-5 mr-5 pb-[10px]">
                  <div className="flex items-center gap-x-2 mb-2">
                    <MarkerIcon className="w-4 h-4 shrink-0" />
                    <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">
                      가까운 매장
                    </span>
                    <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px]">
                      <span className="text-s font-semibold text-pink-700 mt-[3px]">
                        {nearbyStores.length}개
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-[23px]">
                    {nearbyStores.map((store) => {
                      const now = new Date();
                      const currentHour = now.getHours();
                      const openHour = Number(store.startTime);
                      const closeHour = Number(store.endTime);

                      const isOpen = currentHour >= openHour && currentHour < closeHour;
                      const status: StoreStatusType = isOpen ? '영업중' : '영업종료';

                      return (
                        <StoreCouponCard
                          key={`${store.placeId}-${store.favorite}`}
                          store={{
                            id: String(store.placeId),
                            name: store.name,
                            address: store.address,
                            distance: `${store.distanceKm}km`,
                            hours: `${store.startTime}:00 - ${store.endTime}:00`,
                            category: store.categoryCode as CategoryType,
                            status,
                            isBookmarked: store.favorite,
                            latitude: store.latitude,
                            longitude: store.longitude,
                            tel: store.tel,
                            coupons: store.coupons.map((coupon: NearbyCoupon) => ({
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
                            if (!mapRef.current) return;

                            mapRef.current.setSelectedMarker(Number(store.placeId));

                            mapRef.current.setCenter(lat, lng);
                            mapRef.current.setLevel(1);
                            onClose();
                            onMarkerClick(Number(store.placeId), String(lat), String(lng));
                          }}
                          onBookmarkToggle={handleBookmarkToggle}
                          onCouponDownloaded={handleCouponDownloaded}
                          onCouponClick={handleCardClick}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </BottomSheet>

      {selectedCoupon && isModalOpen && (
        <CouponModal
          brand={selectedBrand}
          title={selectedCoupon.couponName}
          discountRate={
            selectedCoupon.discountCode === 'COUPON_PERCENT'
              ? `${selectedCoupon.discountPercent}%`
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

export default BottomSheetCoupon;
