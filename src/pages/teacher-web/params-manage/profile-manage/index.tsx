import { Fragment, useRef, useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Divider, Button, Select, message, Space, Popconfirm, Switch, Input } from 'antd';
import { useProfileModel } from './../model';
import CourceModel from '../components/CourceModel';
import { history, useModel } from 'umi';
import BtnAuth from '@/components/BtnAuth';
import UserProfileModal from '../components/userProfileModal';

import config from '@/config';
import { handleKeyPress } from '@/utils';
const successCode = config.successCode;

export default () => {
  const actionRef = useRef<any>();
  const courceModelRef = useRef<any>();
  const profileModelRef = useRef<any>();

  const { getProfilePage, getProfileAdd, getProfileEdit, getProfileDelete, getProfileDetail } = useProfileModel();

  const [courceListData, setCourceList] = useState<any>([]);

  const getCourceModelList = async (payload: any) => {
    let params = {
      ...payload,
      modelName: payload?.modelName?.join(','),
      page: payload?.current,
    };
    delete params?.current;
    let res = await getProfilePage(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const addProfile = () => {
    profileModelRef?.current?.open({}, 'add');
  };

  const editCource = async (r: any) => {
    const res = await getProfileDetail({ customerProfileId: r.id });
    profileModelRef?.current?.open(r, 'edit', res?.data || []);
  };

  const comfirmSubmit = async (data: any, rowData = "", pageType: any) => {
    let params = {
      ...data,
      id: rowData?.id,
    };
    let res;
    if (pageType == 'add') {
      res = await getProfileAdd(params);
    } else if (pageType == 'edit') {
      res = await getProfileEdit(params);
    }
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      profileModelRef?.current?.close();
      actionRef?.current?.reloadAndRest();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const deleteModel = async (record: any) => {
    let res = await getProfileDelete(record);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reloadAndRest();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const toIntentionPage = (r: any) => {
    history.push({
      pathname: '/front/teacher/paramsManage/intention',
      query: {
        id: r.id,
        title: r.modelName,
      },
    });
  };

  const columns: any[] = [
    {
      title: '客户画像名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请输入客户画像名称',
      },
      renderFormItem: () => <Input placeholder="请输入客户画像名称" onKeyPress={handleKeyPress} />,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return r.creator || '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return r.updateBy || '-';
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      width: 300,
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <div>
            <Space>
              <BtnAuth authKey={'paramsManage_systemManage_edit_btn'}>
                <Button type="link" onClick={() => editCource(r)}>
                  编辑
                </Button>
              </BtnAuth>
              <BtnAuth authKey={'paramsManage_systemManage_delete_btn'}>
                <Divider type="vertical" />
                <Popconfirm
                  title="你确定要删除这个模型吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => deleteModel(r)}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </BtnAuth>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <PageContainer
        header={{
          title: '系统管理',
          breadcrumb: {},
        }}
      >
        <ProTable
          rowKey={(record: any) => record?.id}
          actionRef={actionRef}
          headerTitle="客户画像名称"
          toolBarRender={() => [
            <BtnAuth authKey={'paramsManage_systemManage_add_btn'}>
              <Button type="primary" key="sameStep" onClick={addProfile}>
                新建
              </Button>
            </BtnAuth>,
          ]}
          options={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 'auto',
          }}
          columns={columns}
          scroll={{ x: columns?.length * 150 }}
          request={async (params = {}, sort, filter) => {
            return getCourceModelList({ ...params });
          }}
        />
      </PageContainer>
      {/* <CourceModel cref={courceModelRef} comfirmSubmit={comfirmSubmit} /> */}
      <UserProfileModal cref={profileModelRef} comfirmSubmit={comfirmSubmit} />
    </Fragment>
  );
};
