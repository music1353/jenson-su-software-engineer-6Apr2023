import { message } from 'antd';

export const tip = (msg: string) => {   
  message.error(msg);
}

export const navigateTo = (route: string) => {
  window.location.href = route;
}