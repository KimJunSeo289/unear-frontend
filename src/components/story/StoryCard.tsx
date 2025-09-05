interface StoryCardProps {
  imageSrc: string;
  date?: string;
  showDate?: boolean;
}

export default function StoryCard({ imageSrc, date, showDate = false }: StoryCardProps) {
  return (
    <div className="flex-shrink-0 w-[140px]">
      <img src={imageSrc} alt="story image" className="rounded-xl w-full h-[200px] object-cover" />
      {showDate && date && <p className="mt-2 text-sm text-black truncate">{date}</p>}
    </div>
  );
}
