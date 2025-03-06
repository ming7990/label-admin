import { request } from '@/services/request';
import config from '@/config/index';
import { objectToGetParams } from '@/utils';

const baseUrl: string = config.basePath;

/** 获取数据管理任务数据-列表 **/
export async function taskReportApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/taskReport`, {
    method: 'POST',
    data: params,
  });
}

/** 获取数据管理学员数据-列表 **/
export async function studentReportApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/studentReport`, {
    method: 'POST',
    data: params,
  });
}

/** 获取数据管理任务详细数据-列表 **/
export async function taskReportDetailApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/taskReportDetail`, {
    method: 'POST',
    data: params,
  });
}

/** 获取数据管理学员详细数据-列表 **/
export async function studentReportDetailApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/studentReportDetail`, {
    method: 'POST',
    data: params,
  });
}


/** 获取数据管理签到-列表 **/
export async function signReportApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/signIn/search`, {
    method: 'POST',
    data: params,
  });
}
/** 导出 **/
export async function studentOrSignExportApi(params: Record<string, any>, type: string) {
  const params_str = objectToGetParams(params)
  let url = type == 'sign' ? `${baseUrl}/services/report/signIn/export` : `${baseUrl}/services/report/student/export`;
  if (params_str) url += '?' + params_str;
  console.log(url);
  var a = document.createElement('a');
  a.href = url;
  url = a.href;
  window.open(url, '_blank');
}
/** 删除 **/
export async function signDeleteApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/signIn/delete`, {
    method: 'POST',
    data: params,
  });
}

/** 学员详细数据查询 **/
export async function studentDetailReporApi(params?: Record<string, any>) {
  return request(`${baseUrl}/services/report/studentDetailReport`, {
    method: 'POST',
    data: params,
  });
}

