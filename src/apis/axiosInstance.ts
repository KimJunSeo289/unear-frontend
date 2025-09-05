import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { showErrorToast } from '@/utils/toast';
import qs from 'qs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 커스텀 config 타입
interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 백엔드 API 응답 타입
interface ApiResponse<T> {
  resultCode: number;
  codeName: string;
  message: string;
  data: T;
}

interface RefreshResponseDto {
  userId: number;
  newAccessToken: string;
}

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly 쿠키 전송
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

// 토큰 갱신 중복 방지
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// 대기열 처리
const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

// 리프레시 토큰으로 액세스 토큰 갱신
const refreshAccessToken = async (): Promise<string | null> => {
  const { setAccessToken, setStoredTokens, handleSessionExpired } = useAuthStore.getState();

  try {
    const response = await axios.post<ApiResponse<RefreshResponseDto>>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    if (response.data.resultCode === 200 && response.data.data?.newAccessToken) {
      const newAccessToken = response.data.data.newAccessToken;

      setAccessToken(newAccessToken);
      setStoredTokens(newAccessToken, 'httponly-cookie');

      return newAccessToken;
    }

    throw new Error('Invalid refresh response');
  } catch (error) {
    const axiosError = error as AxiosError;

    // 리프레시 토큰 만료 (401/403)
    if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
      handleSessionExpired();
      showErrorToast('세션이 만료되었습니다. 다시 로그인해주세요.');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (axiosError.code === 'NETWORK_ERROR') {
      showErrorToast('네트워크 연결을 확인해주세요.');
    }

    return null;
  }
};

// 요청 인터셉터 - 액세스 토큰 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getStoredAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 에러 시 자동 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as CustomConfig;

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(
          refreshError instanceof Error ? refreshError : new Error('Token refresh failed'),
          null
        );
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
