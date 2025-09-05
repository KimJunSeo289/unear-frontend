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

// 카테고리 타입 정의 (백엔드 categoryCode에 맞춤)
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

// 매장 구분 타입 정의 (백엔드 markerCode에 맞춤)
export type StoreClassType =
  | 'LOCAL' // 우리동네멤버십(소상공인)
  | 'FRANCHISE' // 프랜차이즈
  | 'BASIC'; // 기본 (프랜차이즈와 동일한 효과)

// 이벤트 타입 정의 (백엔드 eventCode에 맞춤)
export type EventType =
  | 'NONE' // 이벤트 아님
  | 'GENERAL' // 이벤트 (일반)
  | 'REQUIRE'; // 이벤트 (필수)

// Props 인터페이스 정의
interface MapMarkerIconProps {
  category: CategoryType;
  storeClass: StoreClassType;
  event?: EventType;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
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

const MapMarkerIcon: React.FC<MapMarkerIconProps> = ({
  category,
  storeClass,
  event = 'NONE',
  isSelected = false,
  onClick,
  className = '',
}) => {
  // 아이콘 컴포넌트 반환
  const getIconComponent = () => {
    return categoryIconMap[category];
  };

  // 배경 색상 클래스 반환 (이벤트 우선순위 적용)
  const getBackgroundColorClass = (): string => {
    // 이벤트가 있는 경우 우선적으로 처리
    if (event === 'REQUIRE') {
      return 'bg-pink-400'; // 필수 이벤트는 pink-400
    }
    if (event === 'GENERAL') {
      return 'bg-primary'; // 일반 이벤트는 핑크색 (이벤트 매장)
    }

    // 매장 구분에 따른 색상
    switch (storeClass) {
      case 'FRANCHISE':
      case 'BASIC':
        return 'bg-orange-500'; // 프랜차이즈/기본 - 주황색
      case 'LOCAL':
        return 'bg-blue-500'; // 소상공인 - 파란색
      default:
        return 'bg-gray-500';
    }
  };

  // 크기 계산 (필수 이벤트는 더 크게)
  const getSize = () => {
    const isRequireEvent = event === 'REQUIRE';

    if (isRequireEvent) {
      return isSelected ? { container: 42, icon: 18 } : { container: 35, icon: 15 };
    }
    return isSelected ? { container: 30, icon: 13 } : { container: 25, icon: 11 };
  };

  // 아이콘 색상 클래스 반환
  const getIconColorClass = (): string => {
    return isSelected ? 'text-black' : 'text-white';
  };

  const IconComponent = getIconComponent();
  const backgroundColorClass = getBackgroundColorClass();
  const iconColorClass = getIconColorClass();
  const size = getSize();

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        rounded-full
        transition-all duration-300 ease-in-out
        transform
        hover:scale-105
        active:scale-95
        cursor-pointer
        ${backgroundColorClass}
        ${className}
      `}
      style={{
        width: size.container,
        height: size.container,
      }}
    >
      <div
        className={`flex items-center justify-center ${iconColorClass} transition-all duration-300 ${
          category === 'CAFE' ? 'transform translate-x-[5%]' : ''
        }`}
        style={{
          width: size.icon,
          height: size.icon,
        }}
      >
        <IconComponent
          width={size.icon}
          height={size.icon}
          className={`w-full h-full transition-all duration-300 ${
            category === 'ACTIVITY' ? 'fill-none stroke-current stroke-[1.2]' : 'fill-current'
          }`}
        />
      </div>
    </button>
  );
};

export default MapMarkerIcon;

/*
사용법 (백엔드 API 스펙에 맞춤):

기본 마커 (프랜차이즈 카페):
<MapMarkerIcon category="CAFE" storeClass="FRANCHISE" event="NONE" />

팝업스토어 카테고리:
<MapMarkerIcon category="POPUP" storeClass="BASIC" event="NONE" />

기본 매장:
<MapMarkerIcon category="FOOD" storeClass="BASIC" event="NONE" />

소상공인 음식점:
<MapMarkerIcon category="FOOD" storeClass="LOCAL" event="NONE" />

일반 이벤트 매장 (이벤트 매장 - 핑크색):
<MapMarkerIcon category="SHOPPING" storeClass="FRANCHISE" event="GENERAL" />

필수 이벤트 매장 (더 큰 크기 + pink-400):
<MapMarkerIcon category="CAFE" storeClass="LOCAL" event="REQUIRE" />

선택된 상태:
<MapMarkerIcon 
  category="FOOD" 
  storeClass="LOCAL" 
  event="NONE"
  isSelected={selectedId === 'marker1'}
  onClick={() => setSelectedId('marker1')} 
/>

상위에서 선택 상태 관리 예시:
const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

const handleMarkerClick = (markerId: string) => {
  setSelectedMarkerId(selectedMarkerId === markerId ? null : markerId);
};

Props:
- category: 카테고리 (FOOD, ACTIVITY, EDUCATION, CULTURE, BAKERY, LIFE, SHOPPING, CAFE, BEAUTY, POPUP)
- storeClass: 매장 구분 (LOCAL, FRANCHISE, BASIC)
- event: 이벤트 타입 (NONE, GENERAL, REQUIRE) - 선택적, 기본값: NONE
- isSelected: 선택 상태 (기본값: false) - 크기와 아이콘 색상에 영향
- onClick: 클릭 이벤트 핸들러
- className: 추가 CSS 클래스

색상 규칙:
- 이벤트 우선순위:
  * REQUIRE 이벤트: pink-400 + 더 큰 크기
  * GENERAL 이벤트: 핑크색 (bg-primary) - 이벤트 매장
- 매장 구분:
  * FRANCHISE/BASIC: 주황색 (bg-orange-500)
  * LOCAL: 파란색 (bg-blue-500) - 소상공인

특징:
- StoreTypeIcon과 동일한 색상 규칙 적용
- 필수 이벤트(REQUIRE)는 크기가 더 큼
- 팝업스토어는 카테고리로 분류되어 Store 아이콘 사용
- 부드러운 애니메이션 효과 (300ms 전환)
- 호버 및 클릭 피드백 효과
*/
