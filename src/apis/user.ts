import axiosInstance from './axiosInstance';

// 백엔드 스웨거 User 객체에서 필요한 부분만 타입으로 정의
interface RouletteResult {
  id: number;
  event: {
    unearEventId: number;
  };
  participated: boolean;
}

export interface User {
  userId: number;
  username: string;
  rouletteResults?: RouletteResult[];
}

/**
 * 현재 로그인한 사용자의 정보를 가져오는 API
 */
export const getUserInfo = async (): Promise<User> => {
  try {
    // 일반적인 '내 정보 조회' API 엔드포인트 예시
    const response = await axiosInstance.get('/users/me');
    return response.data?.data;
  } catch (error) {
    throw new Error('사용자 정보를 불러오는 데 실패했습니다.');
  }
};
