import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

/** 获取共享记录分页列表 **/
export function getFileRecordList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/fileRecord/page`, {
    method: 'GET',
    params: data,
  });
}

/** 删除共享记录 **/
export function fileRecordDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/fileRecord/delete`, {
    method: 'POST',
    data,
  });
}

/** 视频分类S **/
export function gelClassAll(data?: Record<string, any>) {
  return request(`${baseUrl}/services/common/class/all`, {
    method: 'GET',
    params: data,
  });
}

export function gelClassList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/common/class/page`, {
    method: 'GET',
    params: data,
  });
}

export function addClass(data?: Record<string, any>) {
  return request(`${baseUrl}/services/common/class/add`, {
    method: 'POST',
    data,
  });
}

export function editClass(data?: Record<string, any>) {
  return request(`${baseUrl}/services/common/class/edit`, {
    method: 'POST',
    data,
  });
}

export function deleteClass(data?: Record<string, any>) {
  return request(`${baseUrl}/services/common/class/delete`, {
    method: 'POST',
    data,
  });
}

/** 视频分类E **/

export function getShareVideoList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/file/videoList`, {
    method: 'GET',
    params: data,
  });
}

export function addShare(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/fileRecord/add`, {
    method: 'POST',
    data,
  });
}

export function editShare(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/fileRecord/edit`, {
    method: 'POST',
    data,
  });
}
