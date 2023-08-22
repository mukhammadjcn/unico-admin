import { GetFunc } from '../config';
import { CreateFuncMulti } from '../config/multipart';

export const getShopsConfig = () => {
  return GetFunc(`/shops/shop`);
};
export const AddShowroomConfig = (data: any) => {
  return CreateFuncMulti(`/shops/showrooms`, data);
};
