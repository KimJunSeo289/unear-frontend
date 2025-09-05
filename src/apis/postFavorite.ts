import axiosInstance from './axiosInstance';

export const toggleFavorite = async (placeId: number) => {
  const response = await axiosInstance.post(`/places/${placeId}/favorite`);
  return response.data.data;
};
