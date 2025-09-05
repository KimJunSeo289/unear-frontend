import CategoryDiscountCard from '@/components/common/CategoryDiscountCard';
import BackIcon from '@/assets/common/backIcon.svg?react';
import type { CalculatedCategoryData } from '@/hooks/my/statistics';

// 더보기 애니메이션
import './animations.css';

interface CategoryDiscountListProps {
  calculatedCategoryData: CalculatedCategoryData[];
  currentMonth: number;
  showAllCategories: boolean;
  onToggleCategories: () => void;
  onCardClick: (category: string, percentage: number, categoryName: string) => void;
  shouldBeTransparent: (category: string) => boolean;
}

const CategoryDiscountList = ({
  calculatedCategoryData,
  currentMonth,
  showAllCategories,
  onToggleCategories,
  onCardClick,
  shouldBeTransparent,
}: CategoryDiscountListProps) => {
  const handleCardClick = (item: CalculatedCategoryData) => {
    onCardClick(item.category, item.discountPercentage, item.categoryName);
  };

  return (
    <div className="bg-white overflow-visible">
      <div className="px-3 pb-1">
        <div className="space-y-1 overflow-visible">
          {calculatedCategoryData.length > 0 ? (
            <>
              {/* 처음 3개 카테고리 (항상 표시) */}
              {calculatedCategoryData.slice(0, 3).map((item, index) => (
                <div
                  key={`${currentMonth}-${index}`}
                  className={`transform transition-all duration-300 ease-out cursor-pointer relative z-10 ${
                    shouldBeTransparent(item.category) ? 'opacity-50' : 'opacity-100'
                  }`}
                  onClick={() => handleCardClick(item)}
                  data-category-card
                  style={{
                    marginBottom: index === 2 ? '8px' : '4px', // 간격 좁히기
                    padding: '4px', // 그림자를 위한 여백
                  }}
                >
                  <CategoryDiscountCard
                    category={item.category}
                    categoryName={item.categoryName}
                    discountPercentage={item.discountPercentage}
                    discountAmount={item.discountAmount}
                    className="mx-auto rounded-lg hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
                  />
                </div>
              ))}

              {/* 4번째 이후 카테고리 (더보기용) */}
              {calculatedCategoryData.length > 3 && (
                <div
                  className={`
                    space-y-1 
                    ${showAllCategories ? 'expand-height' : 'collapse-height'}
                  `}
                  style={{ paddingBottom: showAllCategories ? '16px' : '0px' }} // 확장 시 추가 여백
                >
                  {calculatedCategoryData.slice(3).map((item, index) => (
                    <div
                      key={`${currentMonth}-extra-${index}`}
                      className={`transform transition-all duration-300 ease-out cursor-pointer relative z-10 ${
                        shouldBeTransparent(item.category) ? 'opacity-50' : 'opacity-100'
                      }`}
                      style={{
                        transitionDelay: showAllCategories ? `${index * 100}ms` : '0ms',
                        marginBottom:
                          index === calculatedCategoryData.slice(3).length - 1 ? '8px' : '4px', // 간격 좁히기
                        padding: '4px', // 그림자를 위한 여백
                      }}
                      onClick={() => handleCardClick(item)}
                      data-category-card
                    >
                      <CategoryDiscountCard
                        category={item.category}
                        categoryName={item.categoryName}
                        discountPercentage={item.discountPercentage}
                        discountAmount={item.discountAmount}
                        className="mx-auto rounded-lg hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">할인 내역이 없습니다.</p>
            </div>
          )}
        </div>
        {/* 더보기 버튼 */}
        {calculatedCategoryData.length > 3 && (
          <div className="flex items-center justify-center pb-2">
            {' '}
            {/* pb-1 -> pb-2로 증가 */}
            <button
              className="flex items-center transition-all duration-300 ease-out hover:scale-105 relative z-20"
              onClick={onToggleCategories}
              data-toggle-button
            >
              <span className="text-m font-semibold text-black mr-2">
                {showAllCategories ? '접기' : '더보기'}
              </span>
              <BackIcon
                className={`
                  w-5 h-5 transform transition-transform duration-300 ease-out mb-2
                  ${showAllCategories ? 'rotate-90 mt-[10px]' : '-rotate-90'}
                `}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDiscountList;
