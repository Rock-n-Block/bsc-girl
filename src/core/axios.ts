import axios from 'axios';

import { clogData } from '../utils/logger';

axios.defaults.baseURL = 'https://bscgirl.net/api/v1';

axios.interceptors.request.use(
  (config) => {
    config.headers.common = {
      ...config.headers.common,
      Authorization: `${
        localStorage.getItem('bsc_token') ? `Token ${localStorage.getItem('bsc_token')}` : ''
      }`,
    };
    return config;
  },
  (error) => {
    clogData('Authorization error:', error);
    return Promise.reject(error);
  },
);

export default axios;
