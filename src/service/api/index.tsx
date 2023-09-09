import { EditFunc, GetFunc } from '../config';
import { CreateFuncMulti } from '../config/multipart';
import { getCookie } from '../host';

export const getShopsConfig = () => {
  return GetFunc(`/shops/shop`);
};
export const AddShowroomConfig = (data: any) => {
  return CreateFuncMulti(
    `/shops/showrooms?session_id=${getCookie('sessionid')}`,
    data
  );
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
