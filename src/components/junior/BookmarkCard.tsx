// src/components/junior/BookmarkCard.tsx (변경 없음)

import type React from 'react';
import { Loader2 } from 'lucide-react';

import StoreTypeIcon, {
  type CategoryType,
  type StoreClassType,
  type EventType,
} from '@/components/common/StoreTypeIcon';
import BookmarkStar from '@/components/common/BookmarkStar';
import StoreStatus, { type StoreStatusType } from '@/components/common/StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import PhoneButton from '@/components/common/PhoneButton';
import PhoneButtonDark from '@/components/common/PhoneButtonDark';

import TimeIcon from '@/assets/common/timeIcon.svg?react';
import TimeWhiteIcon from '@/assets/common/timeWhiteIcon.svg?react';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import GiftIcon from '@/assets/map/giftIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';
import { showErrorToast } from '@/utils/toast';

// 쿠폰 상세 정보를 위한 타입 정의
export interface CouponInfo {
  couponTemplateId: number;
  userCouponId: number | null;
  couponName: string;
  discountInfo: string | null;
  couponEnd: string;
  downloaded: boolean;
}

// StoreInfo 타입에 위치 및 전화번호 정보를 포함하도록 업데이트
export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  hours: string;
  distance: string; // 거리 정보 추가
  latitude: number;
  longitude: number;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
  status: StoreStatusType;
  isBookmarked: boolean;
  benefitDesc?: string;
  coupons?: CouponInfo[];
  phoneNumber?: string;
}

// BookmarkCard의 props 타입 정의
interface BookmarkCardProps {
  store: StoreInfo;
  onBookmarkToggle?: (storeId: string) => void;
  className?: string;
  isDarkMode?: boolean;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  onCouponDownload?: (couponTemplateId: string) => void;
  downloadingCoupons?: Set<string>;
  downloadedCoupons?: Set<string>;
  onLocationClick?: (latitude: number, longitude: number) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  store,
  onBookmarkToggle,
  className = '',
  isDarkMode = false,
  isExpanded = false,
  onExpandToggle,
  onCouponDownload,
  downloadingCoupons = new Set(),
  downloadedCoupons = new Set(),
  onLocationClick,
}) => {
  const handleBookmarkClick = () => {
    onBookmarkToggle?.(store.id);
  };

  const handleLocationClick = () => {
    onLocationClick?.(store.latitude, store.longitude);
  };

  const handlePhoneClick = () => {
    if (store.phoneNumber) {
      window.location.href = `tel:${store.phoneNumber}`;
    } else {
      showErrorToast('전화번호가 없습니다.');
    }
  };

  const handleDownloadClick = (couponTemplateId: number) => {
    onCouponDownload?.(String(couponTemplateId));
  };

  const bgColor = isDarkMode ? 'bg-[#251A49]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';
  const IconTime = isDarkMode ? TimeWhiteIcon : TimeIcon;

  return (
    <div className={`w-full rounded-lg border border-gray-200 p-4 ${bgColor} ${className}`}>
      {/* --- 기본 정보 섹션 --- */}
      <div className="relative flex flex-col gap-2">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <StoreTypeIcon
              category={store.category}
              storeClass={store.storeClass}
              event={store.event}
              size={50}
            />
          </div>
          <div className="flex-1 overflow-hidden pr-8">
            <h3 className={`font-semibold text-lm ${textColor} break-words`}>{store.name}</h3>
            <p
              className={`font-regular text-sm ${subTextColor} leading-[19px] mt-1`}
              style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
            >
              {store.address}
            </p>
          </div>
          <div className="absolute right-0 top-[-2px]">
            <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkClick} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <LocationIcon />
            <span className={`font-regular text-sm ${subTextColor} relative top-px`}>
              {store.distance}
            </span>
            <IconTime />
            <span className={`font-regular text-sm ${subTextColor} relative top-px`}>
              {store.hours}
            </span>
          </div>
          <StoreStatus status={store.status} />
        </div>

        <div className="mt-auto pt-2 flex gap-2">
          <div className="flex-[8]">
            <MiniLocationButton onClick={handleLocationClick} />
          </div>
          <div className="flex-[2]">
            {isDarkMode ? (
              <PhoneButtonDark onClick={handlePhoneClick} />
            ) : (
              <PhoneButton onClick={handlePhoneClick} />
            )}
          </div>
        </div>
      </div>

      {/* --- 혜택 및 쿠폰 섹션 --- */}
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

      {store.coupons && store.coupons.length > 0 && (
        <>
          <div className="mt-5 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
              <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
                사용 가능한 쿠폰 {store.coupons.length}개
              </span>
            </div>
            <button onClick={onExpandToggle} className="p-1">
              {isExpanded ? (
                <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
              ) : (
                <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3">
              {store.coupons.map((coupon) => {
                const couponTemplateIdStr = String(coupon.couponTemplateId);
                const isDownloading = downloadingCoupons.has(couponTemplateIdStr);
                const isDownloaded = downloadedCoupons.has(couponTemplateIdStr);

                return (
                  <div
                    key={coupon.couponTemplateId}
                    className="relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-full h-[46px]"
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

                    {!coupon.downloaded && !isDownloaded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadClick(coupon.couponTemplateId);
                        }}
                        className="absolute right-3 top-[13px] w-5 h-5 flex items-center justify-center"
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
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
        </>
      )}
    </div>
  );
};

export default BookmarkCard;
