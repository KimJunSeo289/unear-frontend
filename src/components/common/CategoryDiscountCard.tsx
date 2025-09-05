import type React from 'react';
import StoreTypeIcon from '@/components/common/StoreTypeIcon';
import type { CategoryType } from '@/components/common/StoreTypeIcon';

interface CategoryDiscountCardProps {
  category: CategoryType;
  categoryName: string;
  discountPercentage: number;
  discountAmount: number;
  className?: string;
}

const CategoryDiscountCard: React.FC<CategoryDiscountCardProps> = ({
  category,
  categoryName,
  discountPercentage,
  discountAmount,
  className = '',
}) => {
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('ko-KR')}원`;
  };

  return (
    <div
      className={`
        relative
        w-full
        h-[69px]
        bg-white
        ${className}
      `}
    >
      {/* 카테고리 아이콘 */}
      <div className="absolute left-[11px] top-[9px]">
        <StoreTypeIcon
          category={category}
          storeClass="FRANCHISE"
          size={50}
          mode="statistics"
          shape="circle"
        />
      </div>

      {/* 카테고리 이름 */}
      <div className="absolute left-[76px] top-[15px]">
        <span className="font-semibold text-m text-black">{categoryName}</span>
      </div>

      {/* 할인율 */}
      <div className="absolute left-[76px] top-[36px]">
        <span className="font-regular text-m text-gray-500">{discountPercentage}%</span>
      </div>

      {/* 할인 금액 */}
      <div className="absolute right-[11px] top-[24px]">
        <span className="font-semibold text-lm text-black">{formatCurrency(discountAmount)}</span>
      </div>
    </div>
  );
};

export default CategoryDiscountCard;

/*
[Props 정보]

- category: 카테고리 코드 문자열 (CategoryType)
  └ 'FOOD' | 'ACTIVITY' | 'EDUCATION' | 'CULTURE' | 'BAKERY' | 'LIFE'
    | 'SHOPPING' | 'CAFE' | 'BEAUTY' | 'POPUP'

categoryName: 사용자에게 보여줄 카테고리 이름 (string)
discountPercentage: 할인율 (숫자, 예: 35 → "35%")
discountAmount: 할인 금액 (숫자, 예: 12500 → "12,500원")
className: 추가 스타일 클래스 (선택)

- 사용법
<CategoryDiscountCard
  category="FOOD"
  categoryName="외식"
  discountPercentage={42}
  discountAmount={8904}
/>

<CategoryDiscountCard
  category="SHOPPING"
  categoryName="쇼핑"
  discountPercentage={28}
  discountAmount={15600}
  className="border-2 border-primary"
/>
*/
