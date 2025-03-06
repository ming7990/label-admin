import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

//按月列表
export async function postDrawPanel_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/draw/save`, {
    method: 'POST',
    data,
  });
}

export async function getDrawPanel_API(data?: any) {
  return request(`${baseUrl}/services/stu/course/taskNodeLineInfo`, {
    method: 'POST',
    data,
  });
}

export async function addNode_API(data?: any) {
  return request(`${baseUrl}/draw/addNode`, {
    method: 'POST',
    params: data,
  });
}

export async function deleteNode_API(data?: any) {
  return request(`${baseUrl}/draw/deleteNode`, {
    method: 'POST',
    params: data,
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
