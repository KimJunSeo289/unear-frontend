/**
 * 토스트 메시지 유틸리티
 * 사용자 친화적인 알림을 위한 토스트 시스템
 */

interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
}

// 간단한 토스트 구현 (향후 토스트 라이브러리로 대체 가능)
export const showToast = (message: string, options: ToastOptions = {}): void => {
  const { type = 'info', duration = 3000, position = 'bottom' } = options;

  // 기존 토스트 제거
  const existingToast = document.getElementById('unear-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // 토스트 엘리먼트 생성
  const toast = document.createElement('div');
  toast.id = 'unear-toast';
  toast.textContent = message;

  // 스타일 클래스 설정
  const baseClasses = [
    'fixed',
    'z-50',
    'px-4',
    'py-3',
    'rounded-lg',
    'text-white',
    'font-medium',
    'shadow-lg',
    'transition-all',
    'duration-300',
    'transform',
    'max-w-sm',
    'mx-auto',
    'left-1/2',
    '-translate-x-1/2',
  ];

  // 타입별 색상
  const typeClasses = {
    success: ['bg-green-500'],
    error: ['bg-red-500'],
    warning: ['bg-yellow-500'],
    info: ['bg-blue-500'],
  };

  // 위치별 클래스
  const positionClasses = {
    top: ['top-20'],
    center: ['top-1/2', '-translate-y-1/2'],
    bottom: ['bottom-20'],
  };

  toast.className = [...baseClasses, ...typeClasses[type], ...positionClasses[position]].join(' ');

  // DOM에 추가
  document.body.appendChild(toast);

  // 애니메이션을 위한 지연
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform =
      position === 'center' ? 'translate(-50%, -50%) scale(1)' : 'translateX(-50%) scale(1)';
  }, 10);

  // 자동 제거
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform =
        position === 'center' ? 'translate(-50%, -50%) scale(0.9)' : 'translateX(-50%) scale(0.9)';

      setTimeout(() => {
        if (toast && toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }, duration);
};

// 편의 함수들
export const showSuccessToast = (message: string) => showToast(message, { type: 'success' });

export const showErrorToast = (message: string) => showToast(message, { type: 'error' });

export const showWarningToast = (message: string) => showToast(message, { type: 'warning' });

export const showInfoToast = (message: string) => showToast(message, { type: 'info' });
