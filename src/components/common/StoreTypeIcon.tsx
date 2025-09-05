import CoffeeIcon from '@/assets/common/coffee.svg?react';
import FoodIcon from '@/assets/common/food.svg?react';
import ShoppingIcon from '@/assets/common/shopping.svg?react';
import BookIcon from '@/assets/common/book.svg?react';
import CultureIcon from '@/assets/common/culture.svg?react';
import BreadIcon from '@/assets/common/bread.svg?react';
import BeautyIcon from '@/assets/common/beauty.svg?react';
import LifeIcon from '@/assets/common/life.svg?react';
import ActivityIcon from '@/assets/common/activity.svg?react';
import StoreIcon from '@/assets/common/store.svg?react';

// 카테고리 타입 정의 (백엔드 PLACE_CATEGORY에 맞춤)
export type CategoryType =
  | 'FOOD' // 푸드
  | 'ACTIVITY' // 액티비티
  | 'EDUCATION' // 교육
  | 'CULTURE' // 문화/여가
  | 'BAKERY' // 베이커리
  | 'LIFE' // 생활/편의
  | 'SHOPPING' // 쇼핑
  | 'CAFE' // 카페
  | 'BEAUTY' // 뷰티/건강
  | 'POPUP'; // 팝업스토어

// 매장 구분 타입 정의 (백엔드 PLACE_TYPE에 맞춤)
export type StoreClassType =
  | 'LOCAL' // 우리동네멤버십(소상공인)
  | 'FRANCHISE' // 프랜차이즈
  | 'BASIC'; // 기본 (프랜차이즈와 동일한 효과)

// 이벤트 타입 정의 (백엔드 EVENT_TYPE에 맞춤)
export type EventType =
  | 'NONE' // 이벤트 아님
  | 'GENERAL' // 이벤트 (일반)
  | 'REQUIRE'; // 이벤트 (필수)

// 모드 타입 정의
type ModeType = 'store' | 'statistics';

// 모양 타입 정의
type ShapeType = 'square' | 'circle';

// Props 인터페이스 정의
interface StoreTypeIconProps {
  category: CategoryType;
  storeClass: StoreClassType;
  event?: EventType;
  size?: number;
  className?: string;
  mode?: ModeType;
  shape?: ShapeType;
}

// 카테고리별 아이콘 컴포넌트 매핑
const categoryIconMap: Record<CategoryType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  CAFE: CoffeeIcon,
  FOOD: FoodIcon,
  SHOPPING: ShoppingIcon,
  EDUCATION: BookIcon,
  CULTURE: CultureIcon,
  BAKERY: BreadIcon,
  BEAUTY: BeautyIcon,
  LIFE: LifeIcon,
  ACTIVITY: ActivityIcon,
  POPUP: StoreIcon,
};

const StoreTypeIcon: React.FC<StoreTypeIconProps> = ({
  category,
  storeClass,
  event = 'NONE',
  size = 50,
  className = '',
  mode = 'store',
  shape = 'square',
}) => {
  // 아이콘 컴포넌트 반환
  const getIconComponent = () => {
    const IconComponent = categoryIconMap[category];
    if (!IconComponent) {
      return StoreIcon;
    }
    return IconComponent;
  };

  // 매장 모드 색상 클래스 반환
  const getStoreColorClass = (): string => {
    // 이벤트가 있는 경우 우선적으로 처리
    if (event === 'REQUIRE') {
      return 'text-pink-400'; // 필수 이벤트는 pink-400
    }
    if (event === 'GENERAL') {
      return 'text-primary'; // 일반 이벤트는 핑크색 (이벤트 매장)
    }

    // 매장 구분에 따른 색상
    switch (storeClass) {
      case 'FRANCHISE':
      case 'BASIC':
        return 'text-orange-500'; // 프랜차이즈/기본 - 주황색
      case 'LOCAL':
        return 'text-blue-500'; // 소상공인 - 파란색
      default:
        return 'text-black';
    }
  };

  // 통계 모드 색상 클래스 반환 (카테고리별)
  const getStatisticsColorClass = (): string => {
    switch (category) {
      case 'CAFE':
        return 'text-amber-700';
      case 'FOOD':
        return 'text-red-500';
      case 'SHOPPING':
        return 'text-blue-500';
      case 'EDUCATION':
        return 'text-green-500';
      case 'CULTURE':
        return 'text-violet-500';
      case 'BAKERY':
        return 'text-orange-500';
      case 'BEAUTY':
        return 'text-pink-500';
      case 'LIFE':
        return 'text-gray-500';
      case 'ACTIVITY':
        return 'text-teal-500';
      case 'POPUP':
        return 'text-fuchsia-500';
      default:
        return 'text-black';
    }
  };

  // 모드에 따른 색상 클래스 반환
  const getColorClass = (): string => {
    return mode === 'store' ? getStoreColorClass() : getStatisticsColorClass();
  };

  // 모양에 따른 border radius 클래스 반환
  const getShapeClass = (): string => {
    return shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  };

  // 배경 색상은 기본 회색으로 통일
  const getBackgroundClass = (): string => {
    return 'bg-gray-100';
  };

  const IconComponent = getIconComponent();
  const colorClass = getColorClass();
  const shapeClass = getShapeClass();
  const backgroundClass = getBackgroundClass();

  return (
    <div
      className={`flex items-center justify-center ${backgroundClass} ${shapeClass} ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div className={`w-[18px] h-[18px] flex items-center justify-center ${colorClass}`}>
        <IconComponent
          width={18}
          height={18}
          className={`w-full h-full ${
            category === 'ACTIVITY' ? 'fill-none stroke-current stroke-[1.2]' : 'fill-current'
          }`}
        />
      </div>
    </div>
  );
};

export default StoreTypeIcon;
