import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;
//任务---------------------------------------
/** 获取任务分页列表 **/
export async function _taskPage(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskPage`, {
    method: 'POST',
    data,
  });
}

/** 获取任务所有列表 **/
export async function _taskList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskList`, {
    method: 'POST',
    data,
  });
}

/** 任务新增 **/
export async function _taskAdd(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskAdd`, {
    method: 'POST',
    data,
  });
}

/** 任务详情 **/
export async function _taskDetail(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskDetail`, {
    method: 'POST',
    data,
  });
}

/** 任务编辑 **/
export async function _taskEdit(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskEdit`, {
    method: 'POST',
    data,
  });
}

/** 任务删除 **/
export async function _taskDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskDelete`, {
    method: 'POST',
    data,
  });
}

/** 任务开启 **/
export async function _taskOpen(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskOpen`, {
    method: 'POST',
    data,
  });
}

/** 任务关闭 **/
export async function _taskClose(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskClose`, {
    method: 'POST',
    data,
  });
}

/** 获取画布 **/
export async function _taskNodeLineInfo(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskNodeLineInfo`, {
    method: 'POST',
    data,
  });
}

/** 保存画布 **/
export async function _taskLineInfoSave(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/taskLineInfoSave`, {
    method: 'POST',
    data,
  });
}

/** 获取组别 **/
export async function _getGroupList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/group/groupList`, {
    method: 'POST',
    data,
  });
}

/** 保存课程节点配置 **/
export async function taskConfigApi(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/config/save`, {
    method: 'POST',
    data,
  });
}
/** 获取课程节点配置 **/
export async function taskConfigFetchApi(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/config/fetch`, {
    method: 'GET',
    params: data,
  });
}