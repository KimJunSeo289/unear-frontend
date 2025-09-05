import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Mousewheel } from 'swiper/modules';
import onboarding1 from '@/assets/onboarding/onboarding1.png';
import onboarding2 from '@/assets/onboarding/onboarding2.png';
import onboarding3 from '@/assets/onboarding/onboarding3.png';
import onboarding4 from '@/assets/onboarding/onboarding4.png';
import onboarding5 from '@/assets/onboarding/onboarding5.png';
import OnboardingButton from '@/components/common/OnboardingButton';
import 'swiper/css';

const OnboardingPage = () => {
  const [index, setIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const navigate = useNavigate();

  const contents = [
    {
      title: '내 주변 혜택, 한눈에',
      subtitle1: '지도에서 마커를 눌러 매장 정보 보기',
      subtitle2: '쿠폰 제공 매장을 직관적으로 확인해요',
      image: onboarding1,
    },
    {
      title: '혜택 매장을 지도로!',
      subtitle1: '검색, 필터, 즐겨찾기, 로드뷰까지',
      subtitle2: '원하는 매장을 빠르고 쉽게 활용해보세요',
      image: onboarding2,
    },
    {
      title: '소비 습관, 스토리로',
      subtitle1: 'AI가 그려주는 소비 일기 모음',
      subtitle2: '매달 나만의 감성적인 스토리가 생겨요',
      image: onboarding3,
    },
    {
      title: '이번주 유니어 미션!',
      subtitle1: '다양한 미션 및 이벤트 참여',
      subtitle2: '매주 새롭게 열리는 혜택이 기다려요',
      image: onboarding4,
    },
    {
      title: '나의 소비 리포트',
      subtitle1: '나만의 데이터로 더 똑똑하게',
      subtitle2: '한 달 단위로 소비를 분석해드려요',
      image: onboarding5,
    },
  ];

  const handleComplete = () => {
    localStorage.setItem('hasOnboarded', 'true');
    navigate('/login');
  };

  const handleIndicatorClick = (slideIndex: number) => {
    if (swiper) {
      swiper.slideTo(slideIndex, 300);
      setIndex(slideIndex);
    }
  };

  return (
    <div className="w-full max-w-[600px] min-h-screen mx-auto flex flex-col">
      {/* 로고 영역 */}
      <div className="w-full h-[40px] bg-white flex-shrink-0 mb-4">
        <div className="w-full max-w-[600px] pt-1 mx-auto px-5 h-full flex items-center justify-between">
          <h1 className="text-primary font-bold text-lg leading-[40px]">U:NEAR</h1>
        </div>
      </div>

      {/* 스와이퍼 영역 */}
      <div className="flex-1 flex flex-col justify-center">
        <Swiper
          modules={[Mousewheel]}
          slidesPerView={1}
          onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
          onSwiper={setSwiper}
          mousewheel={{ forceToAxis: true }}
          className="w-full"
        >
          {contents.map(({ title, subtitle1, subtitle2, image }, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col justify-center items-center text-center px-5">
                <h2 className="text-[28px] font-semibold text-primary mb-2">{title}</h2>
                <p className="text-lm text-black">{subtitle1}</p>
                <p className="text-lm text-black mb-3">{subtitle2}</p>
                <div className="w-full flex justify-center items-center">
                  <img src={image} alt="온보딩 이미지" className="max-h-[60dvh] object-contain" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 페이지 인디케이터 */}
        <div className="flex justify-center mt-8">
          {contents.map((_, i) => (
            <div
              key={i}
              className={`w-[7px] h-[7px] rounded-full mx-[5px] cursor-pointer transition-colors ${index === i ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => handleIndicatorClick(i)}
            />
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center mt-4 px-5 h-[40px] items-center">
          {index === contents.length - 1 ? (
            <OnboardingButton text="시작하기" onClick={handleComplete} isActive={true} />
          ) : (
            <button
              onClick={handleComplete}
              className="text-gray-400 underline text-sm h-[40px] flex items-center"
            >
              건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
