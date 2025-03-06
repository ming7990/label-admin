import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

// 角色分页查询接口
export async function api_rolePage(data?: any) {
  return request(`${baseUrl}/services/role/rolePage`, {
    method: 'post',
    data: data,
  });
}

// 角色列表查询接口
export async function api_roleList(data?: any) {
  return request(`${baseUrl}/services/role/roleList`, {
    method: 'post',
    data: data,
  });
}

// 角色同步
export async function api_roleSynch(data?: Record<string, any>) {
  return request(`${baseUrl}/services/role/roleSynch`, {
    method: 'POST',
    data: data,
  });
}

// 角色权限查询
export async function api_getPermission(data?: any) {
  return request(`${baseUrl}/services/role/getPermission`, {
    method: 'post',
    data: data,
  });
}

// 角色权限编辑接口
export async function api_savePermission(data?: any) {
  return request(`${baseUrl}/services/role/savePermission`, {
    method: 'post',
    data: data,
  });
}
