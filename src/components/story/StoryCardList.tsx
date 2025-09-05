import type { StoryItem } from '@/types/story';
import StoryCard from '@/components/story/StoryCard';

interface StoryCardListProps {
  stories: StoryItem[];
  showDate?: boolean;
}

const S3_BASE_URL = 'https://unear-uploads.s3.ap-southeast-2.amazonaws.com/';

export default function StoryCardList({ stories, showDate = false }: StoryCardListProps) {
  // stories 배열을 돌며 imageUrl을 절대경로로 보정하여 imageSrc 필드 추가
  const storiesWithFullUrl = stories.map((story) => ({
    ...story,
    imageSrc: story.imageUrl.startsWith('http') ? story.imageUrl : S3_BASE_URL + story.imageUrl,
  }));

  // 두 번 반복해서 무한 슬라이드 효과용 배열 생성
  const repeatedStories = [...storiesWithFullUrl, ...storiesWithFullUrl];

  return (
    <div className="relative overflow-hidden w-full h-[260px] mb-8">
      <div
        className="flex gap-3 absolute whitespace-nowrap animate-slideLeft"
        style={{ willChange: 'transform' }}
      >
        {repeatedStories.map((story, idx) => (
          <div key={idx} className="inline-block flex-shrink-0 w-[140px]">
            <StoryCard imageSrc={story.imageSrc} date={story.date} showDate={showDate} />
          </div>
        ))}
      </div>
    </div>
  );
}
