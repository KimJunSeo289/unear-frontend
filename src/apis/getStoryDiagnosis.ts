import axiosInstance from '@/apis/axiosInstance';

export interface StoryDiagnosisParams {
  userId: number;
  username: string;
  email: string;
  tel: string;
  birthdate: string;
  gender: string;
  membershipCode: string;
  provider: string;
  providerId: string;
}

export interface StoryDiagnosisResponse {
  type: string;
  comment: string;
}

interface ApiResponse<T> {
  resultCode: number;
  codeName: string;
  message: string;
  data: T;
}

export const getStoryDiagnosis = async (
  user: StoryDiagnosisParams
): Promise<StoryDiagnosisResponse> => {
  const response = await axiosInstance.get<ApiResponse<StoryDiagnosisResponse>>(
    '/story/diagnosis',
    {
      params: {
        user: JSON.stringify(user),
      },
    }
  );
  return response.data.data;
};
