type ConfirmButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function ConfirmButton({ text, onClick }: ConfirmButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[68px] h-[21px] bg-primary hover:bg-pink-500 rounded flex items-center justify-center transition-colors duration-200"
    >
      <span className="text-[10px] font-semibold text-white leading-none">{text}</span>
    </button>
  );
}
