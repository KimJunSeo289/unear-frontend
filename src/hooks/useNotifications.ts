import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import {
  NotificationClient,
  type PaymentSuccessData,
  type ConnectionStatus,
} from '@/utils/NotificationClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UseNotificationsReturn {
  connectionStatus: ConnectionStatus;
  showPaymentModal: boolean;
  paymentModalData: {
    storeName: string;
    discountAmount: number;
    finalAmount: number;
    message: string;
  } | null;
  closePaymentModal: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{
    storeName: string;
    discountAmount: number;
    finalAmount: number;
    message: string;
  } | null>(null);

  const notificationClientRef = useRef<NotificationClient | null>(null);
  const { userInfo, getStoredAccessToken } = useAuthStore();

  // 초기화 상태 추적
  const isInitializedRef = useRef(false);

  // 결제 완료 알림 처리 (모달)
  const handlePaymentSuccess = useCallback((data: PaymentSuccessData) => {
    setPaymentModalData({
      storeName: data.relatedPlaceName,
      discountAmount: data.discountAmount,
      finalAmount: data.finalAmount,
      message: data.message || '', // 빈 문자열일 수 있음
    });
    setShowPaymentModal(true);

    // 결제 완료 이벤트 발생 (다른 컴포넌트에서 처리 가능)
    window.dispatchEvent(
      new CustomEvent('paymentCompleted', {
        detail: data,
      })
    );
  }, []);

  // 연결 상태 변경 처리
  const handleConnectionStatusChanged = useCallback((data: { status: ConnectionStatus }) => {
    setConnectionStatus(data.status);
  }, []);

  // 결제 완료 모달 닫기
  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
    setPaymentModalData(null);
  }, []);

  useEffect(() => {
    // 사용자가 로그인되어 있고 userId가 있을 때만 연결
    if (!userInfo?.userId) {
      return;
    }

    // 이미 초기화되었으면 중복 실행 방지
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    // NotificationClient 인스턴스 생성 (getStoredAccessToken 함수 전달)
    notificationClientRef.current = new NotificationClient(
      userInfo.userId,
      API_BASE_URL,
      getStoredAccessToken
    );

    // 이벤트 리스너 등록 (결제 완료만)
    notificationClientRef.current.on('paymentSuccess', handlePaymentSuccess);
    notificationClientRef.current.on('connectionStatusChanged', handleConnectionStatusChanged);

    // 정리 함수
    return () => {
      if (notificationClientRef.current) {
        notificationClientRef.current.disconnect();
        notificationClientRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [
    userInfo?.userId, // userId만 의존성으로 설정
  ]);

  return {
    connectionStatus,
    showPaymentModal,
    paymentModalData,
    closePaymentModal,
  };
};
