import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/common/backIcon.svg?react';
// 브랜드 이미지들
import CgvImage from '@/assets/main/cgv.png';
import Gs25Image from '@/assets/main/gs25.png';
import VipsImage from '@/assets/main/vips.png';
import starbucksImage from '@/assets/main/starbucks.png';
import LotteCinemaImage from '@/assets/main/lottecinema.png';
import ParisBaguetteImage from '@/assets/main/parisbaguette.jpg';
import EdiyaImage from '@/assets/main/ediya.png';
import TourLesJoursImage from '@/assets/main/tourlesjours.png';

const MembershipBrandBanner = () => {
  const navigate = useNavigate();

  const handleMembershipClick = () => {
    navigate('/membership'); // 멤버십 페이지로 이동
  };

  return (
    <div className="w-full bg-white rounded-[20px] mt-3 p-5 pb-4">
      {/* 멤버십 헤더 영역 */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-black font-bold text-lm leading-[18px]">멤버십 브랜드</h3>
        <button onClick={handleMembershipClick} className="flex items-center">
          <span className="text-black font-regular text-sm">전체 혜택 확인하기</span>
          <BackIcon className="w-4 h-4 mb-[3px] transform rotate-180 text-black" />
        </button>
      </div>

      {/* 서브 텍스트 */}
      <div className="mb-4">
        <p className="text-gray-500 font-regular text-sm leading-[14px]">할인을 확인해 보세요</p>
      </div>

      {/* 브랜드 로고 그리드 */}
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={CgvImage} alt="CGV" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={Gs25Image} alt="GS25" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={VipsImage} alt="VIPS" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={starbucksImage} alt="스타벅스" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={LotteCinemaImage} alt="롯데시네마" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={ParisBaguetteImage} alt="파리바게뜨" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={EdiyaImage} alt="이디야" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={TourLesJoursImage} alt="뚜레주르" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default MembershipBrandBanner;
