import type React from 'react';
import IconStarOutline from '@/assets/common/iconStarOutline.svg?react';
import IconStarFilled from '@/assets/common/iconStarFilled.svg?react';

interface BookmarkStarProps {
  isBookmarked: boolean;
  onToggle: (isBookmarked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BookmarkStar: React.FC<BookmarkStarProps> = ({
  isBookmarked,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const handleClick = () => {
    onToggle(!isBookmarked);
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'; // 16px
      case 'md':
        return 'w-6 h-6'; // 24px
      case 'lg':
        return 'w-8 h-8'; // 32px
      default:
        return 'w-6 h-6';
    }
  };

  const sizeClasses = getSizeClasses(size);
  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex
        items-center
        justify-center
        duration-200
        active:scale-95
        ${className}
      `}
      aria-label={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      type="button"
    >
      {isBookmarked ? (
        <IconStarFilled className={`${sizeClasses} text-yellow-400`} />
      ) : (
        <IconStarOutline className={`${sizeClasses} text-gray-300`} />
      )}
    </button>
  );
};

export default BookmarkStar;

{
  /*
  - 기본 사용 형식
  <BookmarkStar isBookmarked={false} onToggle={(next) => console.log(next)} />
  <BookmarkStar isBookmarked={true} onToggle={(next) => console.log(next)} />

  - 사이즈 지정 가능 (기본값: 'md')
  <BookmarkStar isBookmarked={false} onToggle={...} size="sm" />
  <BookmarkStar isBookmarked={true} onToggle={...} size="md" />
  <BookmarkStar isBookmarked={false} onToggle={...} size="lg" />

  - Tailwind를 통한 커스텀도 가능
  <BookmarkStar
    isBookmarked={true}
    onToggle={...}
    className="scale-90 shadow-md"
  />

  - 매장 아이디별 즐겨찾기 상태를 관리하는 예시
  <BookmarkStar
    isBookmarked={bookmarkStatus['store1']}
    onToggle={(next) => setBookmarkStatus(prev => ({ ...prev, store1: next }))}
  />
  */
}
