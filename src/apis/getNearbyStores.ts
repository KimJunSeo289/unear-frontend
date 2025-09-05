import axiosInstance from './axiosInstance';

export const getNearbyStores = async (latitude: number, longitude: number) => {
  const res = await axiosInstance.get('/places/nearby-with-coupons', {
    params: { latitude, longitude },
  });

  return res.data.data;
};
