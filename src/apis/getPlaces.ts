import axiosInstance from './axiosInstance';
import type { Place } from '@/types/map';

interface GetPlacesParams {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  isFavorite?: boolean;
  categoryCodes?: string[];
  benefitCategories?: string[];
}

export const getPlaces = async ({
  swLat,
  swLng,
  neLat,
  neLng,
  isFavorite,
  categoryCodes,
  benefitCategories,
}: GetPlacesParams): Promise<Place[]> => {
  try {
    const res = await axiosInstance.get('/places', {
      params: {
        southWestLatitude: swLat,
        southWestLongitude: swLng,
        northEastLatitude: neLat,
        northEastLongitude: neLng,
        isFavorite: isFavorite ? 'true' : undefined,
        categoryCode: categoryCodes,
        benefitCategory: benefitCategories,
      },
    });

    // 데이터 콘솔 출력

    return res.data?.data || [];
  } catch (error) {
    throw error;
  }
};

//검색
interface GetPlacesForSearchParams {
  keyword: string;
  southWestLatitude: number;
  southWestLongitude: number;
  northEastLatitude: number;
  northEastLongitude: number;
  categoryCodes?: string[];
  benefitCategories?: string[];
  isFavorite?: boolean;
}

export const getPlacesForSearch = async ({
  keyword,
  southWestLatitude,
  southWestLongitude,
  northEastLatitude,
  northEastLongitude,
  categoryCodes,
  benefitCategories,
  isFavorite,
}: GetPlacesForSearchParams): Promise<Place[]> => {
  try {
    const res = await axiosInstance.get('/places', {
      params: {
        keyword,
        southWestLatitude,
        southWestLongitude,
        northEastLatitude,
        northEastLongitude,
        categoryCode: categoryCodes,
        benefitCategory: benefitCategories,
        isFavorite: isFavorite ? 'true' : undefined,
      },
    });

    return res.data?.data || [];
  } catch (error) {
    throw error;
  }
};
