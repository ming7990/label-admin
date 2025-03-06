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

// 视频课程详情;
export function createId() {
  return request(`${baseUrl}/services/common/createId`, {
    method: 'GET',
  });
}
