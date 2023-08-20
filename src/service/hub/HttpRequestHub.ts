import { axiosInstance, axiosInstanceMultipart } from '../host';

export const HttpRequestHub = (config: any) => {
  return axiosInstance(config);
};
export const HttpRequestHubMultipart = (config: any) => {
  return axiosInstanceMultipart(config);
};
