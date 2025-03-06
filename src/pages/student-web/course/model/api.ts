import { request } from '@/services/request';
import config from '@/config/index';

const baseUrl: string = config.basePath;

export async function getStudentCourse_API(data?: any) {
  return request(`${baseUrl}/services/stu/course/coursePage`, {
    method: 'POST',
    data,
  });
}

export async function getStudentCourseDetail_API(data?: any) {
  return request(`${baseUrl}/services/student/course/detail`, {
    method: 'GET',
    params: data,
  });
}

export async function studyNumApi(data?: any) {
  return request(`${baseUrl}/services/stu/course/courseCount`, {
    method: 'post',
    data: data,
  });
}
