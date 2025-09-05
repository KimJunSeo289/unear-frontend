type FilterButtonProps = {
  text: string;
  onClick?: () => void; // 선택적 onClick prop
  isActive?: boolean;
};

export default function FilterButton({ text, onClick, isActive }: FilterButtonProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="w-20 h-[33px] relative cursor-pointer select-none" onClick={handleClick}>
      <div
        className={`w-20 h-[33px] absolute left-[-1px] top-[-1px] rounded-lg bg-white border ${
          isActive ? 'border-primary' : 'border-zinc-400'
        }`}
      />
      <p
        className={`w-[71.35px] absolute left-[4.32px] top-[7px] text-sm text-center ${
          isActive ? 'text-primary' : 'text-black'
        }`}
      >
        {text}
      </p>
    </div>
  );
}
