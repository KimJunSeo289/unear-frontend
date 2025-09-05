import { create } from 'zustand';

interface UserInfo {
  providerId?: string;
  userId: number;
  email: string;
  username: string;
  membershipCode: 'BASIC' | 'VIP' | 'VVIP';
  gender?: 'M' | 'F';
  birthdate?: string;
  tel?: string;
  barcodeNumber?: string;
  provider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  // 상태
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  setAuthInitialized: (value: boolean) => void;

  // 기본 액션
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updateUserInfo: (partialUserInfo: Partial<UserInfo>) => void;

  // 로그아웃 관련
  performManualLogout: () => void; // 사용자 수동 로그아웃
  handleSessionExpired: () => void; // 세션 만료 처리

  // 토큰 관리
  getStoredAccessToken: () => string | null;
  setStoredTokens: (accessToken: string | null, refreshToken: string | null) => void;
  clearStoredTokens: () => void;

  // 사용자 정보 유틸리티
  getUserDisplayName: () => string;
  getUserGrade: () => 'BASIC' | 'VIP' | 'VVIP';
  getBarcodeNumber: () => string;
  getUserProvider: () => 'EMAIL' | 'GOOGLE' | 'KAKAO' | 'NAVER' | null; // provider 반환 메서드 추가
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 상태 초기값
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  isAuthenticated: false,
  isAuthInitialized: false,
  setAuthInitialized: (value) => set({ isAuthInitialized: value }),

  // 기본 액션
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  setUserInfo: (userInfo) => set({ userInfo }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  updateUserInfo: (partialUserInfo) => {
    const currentUserInfo = get().userInfo;
    if (currentUserInfo) {
      set({ userInfo: { ...currentUserInfo, ...partialUserInfo } });
    }
  },

  // 사용자 수동 로그아웃 (로그아웃 버튼 클릭 시)
  performManualLogout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      isAuthenticated: false,
    });
    get().clearStoredTokens();
  },

  // 세션 만료 처리 (리프레시 토큰도 만료)
  handleSessionExpired: () => {
    set({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      isAuthenticated: false,
    });
    get().clearStoredTokens();
  },

  // 액세스 토큰 조회 (메모리 → sessionStorage 순)
  getStoredAccessToken: () => {
    const memoryToken = get().accessToken;
    if (memoryToken) return memoryToken;

    try {
      const storedToken = sessionStorage.getItem('temp_access_token');
      if (storedToken) {
        get().setAccessToken(storedToken);
        return storedToken;
      }
    } catch (error) {}
    return null;
  },

  // 토큰 저장
  setStoredTokens: (accessToken, refreshToken) => {
    try {
      // 액세스 토큰: sessionStorage (짧은 생명주기)
      if (accessToken) {
        sessionStorage.setItem('temp_access_token', accessToken);
      } else {
        sessionStorage.removeItem('temp_access_token');
      }

      // 리프레시 토큰: localStorage (긴 생명주기, 실제로는 HttpOnly 쿠키 사용)
      if (refreshToken && refreshToken !== 'httponly-cookie') {
        localStorage.setItem('refresh_token', refreshToken);
      }
    } catch (error) {}
  },

  // 모든 토큰 삭제
  clearStoredTokens: () => {
    try {
      sessionStorage.removeItem('temp_access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('accessToken'); // 기존 토큰 정리
      localStorage.removeItem('auth-storage'); // Zustand persist 정리
    } catch (error) {}
  },

  // 사용자 정보 유틸리티
  getUserDisplayName: () => {
    const userInfo = get().userInfo;
    return userInfo?.username || '유니어';
  },

  getUserGrade: () => {
    const userInfo = get().userInfo;
    return userInfo?.membershipCode || 'BASIC';
  },

  getBarcodeNumber: () => {
    const userInfo = get().userInfo;
    return userInfo?.barcodeNumber || '123456789';
  },

  getUserProvider: () => {
    const userInfo = get().userInfo;
    return userInfo?.provider || null;
  },
}));
