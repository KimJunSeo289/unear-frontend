import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import StoryDetailLayout from '@/components/story/StoryDetailLayout';
import PaymentCard from '@/components/story/PaymentCard';
import StoreTypeIcon from '@/components/common/StoreTypeIcon';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { postStoryByMonth } from '@/apis/postStoryByMonth';
import { getStoryByMonth } from '@/apis/getStoryByMonth';

import type { StoryItem } from '@/types/story';
import type { CategoryType, StoreClassType, EventType } from '@/components/common/StoreTypeIcon';

export default function StoryDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const S3_BASE_URL = 'https://unear-uploads.s3.ap-southeast-2.amazonaws.com/';

  const diagnosis = location.state?.diagnosis;

  const [stories, setStories] = useState<
    (StoryItem & {
      category: CategoryType;
      storeClass: StoreClassType;
      eventType: EventType;
    })[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // 랜덤 storeClass 할당 함수
  const getRandomStoreClass = (): StoreClassType => {
    const storeClasses: StoreClassType[] = ['LOCAL', 'FRANCHISE', 'BASIC'];
    return storeClasses[Math.floor(Math.random() * storeClasses.length)];
  };

  // 랜덤 eventType 할당 함수
  const getRandomEventType = (): EventType => {
    const eventTypes: EventType[] = ['NONE', 'GENERAL', 'REQUIRE'];
    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
  };

  // story 데이터에 category, storeClass, eventType 추가 매핑 함수
  const mapStoryMeta = (
    story: StoryItem
  ): StoryItem & {
    category: CategoryType;
    storeClass: StoreClassType;
    eventType: EventType;
  } => {
    return {
      ...story,
      category: story.logoUrl as CategoryType,
      storeClass: getRandomStoreClass(),
      eventType: getRandomEventType(),
    };
  };

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  const fetchData = async () => {
    setIsLoading(true);
    const targetMonth = dayjs().subtract(1, 'month').format('YYYY-MM');

    try {
      await postStoryByMonth();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.message.includes('ALREADY_EXISTS_STORY') ||
          error.message.includes('이미 이번달에 생성된 스토리가 존재합니다'))
      ) {
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      } else {
        setErrorMessage('스토리 생성 중 알 수 없는 오류가 발생했습니다.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const storyData = await getStoryByMonth(targetMonth);
      if (Array.isArray(storyData)) {
        // category, storeClass, eventType 추가 매핑
        const mappedStories = storyData.map(mapStoryMeta);
        setStories(mappedStories);

        mappedStories.forEach((story) => {
          if (story.imageUrl) {
            preloadImage(S3_BASE_URL + story.imageUrl);
          }
          if (story.logoUrl) {
            preloadImage(S3_BASE_URL + story.logoUrl + '.png');
          }
        });
      } else {
        setErrorMessage('스토리 데이터를 불러오지 못했습니다.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('스토리 조회 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isPlaying || stories.length === 0) return;
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, stories]);

  useEffect(() => {
    if (progress < 100 || stories.length === 0) return;

    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    } else {
      navigate('/story/end', { state: { stories, diagnosis } });
    }
  }, [progress, currentStory, stories, navigate, diagnosis]);

  const prevStory = () => {
    if (currentStory > 0) {
      setCurrentStory((prev) => prev - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const nextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    } else {
      navigate('/story/end', { state: { stories, diagnosis } });
    }
  };

  // 에러 우선 처리
  if (errorMessage) {
    return <p className="text-center mt-10 text-m text-red-600">{errorMessage}</p>;
  }

  // 로딩 중 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-storybackground1">
        <Header
          title="소비 스토리"
          bgColor="bg-story"
          textColor="text-white"
          iconColor="text-white"
        />
        <div className="flex items-center justify-center h-[calc(100vh-48px)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // 데이터 없음 처리
  if (stories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-m text-black">스토리 데이터가 없습니다.</p>
      </div>
    );
  }

  const currentStoryData = stories[currentStory];
  const imageFullUrl = S3_BASE_URL + currentStoryData.imageUrl;

  return (
    <StoryDetailLayout backgroundImage={imageFullUrl}>
      <div className="mt-4">
        <div className="flex space-x-1 w-full">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    index < currentStory ? '100%' : index === currentStory ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-white text-center text-lm font-bold">
        {currentStoryData.date.slice(0, 7).replace('-', '.')}
      </div>

      <div className="mt-2 text-white whitespace-pre-line text-center font-bold text-lg leading-relaxed px-5">
        {currentStoryData.comment}
      </div>

      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/2 h-full cursor-pointer" onClick={prevStory} />
        <div className="w-1/2 h-full cursor-pointer" onClick={nextStory} />
      </div>

      <div className="mt-auto mb-4 w-full">
        <PaymentCard
          date={currentStoryData.date}
          title={currentStoryData.storeName}
          price={`${currentStoryData.amount.toLocaleString()}원`}
          customIcon={
            <StoreTypeIcon
              category={currentStoryData.category}
              storeClass={currentStoryData.storeClass}
              event={currentStoryData.eventType}
              size={54}
              shape="square"
            />
          }
        />
      </div>
    </StoryDetailLayout>
  );
}
