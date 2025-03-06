import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;
/** 获取题目分页列表 **/
export function getQuestionList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/search`, {
    method: 'GET',
    params: data,
  });
}

export function questionDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/delete`, {
    method: 'POST',
    data,
  });
}
// 题目类型查询;
export function getQuestionType(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/questionType/search`, {
    method: 'GET',
    params: data,
  });
}
// 题目分数设置;
export function questionSetScore(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/setScore`, {
    method: 'POST',
    data,
  });
}

/* 创建题目; */

// 题目新增;
export function questionInsert(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/insert`, {
    method: 'POST',
    data,
  });
}
// 题目详情;
export function questionDetail(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/detail`, {
    method: 'GET',
    params: data,
  });
}
// 题目编辑;
export function questionUpdate(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/update`, {
    method: 'POST',
    data,
  });
}

// 题目序号;
export function questionNumber(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/text/question/number`, {
    method: 'GET',
    params: data,
  });
}
