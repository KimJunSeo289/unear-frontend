import StoreTypeIcon from '@/components/common/StoreTypeIcon';
import { formatDateToKorean } from '@/utils/formatDate';

export interface CouponCardProps {
  brand: string;
  title: string;
  validUntil: string;
  category:
    | 'CAFE'
    | 'FOOD'
    | 'SHOPPING'
    | 'EDUCATION'
    | 'CULTURE'
    | 'BAKERY'
    | 'BEAUTY'
    | 'LIFE'
    | 'ACTIVITY'
    | 'POPUP'
    | null;
  storeClass: 'FRANCHISE' | 'LOCAL' | 'BASIC';
  onClick?: () => void;
}

const CouponCard = ({
  brand,
  title,
  validUntil,
  category,
  storeClass,
  onClick,
}: CouponCardProps) => {
  const fallbackCategory = category ?? 'POPUP';
  return (
    <div
      className="relative w-full h-[107px] drop-shadow-[0_0px_10px_rgba(0,0,0,0.15)] cursor-pointer"
      onClick={onClick}
    >
      {/* CSS로 만든 쿠폰 모양 - 원형 고정 크기 */}
      <div
        className="w-full h-full bg-white rounded-lg relative"
        style={{
          maskImage: `
            radial-gradient(circle 16px at 0px 50%, transparent 16px, white 16px),
            radial-gradient(circle 16px at 100% 50%, transparent 16px, white 16px)
          `,
          maskComposite: 'intersect',
          WebkitMaskImage: `
            radial-gradient(circle 16px at 0px 50%, transparent 16px, white 16px),
            radial-gradient(circle 16px at 100% 50%, transparent 16px, white 16px)
          `,
          WebkitMaskComposite: 'source-in',
        }}
      >
        {/* 컨텐츠 영역 */}
        <div className="absolute inset-0 flex items-center h-full pl-4">
          {/* 왼쪽 아이콘 영역 */}
          <div className="flex items-center justify-center w-16 h-full">
            <StoreTypeIcon
              category={fallbackCategory}
              storeClass={storeClass}
              size={48}
              shape="square"
            />
          </div>

          {/* 세로 점선 */}
          <div className="h-[70%] border-l-2 border-dashed border-gray-300 mx-3" />

          {/* 오른쪽 텍스트 영역 */}
          <div className="flex-1 flex flex-col justify-center gap-1 h-full pr-4">
            {/* 브랜드명 */}
            <p className="text-s font-regular text-black">{brand}</p>

            {/* 쿠폰 타이틀 */}
            <p className="text-sm font-semibold text-black break-words leading-snug">{title}</p>

            {/* 유효기한 */}
            <p className="text-s font-regular text-gray-400">
              {formatDateToKorean(validUntil)}까지
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
