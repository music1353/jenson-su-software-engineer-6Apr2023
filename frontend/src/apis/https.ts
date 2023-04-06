import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Dispatch, AnyAction } from "redux";
import store from "store"
import { authActions } from 'store/slices/auth';
import type { ApiResponseType } from "types/apiResponse";
import { tip, navigateTo } from "./uitls";


/** 
 * 請求失敗的統一處理
 * @param {number} status
 * @param {string} msg
 */
const errorHandle = (status: number, msg: string, dispatch: Dispatch<AnyAction>) => {
  switch(status) {
    case 401:
      tip(msg);

      dispatch(authActions.logout());
      setTimeout(() => {
        navigateTo('/');
      }, 500);
      break;
    
    default:
      console.log('Others error:'+ msg);
  }
}


const instance = axios.create({
  baseURL: '/api/'
})

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, (error) => {
  const { response } = error;

  if (response) {
    errorHandle(response.status, response.data?.message, store.dispatch);
    return Promise.reject(error);
  } else {
    if (!navigator.onLine) {
      // 如果是網路斷線
      tip("There is a problem with the network, please refresh the page after reconnecting");
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
});

const httpRequest = (method: string, url: string, data: object|null = null): Promise<AxiosResponse> | null => {
  method = method.toLowerCase();
  switch(method) {
    case 'post':
      return instance.post<ApiResponseType>(url, data);
    case 'get':
      return instance.get<ApiResponseType>(url, { params: data });
    case 'delete':
      return instance.delete<ApiResponseType>(url, { params: data });
    case 'put':
      return instance.put<ApiResponseType>(url, data);
    default:
      return null
  }
}

export default httpRequest;