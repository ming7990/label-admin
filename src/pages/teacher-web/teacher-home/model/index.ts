import { useState } from 'react';
import { api_taskCount, api_teachTaskDataPage } from './api';
import config from '@/config';
import { message } from 'antd';

const { successCode } = config;

export const useTaskModel = () => {
  const [loading, setLoading] = useState<any>(false);

  // 任务统计接口
  const [taskCountInfo, setTaskCountInfo] = useState<any>({}); // 任务数量信息

  const getTaskCount = async (params: any) => {
    setLoading(true);
    let res: any = await api_taskCount(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.warning(res.resultDesc || '获取数据失败');
      return;
    }
    const { data = {} } = res;
    setTaskCountInfo(data);
  };

  // 任务数据统计接口
  const [courselist, setCourseList] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalPage, setTotalPage] = useState<number>(0);

  const getTeachTaskData = async (params: any) => {
    setLoading(true);
    let res: any = await api_teachTaskDataPage(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.warning(res.resultDesc || '获取数据失败');
      return;
    }
    const { data = {} } = res;
    setCourseList(data.list);
    setPage(data.page);
    setPageSize(data.pageSize);
    setTotalPage(data.totalPage);
  };

  return {
    loading,
    setLoading,
    // 任务统计接口
    getTaskCount,
    taskCountInfo,
    // 任务数据统计接口
    getTeachTaskData,
    courselist,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPage,
    setTotalPage,
  };
};
