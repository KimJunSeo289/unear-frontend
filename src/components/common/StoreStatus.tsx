import type React from 'react';

export type StoreStatusType = '영업중' | '영업종료' | '필수 매장' | '이벤트 매장';

interface StoreStatusProps {
  status: StoreStatusType;
  className?: string;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ status, className = '' }) => {
  const getStatusStyles = (status: StoreStatusType) => {
    switch (status) {
      case '영업중':
        return {
          background: 'bg-green-100',
          text: 'text-green-600',
        };
      case '영업종료':
        return {
          background: 'bg-red-100',
          text: 'text-red-500',
        };
      case '필수 매장':
        return {
          background: 'bg-pink-100',
          text: 'text-primary',
        };
      case '이벤트 매장':
        return {
          background: 'bg-pink-100',
          text: 'text-primary',
        };
      default:
        return {
          background: 'bg-gray-100',
          text: 'text-gray-600',
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div
      className={`
        h-[20px]
        px-[12px]
        rounded-[12px]
        text-s
        leading-[16px]
        font-semibold
        inline-flex
        items-center
        justify-center
        ${styles.background}
        ${styles.text}
        ${className}
      `}
    >
      <span className="relative top-[1px]">{status}</span>
    </div>
  );
};

export default StoreStatus;

{
  /* 
  - 기본 사용 형식
  <StoreStatus status="영업중" />
  <StoreStatus status="영업종료" />
  <StoreStatus status="필수 매장" />
  <StoreStatus status="이벤트 매장" />

  - Tailwind를 통한 커스텀도 가능
  <StoreStatus status="영업종료" className="scale-90 shadow-md" />
*/
}
