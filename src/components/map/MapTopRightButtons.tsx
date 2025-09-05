import FilterIcon from '@/assets/map/mapFiliterIcon.svg?react';
import FilterMarkedIcon from '@/assets/map/mapFiliterIconMarked.svg?react';
import StarIcon from '@/assets/map/mapBookmarkIcon.svg?react';
import StarMarkedIcon from '@/assets/map/mapBookmarkIconMarked.svg?react';
import MapLoadviewButton from './MapLoadviewButton';

interface Props {
  onToggleFilter: () => void;
  onToggleBookmark: () => void;
  onToggleLoadview: (isActive: boolean) => void;
  isBookmarkOnly: boolean;
  isLoadviewActive: boolean;
  categoryCodes: string[];
  benefitCategories: string[];
}

const MapTopRightButtons = ({
  onToggleFilter,
  onToggleBookmark,
  onToggleLoadview,
  isBookmarkOnly,
  isLoadviewActive,
  categoryCodes,
  benefitCategories,
}: Props) => {
  const isFilterActive = categoryCodes.length > 0 || benefitCategories.length > 0;
  return (
    <div className="absolute top-[84px] right-[10px] z-10 flex flex-col gap-[10px] items-end">
      {/* 필터 버튼 */}
      <button
        onClick={onToggleFilter}
        className="w-[45px] h-[45px] rounded-full bg-white shadow-md
         hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center"
        title="필터링"
      >
        {isFilterActive ? (
          <FilterMarkedIcon className="w-[20px] h-[20px]" />
        ) : (
          <FilterIcon className="w-[20px] h-[20px]" />
        )}
      </button>

      {/* 즐겨찾기 버튼 */}
      <button
        onClick={onToggleBookmark}
        className="w-[45px] h-[45px] rounded-full bg-white shadow-md
         hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center"
        title="즐겨찾기"
      >
        {isBookmarkOnly ? (
          <StarMarkedIcon className="w-[20px] h-[20px]" />
        ) : (
          <StarIcon className="w-[20px] h-[20px]" />
        )}
      </button>

      {/* 로드뷰 버튼 */}
      <MapLoadviewButton onLoadviewToggle={onToggleLoadview} isActive={isLoadviewActive} />
    </div>
  );
};

export default MapTopRightButtons;
