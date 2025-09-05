interface BookmarkHeaderProps {
  totalCount: number;
}

const BookmarkHeader = ({ totalCount }: BookmarkHeaderProps) => {
  return (
    <div className="mb-4">
      <span className="text-lm font-bold text-black">즐겨찾기 {totalCount}개 매장</span>
    </div>
  );
};

export default BookmarkHeader;
