interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) => {
  // 크기별 클래스 매핑 - Tailwind 기본 클래스만 사용
  const sizeClasses = {
    sm: 'h-4 w-4 border-2', // 16px - 무한스크롤, 버튼 내부
    md: 'h-8 w-8 border-2', // 32px - 일반 로딩
    lg: 'h-12 w-12 border-2', // 48px - 페이지 로딩
    xl: 'h-16 w-16 border-4', // 64px - OAuth 로그인
  };

  // 색상별 클래스 매핑 - primary는 핑크색 (#E6007E)
  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };

  return (
    <div
      className={`
        animate-spin 
        rounded-full 
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        ${className}
      `}
      aria-label="로딩 중"
      role="status"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};

export default LoadingSpinner;

/*
사용법:

1. 기본 사용 (핑크색 medium):
<LoadingSpinner />

2. 무한스크롤용 작은 스피너:
<LoadingSpinner size="sm" />

3. 페이지 로딩용 큰 스피너:
<LoadingSpinner size="lg" />

4. OAuth 로그인용 매우 큰 스피너:
<LoadingSpinner size="xl" />

5. 색상 지정:
<LoadingSpinner color="white" />

6. 커스텀 스타일:
<LoadingSpinner className="mx-auto" />
*/
