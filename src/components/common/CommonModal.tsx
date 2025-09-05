interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative w-full max-w-[600px]">
        <div
          className="absolute inset-0 bottom-[65px] bg-black bg-opacity-40"
          onClick={handleBackdropClick}
        />

        {/* 모달 위치 조정 */}
        <div className="absolute inset-0 bottom-[65px] flex items-center justify-center px-5">
          <div
            className={`
              w-full 
              max-w-[560px] 
              bg-white 
              rounded-[16px] 
              overflow-hidden 
              shadow-lg 
              max-h-[70vh]
              flex
              flex-col
              ${className}
            `}
          >
            {/* 헤더 영역 - 고정 */}
            <div className="w-full h-[55px] bg-primary flex items-center justify-between px-5 flex-shrink-0">
              <h2 className="text-white text-lm pt-1 font-bold flex-1 truncate">{title}</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200 flex-shrink-0 ml-2"
                aria-label="모달 닫기"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* 컨텐츠 영역 - 스크롤 가능 */}
            <div className="pt-3 pb-5 pr-5 pl-5 flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;

/*
사용법:

기본 사용:
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

<CommonModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="모달 제목"
>
  <div>모달 내용</div>
</CommonModal>

Props:
- isOpen: 모달 열림/닫힘 상태
- onClose: 모달 닫기 함수
- title: 모달 헤더 제목
- children: 모달 내용 (선택사항)
- className: 추가 스타일 클래스 (선택사항)

특징:
- 반응형 디자인 (최대 너비 393px)
- 백드롭 클릭으로 닫기 가능
- 헤더 높이 55px, 핑크색 배경
- 스크롤 가능한 컨텐츠 영역
- 접근성 지원 (aria-label)
- 부드러운 애니메이션 효과
*/
