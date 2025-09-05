import axiosInstance from './axiosInstance';

// 이 타입 정의들은 백엔드 응답과 일치하므로 그대로 둡니다.
export interface StampSlot {
  eventPlaceId: number;
  placeName: string;
  eventCode: 'REQUIRE' | 'GENERAL';
  stamped: boolean;
  stampedDate?: string;
}

// [핵심 수정] 인터페이스의 속성 이름을 백엔드 DTO와 정확히 일치시킵니다.
export interface StampStatusResponse {
  stamps: StampSlot[];
  rouletteAvailable: boolean; // 'rouletteEnabled' -> 'rouletteAvailable'
}

/**
 * 특정 이벤트의 전체 스탬프 상태와 룰렛 가능 여부를 한 번에 가져오는 API
 * @param eventId - 조회할 이벤트의 ID
 */
export const getStampsStatus = async (eventId: number): Promise<StampStatusResponse> => {
  try {
    const response = await axiosInstance.get(`/stamps/events/${eventId}/me`);
    const resultData = response.data?.data;

    if (!resultData) {
      return { stamps: [], rouletteAvailable: false };
    }

    return resultData;
  } catch (error) {
    return { stamps: [], rouletteAvailable: false };
  }
};
