import { CreateFunc, GetFunc } from '../config';

export const getShopsConfig = () => {
  return GetFunc(`/shops/shop`);
};
export const AddShowroomConfig = (data: any) => {
  return CreateFunc(`/shops/showrooms`, data);
};
