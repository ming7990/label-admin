import { Fragment, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Input, message, Popconfirm, Space } from 'antd';
import { useSoundConfigModel } from '../model';
import BtnAuth from '@/components/BtnAuth';
import SoundConfigDrawer from '../components/soundConfigDrawer';
import { handleKeyPress } from '@/utils';

export default () => {
  const SEX_MAP = {
    '0': '男',
    '1': '女'
  };

  const TYPE_MAP = {
    '0': '严厉',
    '1': '温柔'
  };
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<any>();
  const soundConfigDrawerRef = useRef<any>();
  const {
    loading,
    timbreListApi,
    timbreAddApi,
    timbreEditApi,
    timbreDeleteApi,
  } = useSoundConfigModel();

  const getVoiceProfileList = async (payload: any) => {
    console.log('getVoiceProfileList payload:', payload);

    // 保留原有接口调用
    const { current, ...restParams } = payload
    const res = await timbreListApi({ page: current, ...restParams });
    console.log('getVoiceProfileList response:', res);

    const result = {
      data: res?.data?.list || [],
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };

    console.log('getVoiceProfileList formatted result:', result);
    return result;
  };

  const editVoiceProfile = async (r: any) => {
    console.log('editVoiceProfile record:', r);
    // setIsEdit(true)
    soundConfigDrawerRef?.current?.open('edit', r);
  };

  const comfirmSubmit = async (params: any) => {
    console.log('comfirmSubmit:', params)
    // 保留原有接口调用
    const res = params.id
      ? await timbreEditApi(params)
      : await timbreAddApi(params);
    console.log('comfirmSubmit response:', res);
    if (res.resultCode === '100') {
      message.success(res.resultDesc || '操作成功');
      // 刷新表格数据  
      actionRef.current?.reload();
    } else {
      message.error(res.resultDesc || '操作失败');
    }
  };

  const deleteProfile = async (record: any) => {
    console.log('deleteProfile record:', record);
    // 保留原有接口调用
    const res = await timbreDeleteApi({ id: record.id });
    console.log('deleteProfile response:', res);
    if (res.resultCode === '100') {
      message.success(res.resultDesc || '操作成功');
      // 刷新表格数据  
      actionRef.current?.reload();
    } else {
      message.error(res.resultDesc || '操作失败');
    }
  };

  const columns: any[] = [
    {
      title: '音色名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请输入音色名称',
        allowClear: true,
      },
      renderFormItem: () => <Input placeholder="请输入音色名称" onKeyPress={handleKeyPress} />,
    },
    {
      title: '音色性别',
      dataIndex: 'sex',
      key: 'sex',
      ellipsis: true,
      search: false,
      render: (_, r) => SEX_MAP[String(r.sex)] || '-',
    },
    {
      title: '音色分类',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      search: false,
      render: (_, r) => TYPE_MAP[String(r.type)] || '-',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      search: false,
      render: (_, r) => r.creator || '-',
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
      render: (_, r) => r.updateBy || '-',
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
      width: 150,
      valueType: 'option',
      render: (_, r) => (
        <Space>
          <BtnAuth authKey={'paramsManage_soundConfigManage_edit_btn'}>
            <Button type="link" onClick={() => editVoiceProfile(r)}>
              编辑
            </Button>
          </BtnAuth>
          <BtnAuth authKey={'paramsManage_soundConfigManage_delete_btn'}>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除这个音色配置吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => deleteProfile(r)}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </BtnAuth>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <PageContainer
        header={{
          title: '音色配置管理',
          breadcrumb: {},
        }}
      >
        <ProTable
          rowKey="id"
          actionRef={actionRef}
          headerTitle="音色配置管理"
          toolBarRender={() => [
            <BtnAuth authKey={'paramsManage_soundConfigManage_add_btn'}>
              <Button
                key="add"
                type="primary"
                onClick={() => soundConfigDrawerRef?.current?.open('add', {})}
                style={{ float: 'right' }}
              >
                新建
              </Button></BtnAuth>
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
          request={getVoiceProfileList}
          loading={loading}
        />
      </PageContainer>
      <SoundConfigDrawer cref={soundConfigDrawerRef} isEdit={isEdit} comfirmSubmit={comfirmSubmit}></SoundConfigDrawer>
    </Fragment>
  );
};