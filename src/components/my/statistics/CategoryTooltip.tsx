import type { CategoryHighlight } from '@/hooks/my/statistics/useCategoryHighlight';

interface CategoryTooltipProps {
  highlight: CategoryHighlight;
}

const CategoryTooltip = ({ highlight }: CategoryTooltipProps) => {
  if (!highlight.category || !highlight.position) return null;

  return (
    <div
      className="absolute z-50 bg-white rounded-lg px-3 py-2 shadow-lg pointer-events-none transform -translate-x-1/2"
      style={{
        left: highlight.position.x,
        top: highlight.position.y + 8, // 바 바로 아래 8px 떨어진 곳에 위치
      }}
    >
      <p className="text-m font-regular text-black whitespace-nowrap">{highlight.percentage}%</p>
      {/* 말풍선 꼬리 (위쪽을 향함) */}
      <div
        className="absolute left-1/2 bottom-full transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '6px solid white',
        }}
      />
    </div>
  );
};

export default CategoryTooltip;
