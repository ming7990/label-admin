import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

export async function api_studentGroup(data?: any) {
  return request(`${baseUrl}/services/stu/index/studentGroup`, {
    method: 'get',
    data: data,
  });
}

export async function api_scoreSort(data?: any) {
  return request(`${baseUrl}/services/stu/index/scoreSort`, {
    method: 'post',
    data: data,
  });
}

// 温馨提示;
export async function api_tipsAll(data?: any) {
  return request(`${baseUrl}/services/report/tips/all`, {
    method: 'GET',
    data: data,
  });
}

export async function taskVerify_API(data?: any) {
  return request(`${baseUrl}/services/task/config/verify`, {
    method: 'GET',
    params: data,
  });
}

export async function taskRetake_API(data?: any) {
  return request(`${baseUrl}/services/task/retake`, {
    method: 'POST',
    data,
  });
}
