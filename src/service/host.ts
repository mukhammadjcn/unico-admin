import axios from 'axios';
export let token = '';
export let host = 'https://api.livein.uz/';
export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

// -------------------------------
export let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json; charset=utf-8',
  Authorization: token ? `Token ${token}` : '',
};

export let headersMultipart = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'multipart/form-data',
};

// --------------------------------------
export let axiosInstance = axios.create({
  baseURL: `${host}api/v1/`,
  headers,
  timeout: 100000,
});

export let axiosInstanceMultipart = axios.create({
  baseURL: `${host}api/v1/`,
  headers: headersMultipart,
  timeout: 100000,
});

// --------------------------------------------
axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    throw error;
  }
);
axiosInstanceMultipart.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    throw error;
  }
);

export const getCookie = (name: string) => {
  var pattern = RegExp(name + '=.[^;]*');
  var matched = document.cookie.match(pattern);
  if (matched) {
    var cookie = matched[0].split('=');
    return cookie[1];
  }
  return '';
};
