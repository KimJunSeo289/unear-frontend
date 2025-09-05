import type { ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  disablePadding?: boolean;
}

const BottomSheet = ({ isOpen, onClose, children, disablePadding }: BottomSheetProps) => {
  const y = useMotionValue(0);

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    if (info.offset.y < 0) {
      y.set(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-30 flex justify-center">
          {/* 배경 어두움 */}
          <div className="relative w-full max-w-[600px]">
            <div
              className="absolute inset-0 bottom-[65px] bg-black bg-opacity-40"
              onClick={onClose}
            />

            {/* 바텀시트 */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragMomentum={false}
              dragElastic={0.2}
              style={{ y }}
              onDrag={handleDrag}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  onClose();
                }
              }}
              className="absolute bottom-[65px] w-full bg-white rounded-t-[20px] z-50 max-h-[80vh] flex flex-col"
            >
              {/* 손잡이 */}
              <div className="w-full flex justify-center py-2.5 cursor-grab active:cursor-grabbing">
                <div className="w-[50px] h-[4px] rounded-full bg-gray-400" />
              </div>

              {/* 내용 */}
              <div className={`flex-1 overflow-y-auto ${disablePadding ? '' : 'px-5 pt-1 pb-5'}`}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;

/* 
바텀시트 필요한 내용명 ex) BottomSheetCoupon.tsx 같이 만들어 그 안에 바텀시트 열리면서 들어갈 내용 넣고
거기서 import BottomSheet from '@/components/common/BottomSheet'; 상단에 넣고,
      <button
        onClick={handleOpen}
        className="w-full bg-primary text-white py-2 rounded-lg text-m font-semibold"
      >
        바텀시트 열기
      </button>

      <BottomSheet isOpen={isOpen} onClose={handleClose}>
      과 같이 불러올 버튼만 연결해서 쓰면 됨
*/
