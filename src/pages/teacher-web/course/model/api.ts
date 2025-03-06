import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;
// 课程-------------------------
/** 获取教师页课程分页列表 **/
export async function getCourseList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/coursePage`, {
    method: 'POST',
    data,
  });
}

/** 获取教师页课程所有列表 **/
export async function getAllCourseList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseList`, {
    method: 'POST',
    data,
  });
}

/** 教师页课程新增 **/
export async function _courseAdd(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseAdd`, {
    method: 'POST',
    data,
  });
}

/** 教师页课程复制 **/
export async function _courseCopy(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseCopy`, {
    method: 'POST',
    data,
  });
}
/** 教师页课详情 **/
export async function _courseDetail(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseDetail`, {
    method: 'POST',
    data,
  });
}

/** 教师页课程编辑 **/
export async function _courseEdit(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseEdit`, {
    method: 'POST',
    data,
  });
}

/** 教师页课程删除 **/
export async function _courseDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseDelete`, {
    method: 'POST',
    data,
  });
}

/** 教师页课程发布 **/
export async function _coursePublish(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/coursePublish`, {
    method: 'POST',
    data,
  });
}

/** 教师页课程下线 **/
export async function _courseDown(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/courseDown`, {
    method: 'POST',
    data,
  });
}

//画布-----------------------
//校验
export async function courseCheck_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/services/course/courseCheck`, {
    method: 'POST',
    data,
  });
}
//保存画布
export async function postDrawPanel_API(data?: { [key: string]: any }) {
  return request(`${baseUrl}/services/course/courseLineInfoSave`, {
    method: 'POST',
    data,
  });
}
//获取画布
export async function getDrawPanel_API(data?: any) {
  return request(`${baseUrl}/services/course/courseNodeLineInfo`, {
    method: 'POST',
    data,
  });
}
//新增节点
export async function addNode_API(data?: any) {
  return request(`${baseUrl}/services/course/courseNodeInfoAdd`, {
    method: 'POST',
    data,
  });
}
//删除节点
export async function deleteNode_API(data?: any) {
  return request(`${baseUrl}/services/course/courseNodeInfoDelete`, {
    method: 'POST',
    data,
  });
}

//查询节点信息
export async function courseNodeInfo_API(data?: any) {
  return request(`${baseUrl}/services/course/courseNodeInfo`, {
    method: 'POST',
    data,
  });
}
//节点信息保存
export async function courseNodeSave_API(data?: any) {
  return request(`${baseUrl}/services/course/courseNodeSave`, {
    method: 'POST',
    data,
  });
}

//查询线信息
export async function courseLineInfo_API(data?: any) {
  return request(`${baseUrl}/services/course/courseLineInfo`, {
    method: 'POST',
    data,
  });
}
//线信息保存
export async function courseLineSave_API(data?: any) {
  return request(`${baseUrl}/services/course/courseLineSave`, {
    method: 'POST',
    data,
  });
}

//流程测试---
export async function _dialoguePublish(data?: any) {
  return request(`${baseUrl}/services/course/coursePublishTest`, {
    method: 'POST',
    data,
  });
}
export async function _dialogueBegin(data?: any) {
  return request(`${baseUrl}/services/course/dialogueBegin`, {
    method: 'POST',
    data,
  });
}
export async function _dialogueSend(data?: any) {
  return request(`${baseUrl}/services/course/dialogueSend`, {
    method: 'POST',
    data,
  });
}
export async function _dialogueFinish(data?: any) {
  return request(`${baseUrl}/services/course/dialogueFinish`, {
    method: 'POST',
    data,
  });
}

//客户信息---
export async function courseCustomInfo_API(data?: any) {
  return request(`${baseUrl}/services/course/courseCustomInfo`, {
    method: 'POST',
    data,
  });
}
export async function courseCustomInfoSave_API(data?: any) {
  return request(`${baseUrl}/services/course/courseCustomInfoSave`, {
    method: 'POST',
    data,
  });
}

//通话设置
export async function courseCallConfig_API(data?: any) {
  return request(`${baseUrl}/services/course/courseCallConfig`, {
    method: 'POST',
    data,
  });
}
export async function courseCallConfigSave_API(data?: any) {
  return request(`${baseUrl}/services/course/courseCallConfigSave`, {
    method: 'POST',
    data,
  });
}

//音色设置
export async function courseSoundConfig_API(data?: any) {
  return request(`${baseUrl}/services/course/courseSoundConfig`, {
    method: 'POST',
    data,
  });
}
export async function courseSoundConfigSave_API(data?: any) {
  return request(`${baseUrl}/services/course/courseSoundConfigSave`, {
    method: 'POST',
    data,
  });
}
export async function allVoiceNames_API(params?: any) {
  return request(`${baseUrl}/services/course/allVoiceNames`, {
    method: 'GET',
    params,
  });
}

//结束设置
export async function courseEndConfig_API(data?: any) {
  return request(`${baseUrl}/services/course/courseEndConfig`, {
    method: 'POST',
    data,
  });
}
export async function courseEndConfigSave_API(data?: any) {
  return request(`${baseUrl}/services/course/courseEndConfigSave`, {
    method: 'POST',
    data,
  });
}


/** 大模型剧情列表查询 **/
export async function plotList(params?: Record<string, any>) {
  return request(`${baseUrl}/services/plot/list`, {
    method: 'GET',
    params,
  });
}

export async function courseEditTimbre(data?: any) {
  return request(`${baseUrl}/services/course/courseEditTimbre`, {
    method: 'POST',
    data,
  });
}
