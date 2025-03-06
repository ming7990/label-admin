import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取课程练习记录-列表 **/
export async function learnRecordApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/stu/history/learn`, {
    method: 'POST',
    data: params,
  });
}

/** 获取课程列表 **/
export async function courseListApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/stu/history/courseList`, {
    method: 'POST',
    data: params,
  });
}

/** 获取扣分列表 **/
export async function scoreApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/stu/course/score`, {
    method: 'POST',
    data: params,
  });
}

/** 获取对话信息 **/
export async function dialogueRecordApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/stu/course/dialogue`, {
    method: 'POST',
    data: params,
  });
}
