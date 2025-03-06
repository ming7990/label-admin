import { Fragment, useRef, useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Divider, Button, Select, message, Space, Popconfirm, Switch } from 'antd';
import { usePlotModel } from './../model';
import GenreClassModel from '../components/genreClassModel';
import { history, useModel } from 'umi';
import BtnAuth from '@/components/BtnAuth';

import config from '@/config';
const successCode = config.successCode;

export default () => {
  const actionRef = useRef<any>();
  const genreClassModelRef = useRef<any>();

  const { getPlotPage, getPlotList, getPlotAdd, getPlotEdit, getPlotDelete } = usePlotModel();

  const [courceListData, setCourceList] = useState<any>([]);

  useEffect(() => {
    getCourceListData();
  }, []);

  const getCourceListData = async () => {
    let res = await getPlotList({});
    setCourceList(res?.data);
  };

  const getCourceModelList = async (payload: any) => {
    let params = {
      ...payload,
      modelName: payload?.modelName?.join(','),
      page: payload?.current,
    };
    delete params?.current;
    let res = await getPlotPage(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const addCourceModel = () => {
    genreClassModelRef?.current?.open({}, 'add');
  };

  const editCource = (r: any) => {
    genreClassModelRef?.current?.open(r, 'edit');
  };

  const comfirmSubmit = async (formVal: any, rowData: any, pageType: any) => {
    let params = {
      ...formVal,
      id: rowData?.id,
    };
    let res;
    if (pageType == 'add') {
      res = await getPlotAdd(params);
    } else if (pageType == 'edit') {
      res = await getPlotEdit(params);
    }
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      genreClassModelRef?.current?.close();
      actionRef?.current?.reloadAndRest();
      getCourceListData();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const deleteModel = async (record: any) => {
    let res = await getPlotDelete(record);
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
      title: '大模型剧情分类',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: true,
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择剧情分类',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择剧情分类"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.name as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {courceListData?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.name} item={item}>
                {item?.name}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '剧情分类名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: false,
    },
    {
      title: '启动状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return Number(r.status) === 1 ? '开' : '关';
      },
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
      width: 150,
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <div>
            <Space>
              <BtnAuth authKey={'paramsManage_modelPlotManage_edit_btn'}>
                <Button type="link" onClick={() => editCource(r)}>
                  编辑
                </Button>
              </BtnAuth>
              <BtnAuth authKey={'paramsManage_modelPlotManage_delete_btn'}>
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
              {/* <BtnAuth authKey={'paramsManage_modelPlotManage_edit_btn'}>
                <Divider type="vertical" />
                <Switch checked={true} />
              </BtnAuth> */}
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
          toolBarRender={() => [
            <BtnAuth authKey={'paramsManage_modelPlotManage_add_btn'}>
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
      <GenreClassModel cref={genreClassModelRef} comfirmSubmit={comfirmSubmit} />
    </Fragment>
  );
};
