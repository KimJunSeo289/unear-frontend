import axiosInstance from '@/apis/axiosInstance';
import type { StoryDiagnosisParams } from './getStoryDiagnosis';

export interface RecommendPlace {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  distanceInMeters: number;
  score?: number;
}

export interface PlaceDetail {
  placeId: number;
  name: string;
  address: string;
  categoryCode: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  startTime: number;
  endTime: number;
  favorite: boolean;
  markerCode: string;
  eventTypeCode: string;
  tel: string;
  discountPolicyDetailId: number | null;
  franchiseId: number;
  benefitDesc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coupons: any[]; // 필요시 타입 구체화 가능
}

interface RecommendPlaceRequest {
  latitude: number;
  longitude: number;
  user: StoryDiagnosisParams;
}

interface ApiResponse<T> {
  resultCode: number;
  codeName: string;
  message: string;
  data: T;
}

// 추천 장소 리스트 호출
export const getRecommendedPlaces = async (
  request: RecommendPlaceRequest
): Promise<RecommendPlace[]> => {
  const response = await axiosInstance.post<ApiResponse<RecommendPlace[]>>(
    '/recommend/places',
    request
  );
  return response.data.data;
};

// 장소 상세 정보 호출
export const getPlaceDetail = async (
  placeId: number,
  latitude: number,
  longitude: number
): Promise<PlaceDetail> => {
  const response = await axiosInstance.get<ApiResponse<PlaceDetail>>(`/places/${placeId}`, {
    params: {
      latitude: String(latitude),
      longitude: String(longitude),
    },
  });
  return response.data.data;
};

// 두 API 합쳐서 상세 포함 최종 추천 장소 리스트를 반환하는 함수
export const getRecommendedPlacesWithDetail = async (
  request: RecommendPlaceRequest
): Promise<(RecommendPlace & PlaceDetail)[]> => {
  const recommendPlaces = await getRecommendedPlaces(request);

  // placeId별로 상세정보 호출 (병렬 처리)
  const detailedPlaces = await Promise.all(
    recommendPlaces.map(async (place) => {
      const detail = await getPlaceDetail(place.placeId, request.latitude, request.longitude);
      return {
        ...place,
        ...detail,
      };
    })
  );

  return detailedPlaces;
};
