import axiosInstance from '@/apis/axiosInstance';
import type { StoryItem } from '@/types/story';

interface ApiResponse<T> {
  resultCode: number;
  codeName: string;
  message: string;
  data: T | null;
}

export class AlreadyExistsStoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlreadyExistsStoryError';
  }
}

export const postStoryByMonth = async (): Promise<StoryItem[] | null> => {
  try {
    const response = await axiosInstance.post<ApiResponse<StoryItem[]>>('/story');

    if (response.data.resultCode === 200) {
      return response.data.data || null;
    } else if (response.data.codeName === 'ALREADY_EXISTS_STORY') {
      throw new AlreadyExistsStoryError(response.data.message);
    } else {
      throw new Error(response.data.message || 'Unknown error in postStoryByMonth');
    }
  } catch (error) {
    if (error instanceof AlreadyExistsStoryError) {
      // 이미 존재하는 스토리 에러는 호출부에서 처리할 예정이니 로그 없이 바로 던짐
      throw error;
    }
    throw error;
  }
};
