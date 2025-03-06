import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

export async function api_taskCount(data?: any) {
  return request(`${baseUrl}/services/home/taskCount`, {
    method: 'post',
    data: data,
  });
}

export async function api_teachTaskDataPage(data?: any) {
  return request(`${baseUrl}/services/home/teachTaskDataPage`, {
    method: 'post',
    data: data,
  });
}
