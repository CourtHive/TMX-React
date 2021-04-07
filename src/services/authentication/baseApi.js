import axios from 'axios';
import { env } from 'config/defaults';

import { AppToaster } from 'services/notifications/toaster';

import { getJwtTokenStorageKey } from 'config/localStorage';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_CHCS_ROOT_URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const ProviderCtx = env?.org?.ouid;
    const token = localStorage.getItem(JWT_TOKEN_STORAGE_NAME);
    if (token) config.headers.common.Authorization = `Bearer ${token}`;
    config.headers.common['ProviderCtx'] = ProviderCtx;

    return config;
  },
  (error) => {
    AppToaster.show({ icon: 'error', intent: 'error', message: error.message });
    return Promise.reject(error);
  }
);

const addAuthorization = () => {
  const token = localStorage.getItem(JWT_TOKEN_STORAGE_NAME);
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const removeAuthorization = () => {
  axiosInstance.defaults.headers.common.Authorization = undefined;
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.message === 'Network Error') {
      AppToaster.show({ icon: 'error', intent: 'error', message: error.message });
    }
    if (error.response) {
      if (error.response.status === 401) {
        removeAuthorization();
        AppToaster.show({ icon: 'error', intent: 'error', message: 'Unauthorized!' });
        /*
        Unauthorized error has occured! Logout user from app and do a cleanup. 
        */
      }
      const message = error.response.data.message || error.response.data.error || error.response.data;
      AppToaster.show({ icon: 'error', intent: 'error', message });
    }
  }
);

export const baseApi = {
  ...axiosInstance,
  addAuthorization,
  removeAuthorization
};
