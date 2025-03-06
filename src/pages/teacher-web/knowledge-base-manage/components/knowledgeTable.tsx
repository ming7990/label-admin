import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { knowledgeTypeText, KnowledgeTypeList, authConfigList, authConfigListText } from '@/type/knowledge';
import ProTable from '@ant-design/pro-table';
import BtnAuth from '@/components/BtnAuth';
import { Popconfirm, Select, Button, message, Spin, Space, notification, Drawer } from 'antd';
import CreateKnowledge from './modal/createKnowledge';
import { history, useModel } from 'umi';
import { useTableModel } from '../model';
import ReactDOM from 'react-dom';

const KTable: React.FC<any> = (props: any) => {
  const {
    status
  } = props;

  const {
    tableLoading, getTableList, getKnowledgeDetail, knowledgeInsert, knowledgeUpdate, getKnowledgeFiles, getPreviewUrl,
    knowledgeUpDown, knowledgeDelete, knowledgeDirectory, getCreatorList, knowledgeUpload, getKnowledgeId, fileDelete, postVideoMessage,
  } = useTableModel();

  const createRef = useRef(null);
  const tableRef = useRef(null);

  const [creatorList, setcreatorList] = useState<any>([]);

  useEffect(() => {
    getCreatorList({ change: status }).then((res: any) => {
      setcreatorList(res?.data);
    });
  }, [status]);

  const optBtn = (row: any) => {
    if (status == 0) {
      return (
        <BtnAuth authKey={'knowledge_manage_down_btn'}>
          <Popconfirm
            title={
              <div>确定要下架吗？</div>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              let res = await knowledgeUpDown({ knowledgeId: row?.id, status: 1 });
              if (res) {
                tableRef?.current?.reload();
              }
            }}
          >
            <Button type="link" danger>下架</Button>
          </Popconfirm>
        </BtnAuth>
      )
    } else {
      return (
        <BtnAuth authKey={'knowledge_manage_up_btn'}>
          <Button
            type="link"
            onClick={async () => {
              let res = await knowledgeUpDown({ knowledgeId: row?.id, status: 0 });
              if (res) {
                tableRef?.current?.reload();
              }
            }}
          >上架</Button>
        </BtnAuth>
      )
    }
  }
  const columns: any = [
    {
      title: '名称',
      dataIndex: 'knowledgeName',
      search: true,
      // width: 360,
      order: 3,
    },
    {
      title: '类型',
      dataIndex: 'knowledgeType',
      valueEnum: knowledgeTypeText,
      search: false,
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'knowledgeTypeList',
      search: true,
      hideInTable: true,
      width: 100,
      order: 1,
      fieldProps: {
        placeholder: '请选择',
      },
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select
            allowClear
            mode='multiple'
          >
            {KnowledgeTypeList?.map((item: any, index: any) => (
              <Select.Option key={index} value={item.value} item={item}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '权限',
      dataIndex: 'viewAccess',
      valueEnum: authConfigListText,
      search: false,
      width: 100,
    },
    {
      title: '权限',
      dataIndex: 'viewAccess',
      search: true,
      hideInTable: true,
      width: 100,
      order: 1,
      fieldProps: {
        placeholder: '请选择',
      },
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select
            allowClear
            mode='multiple'
          >
            {authConfigList?.map((item: any, index: any) => (
              <Select.Option key={index} value={item.value} item={item}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'releaseTime',
      search: false,
      sorter: true,
      width: 180,
    },
    {
      title: '创建人',
      dataIndex: 'userName',
      search: false,
      width: 100,
      order: 2,
      fieldProps: {
        placeholder: '请选择',
      },
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select
            allowClear
            mode='multiple'
          >
            {creatorList?.map((item: any, index: any) => (
              <Select.Option key={index} value={item.account} item={item}>
                {item.userName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorList',
      search: true,
      hideInTable: true,
      width: 100,
      order: 2,
      fieldProps: {
        placeholder: '请选择',
      },
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select
            allowClear
            mode='multiple'
          >
            {creatorList?.map((item: any, index: any) => (
              <Select.Option key={index} value={item.account} item={item}>
                {item.userName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
  ]
  if (status == 0 || status == 1) {
    columns.push({
      title: '访问量',
      dataIndex: 'readCount',
      search: false,
      sorter: true,
      width: 100,
    },
      {
        title: '点赞量',
        dataIndex: 'likeCount',
        search: false,
        sorter: true,
        width: 100,
      })
  }
  // 操作;
  columns.push({
    title: '操作',
    search: false,
    dataIndex: 'opt',
    width: 200,
    render: (val: any, row: any, index: number) => (
      <div style={{ display: 'flex' }}>
        <BtnAuth authKey={'knowledge_manage_edit_btn'}>
          <Button
            type="link"
            onClick={() => {
              // createRef?.current?.open('edit', row);
              const div = document.createElement('div');
              ReactDOM.render(
                <CreateKnowledge
                  ftype={'edit'}
                  row={row}
                  getKnowledgeDetail={getKnowledgeDetail}
                  knowledgeInsert={knowledgeInsert}
                  knowledgeUpdate={knowledgeUpdate}
                  knowledgeDirectory={knowledgeDirectory}
                  knowledgeUpload={knowledgeUpload}
                  getKnowledgeId={getKnowledgeId}
                  reload={() => { tableRef?.current?.reload(); }}
                  getKnowledgeFiles={getKnowledgeFiles}
                  fileDelete={fileDelete}
                  status={status}
                  getPreviewUrl={getPreviewUrl}
                  postVideoMessage={postVideoMessage}
                />, div
              )
              document.body.appendChild(div);
            }}
          >编辑</Button>
        </BtnAuth>
        <BtnAuth authKey={'knowledge_manage_view_btn'}>
          <Button
            type="link"
            onClick={() => {
              history.push(
                `/front/teacher/knowledgeBaseManage/knowledgeDetail2?id=${row?.id}&tab=0&status=${status}`,
              );
            }}
          >查看</Button>
        </BtnAuth>
        {optBtn(row)}
        <BtnAuth authKey={'knowledge_manage_delete_btn'}>
          <Popconfirm
            title={
              <div>删除后，该知识无法找回，<div>确定要删除吗？</div></div>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={async () => {
              let res = await knowledgeDelete({ id: row?.id });
              if (res) {
                tableRef?.current?.reload();
              }
            }}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </BtnAuth>
      </div>
    )
  });
  return (
    <>
      <ProTable
        rowKey="id"
        actionRef={tableRef}
        headerTitle="知识列表"
        options={false}
        loading={tableLoading}
        search={{
          defaultCollapsed: false,
          collapseRender: () => null,
        }}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        toolBarRender={() => {
          return status == 0 && [
            <BtnAuth authKey={'knowledge_manage_create_btn'}>
              <Button
                type="primary"
                onClick={() => {
                  const div = document.createElement('div');
                  ReactDOM.render(
                    <CreateKnowledge
                      ftype={'add'}
                      getKnowledgeDetail={getKnowledgeDetail}
                      knowledgeInsert={knowledgeInsert}
                      knowledgeUpdate={knowledgeUpdate}
                      knowledgeDirectory={knowledgeDirectory}
                      knowledgeUpload={knowledgeUpload}
                      getKnowledgeId={getKnowledgeId}
                      reload={() => { tableRef?.current?.reload(); }}
                      getKnowledgeFiles={getKnowledgeFiles}
                      fileDelete={fileDelete}
                      status={status}
                      getPreviewUrl={getPreviewUrl}
                      postVideoMessage={postVideoMessage}
                    />, div
                  )
                  document.body.appendChild(div);
                  // createRef?.current?.open('add');
                }}
              >
                新建
              </Button>
            </BtnAuth>,
          ];
        }}
        columns={columns}
        request={async (params = {}, sort, filter) => {
          console.log(sort);
          const key: string = Object.keys(sort)[0];
          const order = { 'releaseTime': 0, 'readCount': 1, 'likeCount': 2 }[key];
          const desc = key ? sort[key] == 'descend' : true;
          return getTableList({ order, page: params?.current, ...params, status, desc });
        }}
      ></ProTable>
      {/* <CreateKnowledge
        cref={createRef}
        getKnowledgeDetail={getKnowledgeDetail}
        knowledgeInsert={knowledgeInsert}
        knowledgeUpdate={knowledgeUpdate}
        knowledgeDirectory={knowledgeDirectory}
        knowledgeUpload={knowledgeUpload}
        getKnowledgeId={getKnowledgeId}
        reload={() => { tableRef?.current?.reload(); }}
        getKnowledgeFiles={getKnowledgeFiles}
        fileDelete={fileDelete}
        status={status}
        getPreviewUrl={getPreviewUrl}
      /> */}
    </>
  )
}

export default KTable;
