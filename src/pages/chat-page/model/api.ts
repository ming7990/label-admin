import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

//按月列表
export async function GetCourseInfo_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/services/stu/course/courseNodeLineInfo`, {
    method: 'POST',
    data,
  });
}

export async function GetStepResult_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/services/stu/course/score`, {
    method: 'POST',
    data,
  });
}

export async function postCall_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/services/stu/course/call`, {
    method: 'POST',
    data,
  });
}

export async function getCallConfig_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/services/stu/course/callConfig`, {
    method: 'GET',
    params: data,
  });
}
