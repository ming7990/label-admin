import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

// 分页查询接口
export async function getList(data?: any) {
  return request(`${baseUrl}/services/report/tips/list`, {
    method: 'post',
    data: data,
  });
}

export async function addOrUpdate(data: any, type: 'add'|'edit') {
  return request(`${baseUrl}/services/report/tips/${type}`, {
    method: 'post',
    data: data,
  });
}

// 删除;
export async function deleteItem(data?: any) {
  return request(`${baseUrl}/services/report/tips/delete`, {
    method: 'post',
    data: data,
  });
}

export async function detail(data?: any) {
  return request(`${baseUrl}/services/report/tips/detail`, {
    method: 'post',
    data: data,
  });
}
