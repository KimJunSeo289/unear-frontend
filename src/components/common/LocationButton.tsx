type LocationButtonProps = {
  onClick?: () => void; // 버튼 클릭 시 실행할 함수
  width?: number | string;
};

/**
 * 위치 보기 버튼 컴포넌트
 * 버튼을 클릭하면 위치를 보여주는 동작을 수행할 수 있도록 설정됩니다.
 * 마우스 호버 시 배경색이 pink-50으로 변경되고 아이콘 및 텍스트 색상이 더 진한 핑크색으로 바뀝니다.
 */
const LocationButton: React.FC<LocationButtonProps> = ({ onClick, width }) => {
  // Tailwind에서 정적으로 인식 가능한 width 클래스만 분기 처리
  let buttonWidthClass = 'w-[146px]';

  if (width === 169) buttonWidthClass = 'w-[169px]';
  else if (width === 180) buttonWidthClass = 'w-[180px]';
  else if (width === 'w-full') buttonWidthClass = 'w-full';
  else if (typeof width === 'string') buttonWidthClass = width;

  return (
    <button
      className={`group ${buttonWidthClass} h-[46px] relative flex items-center justify-center bg-white 
                  hover:bg-pink-50 transition-colors duration-200 rounded-lg flex-shrink-0`}
      onClick={onClick}
    >
      {/* 버튼 외곽 박스 */}
      <div
        className="w-full h-[46px] absolute left-0 top-0 rounded-lg border border-primary
                   group-hover:border-pink-600 transition-colors duration-200"
      />

      {/* 내부 콘텐츠: SVG 아이콘과 텍스트 */}
      <div className="flex items-center justify-center space-x-2 relative z-10">
        <svg
          width={18}
          height={16}
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          preserveAspectRatio="none"
        >
          <path
            d="M9.91267 15L16.1516 1L0.999887 6.76471L6.58374 8.97588C7.00423 9.14247 7.33929 9.45207 7.51958 9.84059L9.91267 15Z"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-primary stroke-primary group-hover:fill-pink-600 group-hover:stroke-pink-600 transition-colors duration-200" // 호버 시 아이콘 색상 변경
          />
        </svg>

        <p className="text-base font-semibold text-primary group-hover:text-pink-600 transition-colors duration-200">
          위치 보기
        </p>
      </div>
    </button>
  );
};

export default LocationButton;
