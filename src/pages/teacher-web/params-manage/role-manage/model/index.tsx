import { useState } from 'react';
import { Tabs, Select, Button, Modal, message, Spin, Space, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  api_rolePage,
  api_roleList,
  api_roleSynch,
  api_savePermission,
  api_getPermission,
} from './api';

import config from '@/config';

const { confirm } = Modal;
const { successCode } = config;

export const useRoleManageModel = () => {
  const [loading, setLoading] = useState<any>(false);
  const [roleList, setRoleList] = useState<any>([]);

  // 角色分页查询 接口
  const getRolePage = async (params: any) => {
    params.page = params.current;
    params.idList = params.roleName?.length > 0 ? params.roleName : undefined;
    delete params.current;
    delete params.roleName;
    setLoading(true);
    let res: any = await api_rolePage(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.warning('获取数据失败');
      return {};
    }
    const { data = {} } = res;
    // 按 Protable request 格式返回结果
    return {
      data: data?.list,
      total: data?.totalPage,
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
    };
  };

  // 角色分页查询 接口
  const getRoleList = async (params: any) => {
    params.page = params.current;
    setLoading(true);
    let res: any = await api_roleList(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.warning('获取数据失败');
      setRoleList([]);
      return [];
    }
    const { data = [] } = res;
    // 按 Protable request 格式返回结果
    setRoleList(data);
    return data;
  };

  // 角色同步
  const roleSynch = async (params?: any) => {
    setLoading(true);
    let res: any = await api_roleSynch(params);
    setLoading(false);
    if (res?.resultCode !== successCode) {
      message.error(res?.resultDesc || '同步失败');
      return false;
    }
    message.success(res?.resultDesc || '同步成功');
    return true;
  };

  // 角色权限查询 接口
  const getPermission = async (params: any) => {
    setLoading(true);
    const res: any = await api_getPermission(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.error('角色权限查询失败');
      return { data: [], result: false };
    }
    const { data = [] } = res;
    return { data: data, result: true };
  };

  // 角色编辑 接口
  const savePermission = async (params: any) => {
    setLoading(true);
    const res: any = await api_savePermission(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.error('编辑权限失败');
      return false;
    }
    message.success('编辑权限成功');
    return true;
  };

  return {
    loading,
    roleList,
    setLoading,
    getRolePage,
    getRoleList,
    roleSynch,
    getPermission,
    savePermission,
  };
};
