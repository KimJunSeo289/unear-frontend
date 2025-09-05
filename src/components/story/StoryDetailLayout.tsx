import type { ReactNode } from 'react';
import Header from '@/components/common/Header';

interface StoryDetailLayoutProps {
  headerTitle?: string;
  children: ReactNode;
  backgroundImage: string;
}

const StoryDetailLayout = ({
  headerTitle = '소비 스토리',
  children,
  backgroundImage,
}: StoryDetailLayoutProps) => {
  return (
    <div className="w-full max-w-[600px] mx-auto relative overflow-hidden min-h-[calc(100vh-105px)]">
      <Header
        title={headerTitle}
        bgColor="bg-story"
        textColor="text-white"
        iconColor="text-white"
      />

      {/* 배경 이미지 */}
      <div
        key={backgroundImage}
        className="absolute inset-0 bg-cover bg-center z-0 animate-zoom"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* 배경 상단 그라데이션 */}
      <div
        className="absolute inset-x-0 top-0 h-[300px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)',
        }}
      />

      {/* 컨텐츠 */}
      <div className="relative z-30 mx-5 flex flex-col flex-1 min-h-[calc(100vh-105px)]">
        {children}
      </div>
    </div>
  );
};

export default StoryDetailLayout;
