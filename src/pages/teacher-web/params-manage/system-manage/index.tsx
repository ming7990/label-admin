import { Fragment, useRef, useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Divider, Button, Select, message, Space, Popconfirm } from 'antd';
import { useCourceModel } from './../model';
import CourceModel from '../components/courceModel';
import { history, useModel } from 'umi';
import BtnAuth from '@/components/BtnAuth';

import config from '@/config';
const successCode = config.successCode;

export default () => {
  const actionRef = useRef<any>();
  const courceModelRef = useRef<any>();

  const { courceList, courceData, deleteCource, modelAdd, modelEdit } = useCourceModel();

  const [courceListData, setCourceList] = useState<any>([]);

  useEffect(() => {
    getCourceListData();
  }, []);

  const getCourceListData = async () => {
    let res = await courceData({});
    setCourceList(res?.data);
  };

  const getCourceModelList = async (payload: any) => {
    let params = {
      ...payload,
      modelName: payload?.modelName?.join(','),
      page: payload?.current,
    };
    delete params?.current;
    let res = await courceList(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const addCourceModel = () => {
    courceModelRef?.current?.open({}, 'add');
  };

  const editCource = (r: any) => {
    courceModelRef?.current?.open(r, 'edit');
  };

  const comfirmSubmit = async (formVal: any, rowData: any, pageType: any) => {
    let params = {
      ...formVal,
      id: rowData?.id,
    };
    let res;
    if (pageType == 'add') {
      res = await modelAdd(params);
    } else if (pageType == 'edit') {
      res = await modelEdit(params);
    }
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      courceModelRef?.current?.close();
      actionRef?.current?.reloadAndRest();
      getCourceListData();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const deleteModel = async (record: any) => {
    let res = await deleteCource(record);
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
      title: '课程模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请选择模型名称',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择模型名称"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.modelName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {courceListData?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.modelName} item={item}>
                {item?.modelName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '模型地址',
      dataIndex: 'modelAddress',
      key: 'modelAddress',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return r.userName || '-';
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
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return r.updateUserName || '-';
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
              <BtnAuth authKey={'paramsManage_systemManage_intention_btn'}>
                <Divider type="vertical" />
                <Button type="link" onClick={() => toIntentionPage(r)}>
                  意图管理
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
          headerTitle="课程模型列表"
          toolBarRender={() => [
            <BtnAuth authKey={'paramsManage_systemManage_add_btn'}>
              <Button type="primary" key="sameStep" onClick={addCourceModel}>
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
      <CourceModel cref={courceModelRef} comfirmSubmit={comfirmSubmit} />
    </Fragment>
  );
};
