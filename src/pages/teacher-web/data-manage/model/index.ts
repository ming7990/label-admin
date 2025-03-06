import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
import {
  taskReportApi,
  studentReportApi,
  taskReportDetailApi,
  studentReportDetailApi,
  signReportApi,
  signDeleteApi,
  studentOrSignExportApi,
  studentDetailReporApi
} from './api';
const { successCode } = config;

export const useDataManageModel = () => {
  const [loading, setLoading] = useState<any>(false);
  // 分页-任务数据列表
  const getTaskReport = async (payload: any) => {
    setLoading(true);
    let params = {
      ...payload,
      taskIdList: payload?.taskName?.length > 0 ? payload.taskName : undefined,
      accountList: payload?.creator?.length > 0 ? payload.creator : undefined,
      page: payload?.current,
    };
    delete params?.current;
    delete params?.taskName;
    delete params?.creator;
    let res = await taskReportApi(params);
    setLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  // 分页-学员数据列表
  const getStudentReport = async (payload: any) => {
    setLoading(true);
    let params = {
      ...payload,
      accountList: payload?.userName?.length > 0 ? payload.userName : undefined,
      groupIdList: payload?.groupList?.length > 0 ? payload.groupList : undefined,
      page: payload?.current,
    };
    delete params?.current;
    delete params?.userName;
    delete params?.groupList;
    let res = await studentReportApi(params);
    setLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  // 分页-任务详细数据列表
  const getTaskReportDetail = async (payload: any) => {
    setLoading(true);
    let params = {
      ...payload,
      courseIdList: payload?.taskNodeName?.length > 0 ? payload.taskNodeName : undefined,
      accountList: payload?.userName?.length > 0 ? payload.userName : undefined,
      page: payload?.current,
    };
    delete params?.current;
    delete params?.taskNodeName;
    delete params?.userName;
    let res = await taskReportDetailApi(params);
    setLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  // 分页-学员详细数据列表
  const getStudentReportDetail = async (payload: any) => {
    setLoading(true);
    let params = {
      ...payload,
      taskIdList: payload?.taskName?.length > 0 ? payload.taskName : undefined,
      courseIdList: payload?.taskNodeName?.length > 0 ? payload.taskNodeName : undefined,
      page: payload?.current,
    };
    delete params?.current;
    delete params?.taskName;
    delete params?.taskNodeName;
    let res = await studentReportDetailApi(params);
    setLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  // 签到相关;
  const studentOrSignExport = async (data: any, type: string) => {
    const res = await studentOrSignExportApi(data, type);
  };

  // 分页-签到数据列表
  const getSignReport = async (payload: any) => {
    setLoading(true);
    let params = {
      ...payload,
      accountList: payload?.userName?.length > 0 ? payload.userName : undefined,
      groupIdList: payload?.groupList?.length > 0 ? payload.groupList : undefined,
      page: payload?.current,
    };
    delete params?.current;
    delete params?.userName;
    delete params?.groupList;

    if (params.time && params.time.length) {
      params.beginTime = params.time[0] + ' 00:00:00';
      params.endTime = params.time[1] + ' 23:59:59';
    }
    delete params.time;
    let res = await signReportApi(params);
    setLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  const signDelete = async (data: any) => {
    const res = await signDeleteApi(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    getTaskReport,
    getStudentReport,
    getTaskReportDetail,
    getStudentReportDetail,
    // 签到;
    getSignReport,
    signDelete,
    studentOrSignExport,
    studentDetailReporApi,
  };
};
