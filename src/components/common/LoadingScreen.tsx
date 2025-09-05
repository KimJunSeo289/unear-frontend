import LoadingSpinner from './LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  fullHeight?: boolean;
  className?: string;
}

const LoadingScreen = ({
  message = '로딩 중...',
  size = 'lg',
  color = 'primary',
  fullHeight = true,
  className = '',
}: LoadingScreenProps) => {
  // 높이 설정 - fullHeight가 true면 전체 화면, false면 컨테이너에 맞춤
  const heightClass = fullHeight
    ? 'min-h-[calc(100vh-105px)]' // 헤더(40px) + 바텀네비(65px) 제외
    : 'min-h-[200px]';

  return (
    <div
      className={`
      flex 
      flex-col 
      items-center 
      justify-center 
      ${heightClass}
      ${className}
    `}
    >
      <LoadingSpinner size={size} color={color} />
      {message && (
        <p className="mt-4 text-sm font-regular text-gray-600 text-center px-4">{message}</p>
      )}
    </div>
  );
};

export default LoadingScreen;

/*
사용법:

1. 기본 전체 화면 로딩 (핑크색 큰 스피너):
<LoadingScreen />

2. 커스텀 메시지:
<LoadingScreen message="데이터를 불러오는 중..." />

3. 작은 영역에서 사용:
<LoadingScreen fullHeight={false} message="전송 중..." size="md" />

4. 크기 지정:
<LoadingScreen size="xl" message="처리 중..." />

5. 메시지 없이:
<LoadingScreen message="" />

6. 커스텀 스타일:
<LoadingScreen className="bg-gray-50 rounded-lg" fullHeight={false} />

*/
