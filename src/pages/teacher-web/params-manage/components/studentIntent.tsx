import ProTable from '@ant-design/pro-table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Divider, Button, Select, message, Space, notification, Popconfirm } from 'antd';
import { useIntentionModel } from './../model';
import { history } from 'umi';
import BtnAuth from '@/components/BtnAuth';

import config from '@/config';
const successCode = config.successCode;

export default () => {
  const query: any = history.location.query || {};
  const id: any = query?.id;

  const actionRef = useRef<any>();

  const { intentListRequest, customerIntentionList, intentSync } = useIntentionModel();

  const [intentList, setIntentList] = useState<any>([]);

  useEffect(() => {
    getIntentList();
  }, []);

  const getIntentList = async () => {
    let res = await intentListRequest({ intentType: 1, modelId: id });
    setIntentList(res?.data);
  };

  const getCustomerIntentionList = async (payload: any) => {
    let params = {
      ...payload,
      modelId: id,
      intentIdList: payload?.intentName?.length > 0 ? payload.intentName : undefined,
      page: payload?.current,
      intentType: 1, //2-客户意图1-学员意图
    };
    delete params?.current;
    delete params?.intentName;
    let res = await customerIntentionList(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const syncStudent = async () => {
    let params = {
      modelId: id,
    };
    let res = await intentSync(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      actionRef?.current?.reloadAndRest();
      getIntentList();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const columns: any[] = [
    {
      title: '意图名称',
      dataIndex: 'intentName',
      key: 'intentName',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请选择意图名称',
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          placeholder="请选择意图名称"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.item?.intentName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {intentList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id} item={item}>
                {item?.intentName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '同步人',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      ellipsis: true,
      search: false,
    },
  ];

  return (
    <Fragment>
      <ProTable
        rowKey={(record: any) => record?.id}
        actionRef={actionRef}
        headerTitle="意图列表"
        toolBarRender={() => [
          <BtnAuth authKey={'paramsManage_intention_sameStep_btn'}>
            <Button type="primary" key="sameStep" onClick={syncStudent}>
              同步
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
          return getCustomerIntentionList({ ...params });
        }}
      />
    </Fragment>
  );
};
