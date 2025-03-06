import config from '@/config';
import { message } from 'antd';
import { useState, useRef } from 'react';

const { successCode } = config;

import {
  getVideoList,
  createId,
} from './api';

export const useTableModel = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [hasData, setHasData] = useState<boolean>(false);

  const getTableList = async (data: any) => {
    setTableLoading(true);
    const res: any = await getVideoList(data);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      setHasData(res?.data?.totalPage > 0);
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  }

  return {
    tableLoading,
    getTableList,
    createId,
  }
}
