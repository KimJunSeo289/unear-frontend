import type React from 'react';
import { useState, useEffect } from 'react';
import StoreTypeIcon, { type CategoryType } from './StoreTypeIcon';
import BookmarkStar from './BookmarkStar';
import StoreStatus, { type StoreStatusType } from './StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import PhoneButton from '@/components/common/PhoneButton';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import { Loader2 } from 'lucide-react';
import { postDownloadCoupon } from '@/apis/postDownloadCoupon';
import { showErrorToast, showToast } from '@/utils/toast';

interface Coupon {
  id: string;
  title: string;
  expiryDate: string;
  downloaded?: boolean;
  userCouponId: number | null;
  discountCode: 'COUPON_FIXED' | 'COUPON_PERCENT';
  membershipCode: string;
  discountInfo: string | null;
}

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  status: StoreStatusType;
  isBookmarked: boolean;
  latitude: number;
  longitude: number;
  tel?: string;
  coupons: Coupon[];
}

interface StoreCouponCardProps {
  store: StoreInfo;
  onBookmarkToggle?: (storeId: string, isBookmarked: boolean) => void;
  onLocationClick?: (lat: number, lng: number) => void;
  onCouponDownloaded?: () => void;
  onCouponClick?: (couponId: number) => void;
  className?: string;
}

const StoreCouponCard: React.FC<StoreCouponCardProps> = ({
  store,
  onBookmarkToggle,
  onLocationClick,
  onCouponDownloaded,
  onCouponClick,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());
  const [localBookmarked, setLocalBookmarked] = useState(store.isBookmarked);

  useEffect(() => {
    setLocalBookmarked(store.isBookmarked);
  }, [store.isBookmarked]);

  const handleCouponDownload = async (couponId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponId));

    try {
      const _downloaded = await postDownloadCoupon(Number(couponId));
      showToast('쿠폰 다운로드 완료');

      // UI 상태 갱신
      setDownloadedCoupons((prev) => new Set(prev).add(couponId));
      store.coupons = store.coupons.map((coupon) =>
        coupon.id === couponId ? { ...coupon, downloaded: true } : coupon
      );

      onCouponDownloaded?.();
    } catch (err) {
      showErrorToast('쿠폰 다운로드에 실패했습니다.');
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  const handleBookmarkToggle = (next: boolean) => {
    setLocalBookmarked(next);
    onBookmarkToggle?.(store.id, !next);
  };

  const handleLocationClick = () => {
    if (store.latitude && store.longitude) {
      onLocationClick?.(store.latitude, store.longitude);
    } else {
      showErrorToast('위치 정보가 없습니다.');
    }
  };

  const handlePhoneClick = () => {
    if (store.tel) {
      window.location.href = `tel:${store.tel}`;
    } else {
      alert('전화번호가 없습니다.');
    }
  };

  return (
    <div
      className={`
        relative
        w-full
        bg-white
        rounded-[8px]
        shadow-[0px_2px_10px_rgba(0,0,0,0.25)]
        transition-all duration-300
        p-[19px] pb-[72px]
        ${className}
      `}
    >
      {/* 매장 아이콘 */}
      <div className="absolute left-[19px] top-[19px]">
        <StoreTypeIcon category={store.category} storeClass="FRANCHISE" size={50} />
      </div>

      {/* 즐겨찾기 */}
      <div className="absolute right-[15px] top-[14px]">
        <BookmarkStar isBookmarked={localBookmarked} onToggle={handleBookmarkToggle} />
      </div>

      {/* 매장명 */}
      <div className="absolute left-[85px] top-[19px] w-[50%]">
        <h3 className="font-semibold text-lm text-black truncate">{store.name}</h3>
      </div>

      {/* 주소 */}
      <div className="absolute left-[85px] top-[46px] w-[65%]">
        <p className="font-regular text-sm text-gray-400 leading-[19px] truncate">
          {store.address}
        </p>
      </div>

      {/* 거리 & 시간 & 상태 */}
      <div className="absolute left-[19px] right-[15px] top-[80px] flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <LocationIcon />
          <span className="font-regular text-sm text-gray-500 relative top-[2px]">
            {store.distance}
          </span>
          <TimeIcon />
          <span className="font-regular text-sm text-gray-500 relative top-[2px]">
            {store.hours}
          </span>
        </div>
        <StoreStatus status={store.status} className="relative top-[1px]" />
      </div>

      {/* 쿠폰 섹션 */}
      <div className="mt-[94px] flex items-center justify-between w-full ">
        <div className="flex items-center gap-2">
          <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
          <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
            사용 가능한 쿠폰 {store.coupons.length}개
          </span>
        </div>

        {/* 화살표 버튼 */}
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
          {isExpanded ? (
            <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
          ) : (
            <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
          )}
        </button>
      </div>

      {/* 쿠폰 목록 */}
      {isExpanded && (
        <div className="mt-[14px] space-y-[10px]">
          {store.coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-full h-[46px] ${
                coupon.userCouponId
                  ? 'cursor-pointer hover:bg-gray-50 transition-colors'
                  : 'cursor-default'
              }`}
              onClick={() => coupon.userCouponId && onCouponClick?.(coupon.userCouponId)}
            >
              <div className="absolute left-3 top-3">
                <CouponIcon />
              </div>
              <div className="ml-8">
                <h4 className="font-bold text-s text-black leading-[12px]">{coupon.title}</h4>
                <p className="font-regular text-xs text-gray-400 leading-[13px] mt-[2px]">
                  {coupon.expiryDate} 까지
                </p>
              </div>
              {!coupon.downloaded && !downloadedCoupons.has(coupon.id) && (
                <button
                  onClick={() => handleCouponDownload(coupon.id)}
                  className="absolute right-3 top-[13px] w-5 h-5 flex items-center justify-center"
                  disabled={downloadingCoupons.has(coupon.id)}
                >
                  {downloadingCoupons.has(coupon.id) ? (
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                  ) : (
                    <DownloadIcon className="w-5 h-5 text-black" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* 하단 버튼(위치보기, 전화) */}
      <div className="absolute left-[19px] right-[15px] bottom-[20px] flex gap-2">
        <div className="flex-[8]">
          <MiniLocationButton onClick={handleLocationClick} />
        </div>
        <div className="flex-[2]">
          <PhoneButton onClick={handlePhoneClick} />
        </div>
      </div>
    </div>
  );
};

export default StoreCouponCard;

/*
- 사용법
      <StoreCouponCard
        store={{
          ...Store, //데이터
          isBookmarked,
        }}
        onBookmarkToggle={handleBookmarkToggle}
      />
    
*/
