import axiosInstance from './axiosInstance';

// 백엔드 API 응답 구조에 맞춘 타입 정의
interface ApiResponse<T> {
  resultCode: number;
  codeName: string;
  message: string;
  data: T;
}

// 로그인 관련 타입
interface LoginRequestDto {
  email: string;
  password: string;
}

interface LoginResponseDto {
  userId: number;
  accessToken: string;
  email: string;
  username: string;
  membershipCode: 'BASIC' | 'VIP' | 'VVIP';
  barcodeNumber: string;
  isProfileComplete: boolean;
  provider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
}

interface LogoutResponseDto {
  userId: number;
}

// 회원가입 관련 타입
interface SignupRequestDto {
  email: string;
  password: string;
  username: string;
  gender?: 'M' | 'F';
  birthdate?: string;
  tel?: string;
}

interface SignupResponseDto {
  userId: number;
  email: string;
  username: string;
  message: string;
}

// 리프레시 토큰 관련 타입
interface RefreshResponseDto {
  userId: number;
  newAccessToken: string;
}

// OAuth 프로필 완성 관련 타입
interface CompleteProfileRequestDto {
  username: string;
  gender: 'M' | 'F';
  birthdate: string;
  tel: string;
}

interface ProfileUpdateResponseDto {
  userId: number;
  message: string;
  isProfileComplete: boolean;
}

export const authApi = {
  // 로그인
  login: async (loginData: LoginRequestDto): Promise<ApiResponse<LoginResponseDto>> => {
    const response = await axiosInstance.post('/auth/login', loginData);
    return response.data;
  },

  // 회원가입
  signup: async (signupData: SignupRequestDto): Promise<ApiResponse<SignupResponseDto>> => {
    const response = await axiosInstance.post('/auth/signup', signupData);
    return response.data;
  },

  // 리프레시 토큰으로 액세스 토큰 갱신
  refresh: async (): Promise<ApiResponse<RefreshResponseDto>> => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  },

  // 로그아웃 (사용자 수동 로그아웃 시에만 사용)
  logout: async (): Promise<ApiResponse<LogoutResponseDto>> => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // OAuth 프로필 완성
  completeOAuthProfile: async (
    profileData: CompleteProfileRequestDto
  ): Promise<ApiResponse<ProfileUpdateResponseDto>> => {
    const response = await axiosInstance.post('/auth/oauth/complete-profile', profileData);
    return response.data;
  },

  // 이메일 인증 코드 전송
  sendVerificationCode: async (email: string): Promise<string> => {
    const response = await axiosInstance.post('/auth/send-code', null, {
      params: { email },
    });
    return response.data;
  },

  // 이메일 인증 코드 확인
  verifyCode: async (email: string, code: string): Promise<string> => {
    const response = await axiosInstance.post('/auth/verify-code', null, {
      params: { email, code },
    });
    return response.data;
  },

  // 비밀번호 재설정
  resetPassword: async (resetData: {
    email: string;
    newPassword: string;
  }): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post('/auth/reset-password', resetData);
    return response.data;
  },
};

export default authApi;
