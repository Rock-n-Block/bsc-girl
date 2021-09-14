import { show_logs } from '../config';

export const clog = (data: string): void => {
  if (show_logs) {
    console.log(data);
  }
};

export const clogData = (text: string, data: any): void => {
  if (show_logs) {
    console.log(text, data);
  }
};

export const clogGroup = (name: string | any[], end?: boolean): void => {
  if (show_logs) {
    if (end) {
      console.groupEnd();
      return;
    }
    console.group(name);
  }
};

export const throwError = (text: string): Error => {
  throw new Error(text);
};
