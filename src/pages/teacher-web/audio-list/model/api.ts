import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;
/** 获取视频分页列表 **/
export function getVideoList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/video/list`, {
    method: 'GET',
    params: data,
  });
}

export function videDelete(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/video/delete`, {
    method: 'POST',
    data,
  });
}
// 新增或编辑;
export function addOrUpdate(data: Record<string, any>, type: 'add' | 'edit') {
  return request(`${baseUrl}/services/course/video/${type}`, {
    method: 'POST',
    data,
  });
}
// 获取文件列表;
export function videoFileList(data?: Record<string, any>, pageSource?: string) {
  let url = '/services/course/video/fileList';
  let params = data;
  if (pageSource === 'share') {
    url = '/services/share/file/videoList';
    params = {
      shareId: data.courseVideoId,
    };
  }
  return request(`${baseUrl}${url}`, {
    method: 'GET',
    params: params,
  });
}

// 视频课程详情;
export function videoDetail(data?: Record<string, any>, pageSource?: string) {
  let url = '/services/course/video/detail';
  let params = data;
  if (pageSource === 'share') {
    url = '/services/share/fileRecord/detail';
    params = {
      shareId: data.courseVideoId,
    };
  }
  return request(`${baseUrl}${url}`, {
    method: 'GET',
    params: params,
  });
}

// 视频课程详情;
export function createId() {
  return request(`${baseUrl}/services/common/createId`, {
    method: 'GET',
  });
}

// 视频课程上传学习情况;
export function videoSubmit(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/process/submit`, {
    method: 'POST',
    data,
  });
}

// 视频详情;
export function fetchVideoInfo(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/config/fetch`, {
    method: 'GET',
    params: data,
  });
}

export function deleteVideoFile(data?: Record<string, any>) {
  return request(`${baseUrl}/services/course/video/fileDelete`, {
    method: 'POST',
    data,
  });
}

export function videoMove(data?: Record<string, any>) {
  return request(`${baseUrl}/services/task/course/video/move`, {
    method: 'POST',
    data,
  });
}

// 第一个目录;
export function classAll(data?: Record<string, any>) {
  return request(`${baseUrl}/services/common/class/all`, {
    method: 'GET',
    params: data,
  });
}
// 第二个目录
export function fileRecordAll(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/fileRecord/all`, {
    method: 'GET',
    params: data,
  });
}

// 共享文件列表;
export function shareVideoList(data?: Record<string, any>) {
  return request(`${baseUrl}/services/share/file/videoList`, {
    method: 'GET',
    params: data,
  });
}
