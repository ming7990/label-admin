import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';

const { successCode } = config;

import {
  getFileRecordList,
  fileRecordDelete,
  gelClassAll as api_gelClassAll,
  gelClassList as api_gelClassList,
  addClass as api_addClass,
  editClass as api_editClass,
  deleteClass as api_deleteClass,
} from './api';
import { createId } from '../../video-list/model/api';
export const useTableModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [classAll, setClassAll] = useState<any[]>([]);

  const getTableList = async (data: any) => {
    setTableLoading(true);
    const res: any = await getFileRecordList(data);
    setTableLoading(false);
    console.log(res, 'getFileRecordList');
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  const onfileRecordDelete = async (params: any) => {
    let res = await fileRecordDelete(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  // 视频分类;
  const getClassAll = async () => {
    api_gelClassAll({ type: 'file' }).then((res) => {
      if (res?.resultCode == successCode) {
        setClassAll(res?.data || []);
      } else {
        message.error(res?.resultDesc);
      }
    });
  };

  // 视频分类;
  const getClassList = async (params: any): Promise<any> => {
    const res: any = await api_gelClassList(params);
    console.log(res, 'getClassList');
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  // 新增视频分类
  const addClass = async (params: any): Promise<any> => {
    const res: any = await api_addClass(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  // 编辑视频分类
  const editClass = async (params: any): Promise<any> => {
    const res: any = await api_editClass(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  // 删除视频分类
  const deleteClass = async (params: any): Promise<any> => {
    const res: any = await api_deleteClass(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    tableLoading,
    setTableLoading,
    getTableList,
    fileRecordDelete: onfileRecordDelete, // 删除共享记录;
    classAll,
    getClassAll,
    createId: () => createId(),
    getClassList,
    addClass,
    editClass,
    deleteClass,
  };
};
