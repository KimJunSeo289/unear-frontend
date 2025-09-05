import axiosInstance from '@/apis/axiosInstance';
import type { StoryItem } from '@/types/story';

export async function getStoryByMonth(targetMonth: string): Promise<StoryItem[]> {
  try {
    const response = await axiosInstance.get<StoryItem[]>('/story', {
      params: { targetMonth },
    });

    if (!Array.isArray(response.data)) {
      throw new Error('스토리 형식이 올바르지 않습니다.');
    }

    return response.data; // 빈 배열도 정상 데이터로 처리
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('스토리 조회 중 알 수 없는 오류가 발생했습니다.');
  }
}
