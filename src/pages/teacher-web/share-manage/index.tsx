import { useState, useRef, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, message } from 'antd';
import BtnAuth from '@/components/BtnAuth';
import { useTableModel } from './model';
import { knowledgeTypeText, KnowledgeTypeList } from '@/type/knowledge';
import ShareModel from './components/shareModel';
import VideoClassify from './components/videoClassify';
import { history, useModel } from 'umi';
import { addShare, editShare } from './model/api';
import config from '@/config/index';

const { successCode } = config;

export default function App() {
  const tableRef = useRef<any>();
  const shareModelRef = useRef<any>();
  const videoClassifyRef = useRef<any>();

  const { tableLoading, setTableLoading, getTableList, fileRecordDelete, getClassAll } =
    useTableModel();

  const addShareModel = () => {
    shareModelRef?.current?.open({}, 'add');
  };

  const editShareModel = (r: any) => {
    shareModelRef?.current?.open(r, 'edit');
  };

  const comfirmSubmit = async (formVal: any, rowData: any, pageType: any) => {
    let params = {
      ...formVal,
      id: rowData?.id,
    };
    delete params.file;
    let res;
    setTableLoading(true);
    if (pageType == 'add') {
      res = await addShare(params);
    } else if (pageType == 'edit') {
      res = await editShare(params);
    }
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      shareModelRef?.current?.close();
      tableRef?.current?.reloadAndRest();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const columns: any[] = [
    {
      dataIndex: 'name',
      title: '名称',
      width: 120,
    },
    {
      dataIndex: 'type',
      title: '类型',
      width: 120,
      valueEnum: knowledgeTypeText,
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select allowClear>
            {/* 目前只有视频枚举 */}
            {KnowledgeTypeList?.map((item: any, index: any) =>
              item.value === 2 ? (
                <Select.Option key={index} value={item.value} item={item}>
                  {item.label}
                </Select.Option>
              ) : null,
            )}
          </Select>
        );
      },
    },
    {
      dataIndex: 'className',
      title: '视频分类',
      search: false,
      width: 120,
    },
    {
      dataIndex: 'userName',
      title: '创建人',
      search: false,
      width: 120,
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      search: false,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 120,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <Button
                type="link"
                onClick={() => {
                  editShareModel(row);
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                onClick={() => {
                  history.push(`/front/teacher/share-manage/video-detail?id=${row.id}`);
                }}
              >
                查看
              </Button>
              <Popconfirm
                title={'删除后文件无法找回，确定删除?'}
                okText="是"
                cancelText="否"
                onConfirm={async () => {
                  let res = await fileRecordDelete({ id: row?.id });
                  if (res?.resultCode == '100') {
                    tableRef?.current?.reloadAndRest();
                  }
                }}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <PageContainer
      header={{
        title: '共享管理',
        ghost: true,
      }}
    >
      <ProTable
        actionRef={tableRef}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        tableRender={(_, dom) => (
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <div style={{ width: '230px', marginRight: '10px', background: '#fff' }}>
              <VideoClassify cref={videoClassifyRef} tableRef={tableRef} />
            </div>
            <div style={{ width: 'calc(100% - 240px)' }}>{dom}</div>
          </div>
        )}
        toolBarRender={() => {
          return [
            <Button type="primary" onClick={addShareModel}>
              新建
            </Button>,
          ];
        }}
        search={{
          labelWidth: 'auto',
        }}
        columns={columns}
        scroll={{ x: columns.length * 150, y: 400 }}
        rowKey="id"
        loading={tableLoading}
        request={async (params = {}, sort, filter) => {
          let p = {};
          let classId = videoClassifyRef?.current?.classId || 'all';
          if (classId !== 'all') {
            p = {
              classId,
            };
          }

          return getTableList({ page: params?.current, ...params, ...p });
        }}
      />
      <ShareModel loading={tableLoading} cref={shareModelRef} comfirmSubmit={comfirmSubmit} />
    </PageContainer>
  );
}
