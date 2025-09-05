import LoadingSpinner from './LoadingSpinner';

type ActionProps = {
  text: string;
  onClick: () => void;
  isActive?: boolean;
  isLoading?: boolean;
};

export default function ActionButton({
  text,
  onClick,
  isActive = false,
  isLoading = false,
}: ActionProps) {
  const backgroundColorClass =
    isActive && !isLoading ? 'bg-primary hover:bg-pink-500' : 'bg-gray-200';

  return (
    <button
      className={`w-full h-[50px] rounded-xl flex items-center justify-center text-base font-semibold text-white transition-colors duration-200 ${backgroundColorClass}`}
      onClick={() => {
        if (isActive && !isLoading) {
          onClick();
        }
      }}
      disabled={!isActive || isLoading}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && <LoadingSpinner size="sm" color="white" />}
        <span>{text}</span>
      </div>
    </button>
  );
}
