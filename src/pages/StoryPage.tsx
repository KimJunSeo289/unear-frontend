// src/pages/StoryPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import StoryLayout from '@/components/story/StoryLayout';
import BookNubiImage from '@/assets/story/bookNubi.png';
import SearchNubiImage from '@/assets/story/searchNubi.png';
import SparkleImage from '@/assets/story/sparkle.svg';
import StoryButton from '@/components/common/StoryButton';
import { useAuthStore } from '@/store/auth';
import { getStoryDiagnosis } from '@/apis/getStoryDiagnosis';
import { getStoryByMonth } from '@/apis/getStoryByMonth';
import type { StoryItem } from '@/types/story';

const S3_BASE_URL = 'https://unear-uploads.s3.ap-southeast-2.amazonaws.com/';

interface DiagnosisData {
  category: string;
  emoji: string;
  label: string;
  description: string[];
}

const StoryPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diagnosisMap, setDiagnosisMap] = useState<Record<string, DiagnosisData>>({});
  const [diagnosisResult, setDiagnosisResult] = useState<{ type: string; comment: string } | null>(
    null
  );
  const [storyData, setStoryData] = useState<StoryItem[] | null>(null);

  const navigate = useNavigate();
  const { userInfo, getUserDisplayName } = useAuthStore();
  const userName = getUserDisplayName();

  const loadingTexts = useMemo(
    () => [
      '나의 결제 기록을 모아 AI가\n나만의 스토리를 제작중이에요.',
      'U:NEAR와 함께 했던 시간들을\n다시 살펴보고 있어요.',
      `분석이 끝났어요!\n${userName}님의 소비 스토리를 보여드릴게요!`,
    ],
    [userName]
  );

  useEffect(() => {
    if (!isStarted) return;

    const fetchDiagnosisMap = async () => {
      try {
        const res = await fetch('/data/diagnosisMap.json');
        const data = await res.json();
        setDiagnosisMap(data);
      } catch (err) {}
    };

    const fetchDiagnosisResult = async () => {
      try {
        if (!userInfo) return;
        const result = await getStoryDiagnosis({
          userId: userInfo.userId,
          username: userInfo.username,
          email: userInfo.email,
          tel: userInfo.tel ?? '',
          birthdate: userInfo.birthdate ?? '',
          gender: userInfo.gender ?? '',
          membershipCode: userInfo.membershipCode,
          provider: userInfo.provider ?? '',
          providerId: userInfo.providerId ?? '',
        });
        setDiagnosisResult(result);
      } catch (err) {}
    };

    const fetchStoryData = async () => {
      try {
        const targetMonth = dayjs().format('YYYY-MM');
        const stories = await getStoryByMonth(targetMonth);
        setStoryData(stories);

        // ✅ 첫 번째 이미지 선행 로드
        if (stories?.[0]?.imageUrl) {
          const preloadImg = new Image();
          preloadImg.src = S3_BASE_URL + stories[0].imageUrl;
        }
      } catch (err) {}
    };

    fetchDiagnosisMap();
    fetchDiagnosisResult();
    fetchStoryData();
  }, [isStarted, userInfo]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex >= loadingTexts.length - 1) {
      const timeout = setTimeout(() => {
        navigate('/story/diagnosis', {
          state: {
            diagnosisMap,
            diagnosisResult,
            storyData,
          },
        });
      }, 2500);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [
    isStarted,
    currentIndex,
    diagnosisMap,
    diagnosisResult,
    storyData,
    navigate,
    loadingTexts.length,
  ]);

  return (
    <StoryLayout bgColorClass={isStarted ? 'bg-storybackground2' : 'bg-storybackground1'}>
      {!isStarted ? (
        <div className="flex flex-col items-center justify-center w-full">
          <img src={BookNubiImage} className="mb-6" />
          <p className="text-xl font-bold text-white mb-2">나의 소비 스토리</p>
          <p className="text-lm font-bold text-gray-300 mb-6 whitespace-pre-line text-center">
            AI가 분석하는 나의 이번달 소비 패턴{'\n'}어떤 이야기가 숨어있을까요?
          </p>
          <StoryButton text="분석 시작하기" onClick={() => setIsStarted(true)} />
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full">
          <img src={SearchNubiImage} className="mb-6" />
          <img
            src={SparkleImage}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          />
          <div className="h-[60px] overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-m font-regular text-white whitespace-pre-line text-center"
              >
                {loadingTexts[currentIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      )}
    </StoryLayout>
  );
};

export default StoryPage;
