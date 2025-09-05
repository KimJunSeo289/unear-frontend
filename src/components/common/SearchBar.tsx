import React, { useState } from 'react';
import SearchIcon from '@/assets/common/search.svg?react';

// Props 인터페이스 정의
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '검색어를 입력하세요',
  value,
  onChange,
  onSearch,
  className = '',
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState('');

  // 제어 컴포넌트인지 비제어 컴포넌트인지 판단
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch && inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={
            `w-full h-[46px] pl-4 pr-12 ` +
            `border-2 border-gray-400 rounded-[12px] ` +
            `text-m font-regular placeholder-gray-500 ` +
            `focus:outline-none focus:border-primary ` +
            `disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ` +
            `transition-colors duration-200`
          }
        />

        {/* 검색 아이콘 버튼 */}
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className={
            `absolute right-3 top-1/2 transform -translate-y-1/2 ` +
            `w-6 h-6 flex items-center justify-center ` +
            `text-gray-500 hover:text-primary ` +
            `disabled:text-gray-300 disabled:cursor-not-allowed ` +
            `transition-colors duration-200`
          }
          aria-label="검색"
        >
          <SearchIcon width={20} height={20} className="w-full h-full fill-current" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

/*
사용법:

기본 사용법 (비제어 컴포넌트):
<SearchBar 
  placeholder="검색어를 입력하세요" 
  onSearch={(value) => console.log('검색:', value)} 
/>

제어 컴포넌트:
<SearchBar 
  value={searchValue}
  onChange={setSearchValue}
  onSearch={handleSearch}
  placeholder="매장명을 검색하세요"
/>

비활성화:
<SearchBar disabled={true} />

Props:
- placeholder: 입력 필드 플레이스홀더 텍스트 (기본값: "검색어를 입력하세요")
- value: 제어 컴포넌트로 사용할 때의 값
- onChange: 입력값 변경 시 호출되는 함수
- onSearch: 검색 실행 시 호출되는 함수 (Enter 키 또는 아이콘 클릭)
- className: 추가 CSS 클래스
- disabled: 비활성화 상태

특징:
- w-full로 반응형 지원 (부모 컨테이너의 padding/margin에 맞춰 조절)
- 제어/비제어 컴포넌트 모두 지원
- Enter 키 및 아이콘 클릭으로 검색 실행
- Focus 상태에서 테두리 색상 변경 (primary 색상)
- 접근성 지원 (aria-label)
- 부드러운 애니메이션 효과
- 텍스트 크기: text-sm (14px)
- 텍스트 세로 가운데 정렬
*/
