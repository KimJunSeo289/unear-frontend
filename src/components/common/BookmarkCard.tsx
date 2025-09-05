import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreTypeIcon from './StoreTypeIcon';
import BookmarkStar from './BookmarkStar';
import StoreStatus, { type StoreStatusType } from './StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import StorePhoneModal from '@/components/common/StorePhoneModal';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import LocationWhiteIcon from '@/assets/common/locationWhiteIcon.svg?react';
import TimeWhiteIcon from '@/assets/common/timeWhiteIcon.svg?react';
import PhoneIcon from '@/assets/common/phone.svg?react';
import PhoneDarkIcon from '@/assets/common/PhoneDark.svg?react';
import type { BookmarkStore } from '@/types/bookmark';
import { getOperatingStatus } from '@/utils/operatingHours';

interface BookmarkCardProps {
  store: BookmarkStore;
  onBookmarkToggle?: (storeId: string) => void;
  className?: string;
  isDarkMode?: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  store,
  onBookmarkToggle,
  className = '',
  isDarkMode = false,
}) => {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const navigate = useNavigate();
  const handleBookmarkToggle = () => {
    onBookmarkToggle?.(store.id);
  };

  const handleLocationClick = () => {
    // React Router state를 통해 지도 페이지로 이동하면서 매장 정보 전달
    const focusStoreData = {
      placeId: store.placeId,
      placeName: store.name,
      searchKeyword: store.name,
      latitude: store.latitude,
      longitude: store.longitude,
    };

    navigate('/map', {
      state: {
        focusStore: focusStoreData,
      },
    });
  };

  const handlePhoneClick = () => {
    setIsPhoneModalOpen(true);
  };

  const bgColor = isDarkMode ? 'bg-[#251A49]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';
  const IconLocation = isDarkMode ? LocationWhiteIcon : LocationIcon;
  const IconTime = isDarkMode ? TimeWhiteIcon : TimeIcon;
  const IconPhone = isDarkMode ? (isPhoneHovered ? PhoneIcon : PhoneDarkIcon) : PhoneIcon;

  // 전화 버튼 스타일
  const phoneButtonBaseStyle = isDarkMode
    ? 'bg-[#251A49] border-gray-200'
    : 'bg-white border-gray-500';

  const phoneButtonHoverStyle = isDarkMode
    ? 'border-gray-500 bg-gray-100'
    : 'border-gray-400 bg-gray-50';

  // 실시간 영업 상태 계산
  const operatingStatus = getOperatingStatus(store.hours);
  const dynamicStatus: StoreStatusType = operatingStatus.statusText;

  return (
    <div
      className={`relative w-full h-[159px] rounded-[8px] shadow-[0px_2px_10px_rgba(0,0,0,0.25)] transition-all duration-300 pl-[19px] pr-[15px] pt-[19px] ${bgColor} ${className}`}
    >
      {/* 매장 아이콘 */}
      <div className="absolute left-[19px] top-[19px]">
        <StoreTypeIcon
          category={store.category}
          storeClass={store.storeClass}
          event={store.event}
          size={50}
        />
      </div>

      {/* 즐겨찾기 */}
      <div className="absolute right-[15px] top-[14px]">
        <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkToggle} />
      </div>

      {/* 매장명 */}
      <div className="absolute left-[85px] top-[19px] w-[60%]">
        <h3 className={`font-semibold text-lm ${textColor} truncate`}>{store.name}</h3>
      </div>

      {/* 주소 - 주소가 길 경우 65% 이후는 ...으로 표시 */}
      <div className="absolute left-[85px] top-[46px] w-[65%]">
        <p className={`font-regular text-sm ${subTextColor} truncate`}>{store.address}</p>
      </div>

      {/* 거리 & 시간 & 상태 */}
      <div className="absolute left-[19px] right-[15px] top-[80px] mb-[10px] flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <IconLocation />
          <span className={`font-regular text-sm ${subTextColor} relative top-[1px]`}>
            {store.distance}
          </span>
          <IconTime />
          <span className={`font-regular text-sm ${subTextColor} relative top-[1px]`}>
            {store.hours}
          </span>
        </div>
        <StoreStatus status={dynamicStatus} className="relative top-[1px]" />
      </div>

      {/* 하단 버튼 - 8:2 비율 */}
      <div className="absolute left-[19px] right-[15px] bottom-[15px] flex gap-2">
        {/* 위치 버튼 - 8 비율 */}
        <div className="flex-[8]">
          <MiniLocationButton onClick={handleLocationClick} />
        </div>

        {/* 전화 버튼 - 2 비율 (간단한 div + className 사용) */}
        <div className="flex-[2]">
          <button
            onClick={handlePhoneClick}
            className={`w-full h-[31.6px] border rounded flex items-center justify-center transition-all duration-200 ${
              isPhoneHovered ? phoneButtonHoverStyle : phoneButtonBaseStyle
            }`}
            onMouseEnter={() => setIsPhoneHovered(true)}
            onMouseLeave={() => setIsPhoneHovered(false)}
            aria-label="전화 버튼"
          >
            <IconPhone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 전화번호 모달 */}
      <StorePhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        store={store}
      />
    </div>
  );
};

export default BookmarkCard;

/*
- 사용법
  <BookmarkCard
    store={{ ...sampleStore, isBookmarked }} // phoneNumber는 store 데이터에 포함
    onBookmarkToggle={handleBookmarkToggle}
    isDarkMode={false} // true 혹은 isDarkMode 생략시 라이트 모드
  />
*/
