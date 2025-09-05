import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentCompletedModalProps {
  isOpen: boolean;
  storeName: string;
  discountAmount: number;
  finalAmount: number;
  message: string;
  onClose: () => void;
}

const PaymentCompletedModal = ({
  isOpen,
  storeName,
  discountAmount,
  finalAmount,
  message,
  onClose,
}: PaymentCompletedModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 완료 후 닫기
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // 배경 클릭으로는 모달이 닫히지 않도록 함
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const stripQuotes = (str: string) => {
    if (!str) return '';
    return str
      .replace(/"/g, '') // 모든 따옴표 제거
      .replace(/\\/g, '') // 모든 백슬래시 제거
      .trim(); // 앞뒤 공백 제거
  };

  // 금액 포맷팅 함수
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* 모달 컨테이너 */}
          <motion.div
            className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-auto shadow-xl"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 성공 아이콘 */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <motion.div
                  className="text-white text-2xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ✓
                </motion.div>
              </div>
            </motion.div>

            {/* 타이틀과 메시지 */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-black mb-4">결제 완료!</h2>

              {/* 결제 내용 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">가게명</span>
                    <span className="font-medium text-black">{stripQuotes(storeName)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">할인금액</span>
                      <span className="font-medium text-red-500">
                        -{formatAmount(discountAmount)}원
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">최종결제금액</span>
                      <span className="font-bold text-blue-500 text-lg">
                        {formatAmount(finalAmount)}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기본 메시지 */}
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                결제가 성공적으로 완료되었습니다.
              </p>

              {/* 추가 메시지 (스탬프 관련) */}
              {stripQuotes(message) ? (
                <p className="text-sm text-primary font-medium leading-relaxed">
                  {stripQuotes(message)}
                </p>
              ) : null}
            </div>

            {/* 확인 버튼 */}
            <motion.div
              className="flex justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                type="button"
                onClick={handleClose}
                className="w-[120px] h-[40px] bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <span className="text-sm font-semibold text-white pt-1">확인</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentCompletedModal;
