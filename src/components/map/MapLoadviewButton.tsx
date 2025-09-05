import { useState } from 'react';
import { showToast } from '@/utils/toast';
import MapLoadviewIcon from '@/assets/map/MapLoadviewIcon.svg?react';
import MapLoadviewIconMarked from '@/assets/map/MapLoadviewIconMarked.svg?react';

interface MapLoadviewButtonProps {
  onLoadviewToggle: (isActive: boolean) => void;
  isActive: boolean;
}

const MapLoadviewButton = ({ onLoadviewToggle, isActive }: MapLoadviewButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadviewClick = async () => {
    if (!window.kakao || !window.kakao.maps) {
      showToast('카카오맵이 로드되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 로드뷰 토글
      const newActiveState = !isActive;
      onLoadviewToggle(newActiveState);

      if (newActiveState) {
        showToast('도로를 클릭하여 로드뷰를 확인하세요.');
      }
    } catch (error) {
      showToast('로드뷰 기능을 사용할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLoadviewClick}
      disabled={isLoading}
      className={`
         flex items-center justify-center
         w-[45px] h-[45px] rounded-full
         bg-white shadow-md
         hover:bg-gray-50 active:bg-gray-100
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-all duration-200
       `}
      title="로드뷰"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : isActive ? (
        <MapLoadviewIconMarked className="w-[24px] h-[24px]" />
      ) : (
        <MapLoadviewIcon className="w-[24px] h-[24px]" />
      )}
    </button>
  );
};

export default MapLoadviewButton;
