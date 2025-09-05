// 버튼의 props 타입을 정의합니다.
type MiniButtonProps = {
  text: string; // 버튼 안에 표시될 텍스트
  onClick: () => void; // 버튼 클릭 시 실행할 함수
  isActive?: boolean; // 버튼의 활성/비활성 상태를 나타내는 불리언 값 (선택적, 기본값은 false)
  widthClass?: string; // width  (선택)
  heightClass?: string; // height  (선택)
  disabled?: boolean;
};

// MiniButton 컴포넌트를 정의합니다.
export default function MiniButton({
  text,
  onClick,
  isActive = false, // 기본값을 false로 설정
  widthClass = 'w-[121px]',
  heightClass = 'h-[23px]',
}: MiniButtonProps) {
  // isActive 상태에 따라 배경색을 결정하는 클래스
  const backgroundColorClass = isActive ? 'bg-primary' : 'bg-gray-200/80';

  return (
    <div
      className={`flex justify-center py-[14px] items-center overflow-hidden px-8 rounded-xl ${widthClass} ${heightClass} ${backgroundColorClass}`}
      style={{ boxShadow: '0px 4px 16px 0 black/20' }}
    >
      <button
        className="flex justify-center pt-[2px] items-start flex-grow-0 flex-shrink-0 relative text-base font-bold text-center text-white"
        onClick={() => {
          if (isActive) {
            onClick();
          }
        }}
        disabled={!isActive} // isActive가 false일 때 버튼을 비활성화합니다.
      >
        {text}
      </button>
    </div>
  );
}
