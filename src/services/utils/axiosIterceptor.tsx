import axios from "axios";
import { API_URL } from '@env';
console.log(API_URL)
const VITE_SERVER_URL = API_URL;

let BaseURL = "/api/v1/";
if (VITE_SERVER_URL) BaseURL = VITE_SERVER_URL + BaseURL;

const apiClient = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
});


import { AxiosInstance } from 'axios';

const setupInterceptors = (navigate: (name: string, params?: object) => void): void => {
  // Example interceptor setup

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorMessage = error.response?.data?.message
      if (
        errorMessage === "please login to access this resource" ||
        errorMessage === "login again ! session expired" ||
        errorMessage === "login again"
      ) {
        navigate('Login');
      }
      return Promise.reject(error);
    },
  );
};


export { BaseURL, apiClient, setupInterceptors };
