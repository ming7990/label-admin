import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;
/** 获取试卷 **/
export async function getPaper(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/paper/obtain`, {
    method: 'GET',
    params: data,
  });
}

/** 交卷 **/
export async function submitPaper(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/paper/submit`, {
    method: 'POST',
    data,
  });
}

/** 获取试卷分数 **/
export async function getPaperScore(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/score/obtain`, {
    method: 'GET',
    params: data,
  });
}

/** 获取试卷的答案 **/
export async function getHistoryAnswer(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/history/answer`, {
    method: 'GET',
    params: data,
  });
}

/** 获取试卷用户的答题情况 **/
export async function getuserAnswer(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/history/userAnswer`, {
    method: 'GET',
    params: data,
  });
}
