import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

// 职场分页查询接口
export async function api_workPlacePage(data?: any) {
  return request(`${baseUrl}/services/workPlace/workPlacePage`, {
    method: 'post',
    data: data,
  });
}

// 职场列表查询接口
export async function api_workPlaceList(data?: any) {
  return request(`${baseUrl}/services/workPlace/workPlaceList`, {
    method: 'post',
    data: data,
  });
}

// 职场新增接口
export async function api_workPlaceAdd(data?: any) {
  return request(`${baseUrl}/services/workPlace/workPlaceAdd`, {
    method: 'post',
    data: data,
  });
}

// 职场编辑接口
export async function api_workPlaceEdit(data?: any) {
  return request(`${baseUrl}/services/workPlace/workPlaceEdit`, {
    method: 'post',
    data: data,
  });
}

// 职场删除接口
export async function api_workPlaceDelete(data?: any) {
  return request(`${baseUrl}/services/workPlace/workPlaceDelete`, {
    method: 'post',
    data: data,
  });
}
