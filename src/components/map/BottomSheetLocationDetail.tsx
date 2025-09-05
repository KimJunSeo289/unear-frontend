import React, { useState, useEffect } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BookmarkStar from '@/components/common/BookmarkStar';
import StoreStatus from '@/components/common/StoreStatus';
import LocationButton from '@/components/common/LocationButton';
import CallButton from '@/components/common/CallButton';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import GiftIcon from '@/assets/map/giftIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';
import { Loader2 } from 'lucide-react';
import { postDownloadCoupon } from '@/apis/postDownloadCoupon';
import type { StoreData } from '@/types/storeDetail';
import type { MapContainerRef } from '@/components/map/MapContainer';
import { toggleFavorite } from '@/apis/postFavorite';
import { getUserCouponDetail } from '@/apis/getUserCouponDetail';
import CouponModal from '../common/CouponModal';
import type { UserCouponDetail } from '@/types/coupon';
import { getPlaceDetail } from '@/apis/getPlaceDetail';

interface BottomSheetLocationDetailProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreData;
  mapRef: React.RefObject<MapContainerRef | null>;
  userLocation: { latitude: string; longitude: string };
}

const BottomSheetLocationDetail: React.FC<BottomSheetLocationDetailProps> = ({
  isOpen,
  onClose,
  store,
  mapRef,
  userLocation,
}) => {
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(store.isBookmarked);
  const [selectedCoupon, setSelectedCoupon] = useState<UserCouponDetail | null>(null);
  const [localStore, setLocalStore] = useState(store);

  const handleCouponDownload = async (couponId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponId));

    try {
      await postDownloadCoupon(Number(couponId));
      setDownloadedCoupons((prev) => new Set(prev).add(couponId));

      // 쿠폰 다운로드 후 store 최신화
      const updated = await getPlaceDetail(
        store.placeId,
        String(userLocation.latitude),
        String(userLocation.longitude)
      );
      if (updated) {
        setLocalStore(updated);
      }
    } catch (err) {
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedCoupon(null);
  };

  // 쿠폰 클릭 시 상세 정보 불러오기
  const handleCouponClick = async (userCouponId: number | null) => {
    if (userCouponId == null) return;

    try {
      const detail = await getUserCouponDetail(userCouponId);
      if (detail) {
        setSelectedCoupon(detail);
      }
    } catch (error) {}
  };

  const handleBookmarkToggle = async () => {
    const prev = isBookmarked;
    const next = !prev;
    setIsBookmarked(next);

    try {
      await toggleFavorite(store.placeId);

      if (prev === true && next === false && localStorage.getItem('isBookmarkOnly') === 'true') {
        window.dispatchEvent(new Event('refreshMapStores'));
      }
    } catch (err) {
      setIsBookmarked(prev);
    }
  };
  useEffect(() => {
    setLocalStore(store);
  }, [store]);

  const handleLocationClick = () => {
    const currentCenter = mapRef.current?.getCenter?.();

    const currentLat = currentCenter?.lat;
    const currentLng = currentCenter?.lng;

    const targetLat = Number(store.latitude);
    const targetLng = Number(store.longitude);

    const isDifferent =
      !currentLat || !currentLng || currentLat !== targetLat || currentLng !== targetLng;

    if (isDifferent) {
      mapRef.current?.setCenter(targetLat, targetLng);
      mapRef.current?.setLevel(1);
    }
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${store.tel}`;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} disablePadding>
      <div className="relative w-full bg-white rounded-t-[20px] p-[19px] pb-1 flex flex-col">
        {store.eventTypeCode !== 'NONE' && (
          <div className="text-pink-600 font-bold text-sm mb-1">이벤트 매장</div>
        )}

        <div className="absolute right-[15px] top-[19px]">
          <BookmarkStar isBookmarked={isBookmarked} onToggle={handleBookmarkToggle} />
        </div>

        <div className="mt-1">
          <h3 className="font-semibold text-lg text-black">{store.name}</h3>
        </div>

        <div className="mt-1">
          <p className="font-regular text-sm text-gray-400 leading-[19px] max-w-[580px]">
            {store.address}
          </p>
        </div>

        <div className="mt-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[6px] flex-wrap">
            <LocationIcon />
            <span className="text-sm text-gray-500">{store.distance}</span>
            <TimeIcon />
            <span className="text-sm text-gray-500">{store.hours}</span>
          </div>
          <StoreStatus status={store.status} />
        </div>

        {store.benefitDesc && (
          <div className="mt-4 px-4 py-3 bg-gray-100 rounded-[8px]">
            <div className="flex items-center gap-2 mb-1">
              <GiftIcon />
              <span className="font-semibold text-sm mt-[3px] text-black">혜택 정보</span>
            </div>
            <p className="font-semibold text-sm text-gray-800 leading-[21px]">
              · {store.benefitDesc}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
            <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
              사용 가능한 쿠폰 {store.coupons.length}개
            </span>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
            {isExpanded ? (
              <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
            ) : (
              <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {localStore.coupons.map((coupon, index) => {
              const userCouponId = coupon.userCouponId ?? null;
              const isClickable = userCouponId !== null;

              return (
                <div
                  key={userCouponId ?? `coupon-${index}`}
                  onClick={() => {
                    if (isClickable) handleCouponClick(userCouponId);
                  }}
                  className={`relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-full h-[46px] ${
                    coupon.userCouponId
                      ? 'cursor-pointer hover:bg-gray-50 transition-colors'
                      : 'cursor-default'
                  }`}
                >
                  <div className="absolute left-3 top-3">
                    <CouponIcon />
                  </div>
                  <div className="ml-8">
                    <h4 className="font-bold text-s text-black leading-[12px]">
                      {coupon.couponName}
                    </h4>
                    <p className="text-xs text-gray-400 mt-[2px]">
                      {coupon.couponEnd?.split('T')[0]} 까지
                    </p>
                  </div>

                  {!coupon.downloaded &&
                    !downloadedCoupons.has(String(coupon.couponTemplateId)) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCouponDownload(String(coupon.couponTemplateId));
                        }}
                        className="absolute right-3 top-[13px] w-5 h-5 flex items-center justify-center"
                        disabled={downloadingCoupons.has(String(coupon.couponTemplateId))}
                      >
                        {downloadingCoupons.has(String(coupon.couponTemplateId)) ? (
                          <Loader2 className="w-5 h-5 animate-spin text-black" />
                        ) : (
                          <DownloadIcon className="w-5 h-5 text-black" />
                        )}
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        )}

        {/* 하단 버튼들 */}
        <div className="mt-3 flex gap-5">
          <div className="flex-1">
            <LocationButton onClick={handleLocationClick} width="w-full" />
          </div>
          <div className="flex-1">
            <CallButton onClick={handlePhoneClick} width="w-full" />
          </div>
        </div>
      </div>
      {selectedCoupon && (
        <CouponModal
          brand={selectedCoupon.brandName}
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
    </BottomSheet>
  );
};

export default BottomSheetLocationDetail;
