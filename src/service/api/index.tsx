import { CreateFunc, EditFunc, GetFunc } from '../config';
import { CreateFuncMulti } from '../config/multipart';

export const getShopsConfig = () => {
  return GetFunc(`/shops/shop`);
};
export const AddShowroomConfig = (data: any, cookie: string) => {
  return CreateFuncMulti(`/shops/showrooms?session_id=${cookie}`, data);
};
export const GetShowroomConfig = (id: any) => {
  return GetFunc(`/shops/showrooms/${id}`);
};
export const GetProductsConfig = (id: any) => {
  return GetFunc(`/shops/products?shop=${id}`);
};
export const EditShowroom = (id: any, data: any) => {
  return EditFunc(`shops/showrooms/${id}`, data, 'PATCH');
};
export const AddProductsShowroom = (id: any, data: any, cookie: string) => {
  return CreateFunc(`shops/${id}/showroom-products?session_id=${cookie}`, data);
};
