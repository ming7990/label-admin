import { useState } from "react";
import { message } from 'antd';
import config from '@/config/index';
import {
  getList,
  addOrUpdate,
  deleteItem,
  detail,
} from './api';
const { successCode } = config;

export function useTableModel() {
  const [tableLoading, setTableLoading] = useState(false);

  const tableList = async (params: any) => {
    setTableLoading(true);
    const res = await getList(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };

  // 编辑或新增
  const addOrEdit = (params: any, type: 'add'|'edit', cb?: any) => {
    addOrUpdate(params, type).then(res => {
      if (res?.resultCode == successCode) {
        message.success(res?.resultDesc);
        cb && cb(true);
      } else {
        cb && cb(false);
        message.error(res?.resultDesc);
      }
    }).catch(()=> {
      cb && cb(false);
    });
  };

  const onDelete = async (data: any) => {
    const res = await deleteItem(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  return {
    tableLoading,
    tableList,
    addOrEdit,
    onDelete,
  };
}