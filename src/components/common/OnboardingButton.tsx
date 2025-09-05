// 버튼의 props 타입을 정의합니다.
type OnboardingButtonProps = {
  text: string; // 버튼 안에 표시될 텍스트
  onClick: () => void; // 버튼 클릭 시 실행할 함수
  isActive?: boolean; // 버튼의 활성/비활성 상태를 나타내는 불리언 값 (선택적, 기본값은 false)
  widthClass?: string; // width  (선택)
  heightClass?: string; // height  (선택)
};

export default function OnboardingButton({
  text,
  onClick,
  isActive = false, // 기본값을 false로 설정
  widthClass = 'w-[150px]',
  heightClass = 'h-[40px]',
}: OnboardingButtonProps) {
  const backgroundColorClass = isActive ? 'bg-primary' : 'bg-gray-200/80';

  return (
    <div
      className={`flex justify-center items-center overflow-hidden px-8 rounded-lg ${widthClass} ${heightClass} ${backgroundColorClass}`}
      style={{ boxShadow: '0px 4px 16px 0 black/20' }}
    >
      <button
        className="flex justify-center items-start flex-grow-0 flex-shrink-0 relative text-base font-bold text-center text-white"
        onClick={() => {
          if (isActive) {
            onClick();
          }
        }}
        disabled={!isActive}
      >
        {text}
      </button>
    </div>
  );
}
