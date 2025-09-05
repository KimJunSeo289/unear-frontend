import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import HomeIcon from '@/assets/common/home.svg?react';
import MapIcon from '@/assets/common/map.svg?react';
import StoryIcon from '@/assets/common/story.svg?react';
import JuniorIcon from '@/assets/common/junior.svg?react';
import MyIcon from '@/assets/common/my.svg?react';

const tabs = [
  { id: 'home', label: '홈', Icon: HomeIcon, path: '/' },
  { id: 'map', label: '지도', Icon: MapIcon, path: '/map' },
  { id: 'story', label: '스토리', Icon: StoryIcon, path: '/story' },
  { id: 'junior', label: '이번주니어', Icon: JuniorIcon, path: '/junior' },
  { id: 'my', label: '마이', Icon: MyIcon, path: '/my' },
];

const BottomNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    const currentPath = location.pathname;

    // 🚀 경로별 매칭 로직 개선
    if (currentPath === '/') {
      return 'home';
    } else if (currentPath.startsWith('/map')) {
      return 'map';
    } else if (currentPath.startsWith('/story')) {
      return 'story';
    } else if (currentPath.startsWith('/junior')) {
      return 'junior';
    } else if (currentPath.startsWith('/my')) {
      // 🚀 /my로 시작하는 모든 경로는 'my' 탭으로 인식
      return 'my';
    }

    // 🚀 기타 경로는 현재 경로와 정확히 일치하는 탭 찾기
    const foundTab = tabs.find((tab) => tab.path === currentPath);
    return foundTab?.id ?? 'home';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // 경로가 변경될 때마다 activeTab 업데이트
  useEffect(() => {
    const currentTab = getCurrentTab();
    setActiveTab(currentTab);
  }, [location.pathname]);

  const handleClick = (id: string, path: string) => {
    // 상태를 먼저 업데이트하여 즉시 시각적 피드백 제공
    setActiveTab(id);
    navigate(path);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 bg-white z-50 h-[65px] max-w-[600px] mx-auto"
      style={{ boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.15)' }}
    >
      <div className="w-full px-5 h-full relative">
        {tabs.map(({ id, label, Icon, path }, index) => {
          const isActive = activeTab === id;
          const colorClass = isActive ? 'text-story' : 'text-gray-400';
          const leftPercent = 20 * index + 10;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleClick(id, path)}
              aria-current={isActive ? 'page' : undefined}
              className="absolute top-1/2"
              style={{ left: `${leftPercent}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                {id === 'story' ? (
                  <div className="bg-storyicon rounded-full w-14 h-14 flex flex-col items-center justify-center">
                    <Icon className={isActive ? 'text-blue-100' : 'text-white'} />
                    <span
                      className={`text-s font-semibold ${
                        isActive ? 'text-blue-100' : 'text-white'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ) : (
                  <>
                    <Icon className={`${colorClass}`} />
                    <span className={`${colorClass} text-s font-semibold`}>{label}</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigator;
