import { HttpRequestHubMultipart } from '../hub/HttpRequestHub';

export const CreateFunc = (url: string, data: any) => {
  const config = {
    method: 'POST',
    url: `${url}`,
    data,
  };
  return HttpRequestHubMultipart(config);
};

export const EditFunc = (url: string, data: any, method = 'PUT') => {
  const config = {
    method: method,
    url: `${url}`,
    data,
  };
  return HttpRequestHubMultipart(config);
};
