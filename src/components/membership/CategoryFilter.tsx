import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';

type CategoryFilterProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const categories = [
  '전체',
  '푸드',
  '카페',
  '베이커리',
  '문화/여가',
  '생활/편의',
  '쇼핑',
  '액티비티',
  '뷰티/건강',
  '교육',
];

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full max-w-[600px] mx-auto px-5 overflow-hidden border-b border-gray-200">
      <Swiper
        modules={[Mousewheel]}
        slidesPerView="auto"
        spaceBetween={0}
        mousewheel={{ forceToAxis: true }}
        slideToClickedSlide={true}
        className="!overflow-visible mt-3"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <SwiperSlide key={category} style={{ width: 'auto' }} className="!w-auto">
              <button
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`relative pb-2 px-4 text-sm font-regular whitespace-nowrap 
  ${isSelected ? 'text-black' : 'text-gray-500'} hover:text-black`}
              >
                {category}
                <span
                  className={`absolute -bottom-[1px] left-0 right-0 h-[2.5px] transition-colors duration-200 ${
                    isSelected ? 'bg-black' : 'bg-transparent'
                  }`}
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
