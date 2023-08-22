import { HttpRequestHubMultipart } from '../hub/HttpRequestHub';

export const CreateFuncMulti = (url: string, data: any) => {
  const config = {
    method: 'POST',
    url: `${url}`,
    data,
  };
  return HttpRequestHubMultipart(config);
};

export const EditFuncMulti = (url: string, data: any, method = 'PUT') => {
  const config = {
    method: method,
    url: `${url}`,
    data,
  };
  return HttpRequestHubMultipart(config);
};
