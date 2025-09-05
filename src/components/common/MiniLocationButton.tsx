type MiniLocationButtonProps = {
  onClick?: () => void;
};

/**
 * MiniLocationButton 컴포넌트
 * - 작고 심플한 위치 보기 버튼
 * - 핫핑크 테두리와 아이콘 + 텍스트 구성
 * - 호버 시 배경 및 색상 강조
 */
export default function MiniLocationButton({ onClick }: MiniLocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[31.6px] relative rounded border border-primary 

                 flex items-center justify-center hover:bg-pink-50 transition-colors group"
    >
      <div className="flex items-center space-x-[4px]">
        <svg
          width={17}
          height={17}
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M9.5941 15.4423L15.0146 1.17303L1.85047 7.0486L6.70186 9.3023C7.06718 9.47209 7.35829 9.78764 7.51494 10.1836L9.5941 15.4423Z"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-primary stroke-primary group-hover:fill-pink-600 group-hover:stroke-pink-600 transition-colors duration-200"
          />
        </svg>
        <span className="text-s font-semibold text-primary group-hover:text-pink-600">
          위치 보기
        </span>
      </div>
    </button>
  );
}
