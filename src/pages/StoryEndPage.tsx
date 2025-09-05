import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import StoryLayout from '@/components/story/StoryLayout';
import StoryCardList from '@/components/story/StoryCardList';
import StoryButton from '@/components/common/StoryButton';
import type { StoryItem } from '@/types/story';

const StoryEndPage = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const stories = location.state?.stories as StoryItem[] | undefined;
  const diagnosis = location.state?.diagnosis;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!stories || stories.length === 0) {
    return (
      <StoryLayout bgColorClass="bg-storybackground1">
        <div className="flex items-center justify-center min-h-[calc(100vh-105px)] text-white">
          스토리 데이터가 없습니다.
        </div>
      </StoryLayout>
    );
  }

  return (
    <StoryLayout bgColorClass={isAnimating ? 'bg-storybackground2' : 'bg-storybackground1'}>
      {isAnimating ? (
        <div className="relative w-full overflow-hidden h-[calc(100vh-105px)] flex justify-center items-center">
          <AnimatePresence>
            <motion.div
              key="rollingCredits"
              initial={{ y: '70%' }}
              animate={{ y: '-100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="flex flex-col items-center text-center whitespace-pre-line"
            >
              <p className="text-xxl font-bold text-primary mb-1 select-none">U:NEAR</p>
              <p className="text-lg font-regular text-gray-300 select-none">
                당신의 일상에{'\n'}함께 할 수 있어 감사합니다
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-105px)]">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xxl font-bold text-primary">U:NEAR</p>
            <p className="text-xl font-semibold text-white">스토리</p>
          </div>

          <p className="text-lg font-regular text-gray-300 mb-6 whitespace-pre-line text-center">
            앞으로의 선택도{'\n'}언제나 함께할게요
          </p>

          <StoryCardList stories={stories} />

          <div className="flex flex-col gap-3 mt-4">
            <StoryButton
              text="다시 보기"
              onClick={() => navigate('/story/detail', { state: { diagnosis } })}
            />
            <StoryButton
              text="추천 매장"
              onClick={() => navigate('/story/recommend', { state: { diagnosis } })}
            />
          </div>
        </div>
      )}
    </StoryLayout>
  );
};

export default StoryEndPage;
