import { useEffect, useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import FilterButton from '@/components/common/FilterButton';
import MiniButton from '@/components/common/MiniButton';

interface BottomSheetFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (categories: string[], benefits: string[]) => void;
  selectedCategoryCodes: string[];
  selectedBenefitCategories: string[];
}

const reverseCategoryCode = (code: string): string => {
  const map: Record<string, string> = {
    CAFE: '카페',
    FOOD: '푸드',
    SHOPPING: '쇼핑',
    EDUCATION: '교육',
    CULTURE: '문화/여가',
    BAKERY: '베이커리',
    BEAUTY: '뷰티/건강',
    LIFE: '생활/편의',
    ACTIVITY: '액티비티',
  };
  return map[code] ?? '';
};

const mapCategoryCode = (name: string): string | null => {
  const map: Record<string, string> = {
    카페: 'CAFE',
    푸드: 'FOOD',
    쇼핑: 'SHOPPING',
    교육: 'EDUCATION',
    '문화/여가': 'CULTURE',
    베이커리: 'BAKERY',
    '뷰티/건강': 'BEAUTY',
    '생활/편의': 'LIFE',
    액티비티: 'ACTIVITY',
  };
  return map[name] ?? null;
};
const CATEGORY_LIST = [
  '전체',
  '카페',
  '푸드',
  '쇼핑',
  '교육',
  '문화/여가',
  '베이커리',
  '뷰티/건강',
  '생활/편의',
  '액티비티',
];
const BENEFIT_LIST = ['전체', '할인', '적립', '무료서비스', '상품 증정'];

export default function BottomSheetFilter({
  isOpen,
  onClose,
  onApply,
  selectedCategoryCodes,
  selectedBenefitCategories,
}: BottomSheetFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const toggleSelection = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (value === '전체') {
      setList(['전체']);
    } else {
      const newList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list.filter((item) => item !== '전체'), value];

      setList(newList.length > 0 ? newList : ['전체']);
    }
  };

  const isSelected = (value: string, list: string[]) => list.includes(value);

  const handleReset = () => {
    setSelectedCategories(['전체']);
    setSelectedBenefits(['전체']);
  };

  const handleApply = () => {
    const mappedCategories = selectedCategories.includes('전체')
      ? []
      : (selectedCategories.map(mapCategoryCode).filter(Boolean) as string[]);

    const mappedBenefits = selectedBenefits.includes('전체') ? [] : [...selectedBenefits];

    onApply(mappedCategories, mappedBenefits);
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      setSelectedCategories(
        selectedCategoryCodes.length === 0
          ? ['전체']
          : selectedCategoryCodes.map(reverseCategoryCode)
      );

      setSelectedBenefits(
        selectedBenefitCategories.length === 0 ? ['전체'] : [...selectedBenefitCategories]
      );
    }
  }, [isOpen, selectedCategoryCodes, selectedBenefitCategories]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8 pt-3">
        {/* 업종 선택 */}
        <section>
          <p className="text-lm font-semibold mb-2.5">업종 선택</p>
          <div className="flex flex-wrap gap-[11px]">
            {CATEGORY_LIST.map((item) => (
              <FilterButton
                key={item}
                text={item}
                onClick={() => toggleSelection(item, selectedCategories, setSelectedCategories)}
                isActive={isSelected(item, selectedCategories)}
              />
            ))}
          </div>
        </section>

        {/* 혜택 유형 */}
        <section>
          <p className="text-lm font-semibold mb-2.5">혜택 유형</p>
          <div className="flex flex-wrap gap-[11px]">
            {BENEFIT_LIST.map((item) => (
              <FilterButton
                key={item}
                text={item}
                onClick={() => toggleSelection(item, selectedBenefits, setSelectedBenefits)}
                isActive={isSelected(item, selectedBenefits)}
              />
            ))}
          </div>
        </section>

        {/* 버튼 */}
        <div className="flex flex-col items-center gap-3">
          <MiniButton
            text="필터 적용하기"
            onClick={handleApply}
            isActive
            widthClass="w-[150px]"
            heightClass="h-[32px]"
          />
          <button onClick={handleReset} className="text-sm font-semibold text-black underline">
            초기화
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
