import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import StarBackgroundImage from '@/assets/story/starBackground.png';

interface StoryLayoutProps {
  headerTitle?: string;
  children: ReactNode;
  bgColorClass: string;
}

export default function StoryLayout({
  headerTitle = '스토리',
  children,
  bgColorClass,
}: StoryLayoutProps) {
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 0.4 ? 0.7 : 0.4));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`overflow-hidden w-full h-full ${bgColorClass}`}>
      <Header
        title={headerTitle}
        bgColor="bg-story"
        textColor="text-white"
        iconColor="text-white"
      />

      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover -z-100"
        style={{
          backgroundImage: `url(${StarBackgroundImage})`,
          opacity,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />

      {/* 컨텐츠 */}
      <div className="relative z-10 mx-5 flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
        {children}
      </div>
    </div>
  );
}
