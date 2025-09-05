import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import CalendarIcon from '@/assets/my/calender.svg?react';
import ArrowIcon from '@/assets/common/arrowDownIcon.svg?react';
import '../statistics/animations.css'; // 애니메이션 CSS 임포트
import FilterButton from '@/components/common/FilterButton';

interface FilterOption {
  id: string;
  label: string;
  isActive: boolean;
}

interface UsageHistoryFilterProps {
  onFilterChange: (categoryFilter: string, periodFilter: string) => void;
}

const UsageHistoryFilter: React.FC<UsageHistoryFilterProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categoryOptions: FilterOption[] = [
    { id: 'all', label: '전체', isActive: selectedCategory === '전체' },
    { id: 'cafe', label: '카페', isActive: selectedCategory === '카페' },
    { id: 'food', label: '푸드', isActive: selectedCategory === '푸드' },
    { id: 'life', label: '생활/편의', isActive: selectedCategory === '생활/편의' },
    { id: 'shopping', label: '쇼핑', isActive: selectedCategory === '쇼핑' },
    { id: 'culture', label: '문화', isActive: selectedCategory === '문화' },
    { id: 'bakery', label: '베이커리', isActive: selectedCategory === '베이커리' },
    { id: 'activity', label: '액티비티', isActive: selectedCategory === '액티비티' },
    { id: 'education', label: '교육', isActive: selectedCategory === '교육' },
    { id: 'beauty', label: '뷰티/건강', isActive: selectedCategory === '뷰티/건강' },
    { id: 'popup', label: '팝업스토어', isActive: selectedCategory === '팝업스토어' },
  ];

  const periodOptions: FilterOption[] = [
    { id: 'all', label: '전체', isActive: selectedPeriod === '전체' },
    { id: 'week', label: '1주일', isActive: selectedPeriod === '1주일' },
    { id: 'month', label: '1개월', isActive: selectedPeriod === '1개월' },
    { id: 'quarter', label: '3개월', isActive: selectedPeriod === '3개월' },
    { id: 'year', label: '1년', isActive: selectedPeriod === '1년' },
  ];

  const handleCategorySelect = (option: FilterOption) => {
    setSelectedCategory(option.label);
    onFilterChange(option.label, selectedPeriod);
  };

  const handlePeriodSelect = (option: FilterOption) => {
    setSelectedPeriod(option.label);
    onFilterChange(selectedCategory, option.label);
  };

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white px-5 pt-3">
      {/* 필터 버튼 */}
      <button
        onClick={toggleExpanded}
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
        type="button"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" style={{ fill: 'none', stroke: 'currentColor' }} />
          <span className="text-sm font-semibold pt-[3px] text-black">
            {selectedPeriod} · {selectedCategory}
          </span>
        </div>
        <ArrowIcon
          className={`w-3 h-3 transform transition-transform duration-300 ease-out ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 필터 옵션들 - 애니메이션용 CSS 클래스 조건부 적용 */}
      <div className={`mt-3 space-y-6 ${isExpanded ? 'expand-height' : 'collapse-height'}`}>
        {/* 스와이프 가능한 카테고리 필터 */}
        <div>
          <h4 className="text-sm font-semibold text-black mb-2">카테고리</h4>
          <div className="-mx-5 pl-[1px]">
            <Swiper
              modules={[Mousewheel]}
              slidesPerView="auto"
              spaceBetween={12}
              mousewheel={{ forceToAxis: true }}
              slideToClickedSlide={true}
              className="!overflow-visible px-5"
              style={{ paddingLeft: '20px', paddingRight: '20px' }}
            >
              {categoryOptions.map((option) => (
                <SwiperSlide key={option.id} style={{ width: 'auto' }} className="!w-auto">
                  <FilterButton
                    text={option.label}
                    onClick={() => handleCategorySelect(option)}
                    isActive={option.isActive}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* 스와이프 가능한 날짜 필터 */}
        <div>
          <h4 className="text-sm font-semibold text-black mb-2">날짜</h4>
          <div className="-mx-5 pl-[1px]">
            <Swiper
              modules={[Mousewheel]}
              slidesPerView="auto"
              spaceBetween={12}
              mousewheel={{ forceToAxis: true }}
              slideToClickedSlide={true}
              className="!overflow-visible px-5"
              style={{ paddingLeft: '20px', paddingRight: '20px' }}
            >
              {periodOptions.map((option) => (
                <SwiperSlide key={option.id} style={{ width: 'auto' }} className="!w-auto">
                  <FilterButton
                    text={option.label}
                    onClick={() => handlePeriodSelect(option)}
                    isActive={option.isActive}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageHistoryFilter;
