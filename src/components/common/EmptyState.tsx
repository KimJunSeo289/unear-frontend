import emptyImage from '@/assets/common/emptynubi.png';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = '현재 표시할 내용이 없어요' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <img
        src={emptyImage}
        alt="empty-state"
        className="object-cover"
        style={{ width: 222, height: 222 }}
      />
      <p className="text-lg font-semibold text-black text-center whitespace-pre-line">{message}</p>
    </div>
  );
}
