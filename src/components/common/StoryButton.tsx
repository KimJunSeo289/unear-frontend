type StoryButtonProps = {
  text: string;
  onClick?: () => void;
};

export default function StoryButton({ text, onClick }: StoryButtonProps) {
  return (
    <div className="relative w-[221px] h-[45px] cursor-pointer select-none group" onClick={onClick}>
      {/* 배경 박스 */}
      <div className="absolute left-0 top-0 w-[221px] h-[45px] rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-200" />

      {/* 텍스트: 스타일 변경 */}
      <p
        className="absolute top-1/2 left-1/2 w-[129px] text-lm font-bold text-center text-black
                   -translate-x-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {text}
      </p>
    </div>
  );
}
