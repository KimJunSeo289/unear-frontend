import Grade from '@/components/common/Grade';
import MyPageNubiImage from '@/assets/my/mypagenubi.png';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '@/utils/toast';

interface UserProfileSectionProps {
  greeting?: string; // 인사말만 props로 받고 나머지는 store에서 가져오기
}

const UserProfileSection = ({
  greeting = '오늘도 알뜰한 하루 되세요! ✨',
}: UserProfileSectionProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Zustand store에서 사용자 정보 가져오기
  const { getUserDisplayName, getUserGrade } = useAuthStore();

  // 사용자 이름과 등급 계산
  const userName = getUserDisplayName();
  const userGrade = getUserGrade();
  const displayGrade = userGrade === 'BASIC' ? '우수' : userGrade;

  const handleLogout = async () => {
    try {
      await logout(); // AuthProvider의 logout 함수 직접 사용
      showSuccessToast('로그아웃 됐습니다');

      // 토스트 메시지가 보이도록 약간의 지연 후 페이지 이동
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 500);
    } catch (error) {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="px-5 py-3">
        <div className="flex">
          {/* 캐릭터와 사용자 정보 */}
          <div className="flex gap-4 w-full">
            {/* 마이페이지 누비 캐릭터 */}
            <img src={MyPageNubiImage} alt="마이페이지 누비" className="w-[89px] h-[89px]" />
            {/* 사용자 정보 */}
            <div className="flex flex-col gap-1 mt-4 w-full">
              {/* 이름, 등급, 로그아웃 한 줄 */}
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <h2 className="text-lm font-semibold text-black">{userName}님</h2>
                  <div className="mt-0.5">
                    <Grade grade={displayGrade} />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-s font-regular text-gray-400 underline hover:text-gray-600 transition-colors"
                  type="button"
                >
                  로그아웃
                </button>
              </div>

              {/* 인사말 */}
              <p className="text-m font-regular text-gray-400">{greeting}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
