import { useState } from 'react';
import { Tabs, Select, Button, Modal, message, Spin, Space, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { api_workPlacePage, api_workPlaceAdd, api_workPlaceEdit, api_workPlaceDelete } from './api';
import BtnAuth from '@/components/BtnAuth';
import config from '@/config';

const { confirm } = Modal;
const { successCode } = config;

export const getWorkplaceColumns = (editAct: any, deleteAct: any): any[] => {
  return [
    {
      title: '职场名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      render: (v: any, r: any) => {
        return r.creator || '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <Space>
            <BtnAuth authKey={'paramsManage_userManage_workplace_edit_btn'}>
              <a onClick={() => editAct(r)}>编辑</a>
            </BtnAuth>
            <BtnAuth authKey={'paramsManage_userManage_workplace_delete_btn'}>
              <a
                style={{ color: '#FF4D4F' }}
                onClick={() => {
                  confirm({
                    title: '确定要删除吗?',
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      return new Promise(async (resolve, reject) => {
                        // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        // const res: any = await api_workPlaceDelete({ id: r.id });
                        const res: any = await deleteAct({ id: r.id });
                        if (res.resultCode !== successCode) {
                          Modal.error({
                            title: '删除失败！',
                            content: res.resultDesc,
                          });
                          reject({});
                          return;
                        }
                        message.success('删除数据成功');
                        resolve({});
                      }).catch((e) => console.log('删除数据报错', e));
                    },
                    onCancel() {},
                  });
                }}
              >
                删除
              </a>
            </BtnAuth>
          </Space>
        );
      },
    },
  ];
};

export const useWorkPlaceModel = () => {
  const [loading, setLoading] = useState<any>(false);

  // 职场分页查询 接口
  const getWorkPlacePage = async (params: any) => {
    params.page = params.current;
    setLoading(true);
    let res: any = await api_workPlacePage(params);
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

  // 职场新增 接口
  const addWorkPlace = async (params: any) => {
    setLoading(true);
    const res: any = await api_workPlaceAdd(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.error('新增数据失败');
      return false;
    }
    message.success('新增数据成功');
    return true;
  };

  // 职场删除 接口
  const workPlaceDelete = async (params: any) => {
    setLoading(true);
    const res: any = await api_workPlaceDelete(params);
    setLoading(false);
    return res;
  };

  // 职场编辑 接口
  const workPlaceEdit = async (params: any) => {
    setLoading(true);
    const res: any = await api_workPlaceEdit(params);
    setLoading(false);
    if (res.resultCode !== successCode) {
      message.error('编辑数据失败');
      return false;
    }
    message.success('编辑数据成功');
    return true;
  };

  return {
    loading,
    setLoading,
    getWorkPlacePage,
    addWorkPlace,
    workPlaceDelete,
    workPlaceEdit,
  };
};
