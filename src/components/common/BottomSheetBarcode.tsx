import BottomSheet from '@/components/common/BottomSheet';
import BarcodeDisplay from '@/components/common/BarcodeDisplay';
import Grade from '@/components/common/Grade';

interface BottomSheetBarcodeProps {
  userName?: string;
  userGrade?: 'VIP' | 'VVIP' | '우수';
  barcodeValue?: string;
  isOpen: boolean;
  onClose: () => void;
}
const BottomSheetBarcode = ({
  userName = '홍길동',
  userGrade = 'VVIP',
  barcodeValue = '344BA876Y89',
  isOpen,
  onClose,
}: BottomSheetBarcodeProps) => {
  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="w-full flex flex-col items-center space-y-8 pb-2">
          {/* 사용자 정보 섹션 */}
          <div className="flex items-center gap-3">
            <span className="text-lm font-semibold text-black pt-1">{userName}님</span>
            <div className="pt-[2px]">
              <Grade grade={userGrade} />
            </div>
          </div>
          {/* 바코드 섹션 */}
          <div className="w-full">
            <BarcodeDisplay code={barcodeValue} format="CODE128" />
          </div>
        </div>
      </BottomSheet>
    </>
  );
};
export default BottomSheetBarcode;

/*
사용법:

기본 사용법 (외부 상태 제어):
<BottomSheetBarcode 
  userName="김철수"
  userGrade="VIP"
  barcodeValue="123456789"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>

Props:
- userName: 사용자 이름 (기본값: "홍길동")
- userGrade: 사용자 등급 (기본값: "VVIP")
- barcodeValue: 바코드 값 (기본값: "344BA876Y89")
- isOpen: 바텀시트 열림 상태 (필수)
- onClose: 바텀시트 닫기 함수 (필수)

특징:
- 외부에서 상태 제어 가능
- BottomSheet 컴포넌트 활용
- BarcodeDisplay 컴포넌트로 바코드 표시
- Grade 컴포넌트로 등급 표시
- 드래그/배경 클릭으로 닫기 가능
- 반응형 디자인
*/
