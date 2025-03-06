import React, { useCallback, useRef, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Divider } from 'antd';
import { useTableModel } from './model';
import { QuestionTypeList, questionTypeText } from '@/type/question';
import { history, useModel } from 'umi';
import BtnAuth from '@/components/BtnAuth';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Add from './components/add';
import style from './style.less';

export default function () {
  const query: any = history.location.query || {};
  const courseId: any = query?.id;
  const title: any = query?.name;
  const tableRef = useRef(null);
  const creatRef = useRef(null);
  const goBack = () => {
    // 回到数据管理列表页面
    history.replace(`/front/teacher/course/tablepage`);
  };

  const { tableLoading, getTableList, deleteItem, hasData } = useTableModel();

  const columns: any[] = [
    {
      title: '主题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '录音量',
      dataIndex: 'videoCount',
      search: false,
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      search: false,
      width: 200,
      render: (_: any, row: any) => {
        return (
          <div style={{ width: 200, lineHeight: '16px', marginBottom: 10, wordWrap: 'break-word' }}>
            {row.content}
          </div>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'userName',
      search: false,
      width: 118,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      width: 118,
    },
    {
      title: '操作',
      dataIndex: 'opt',
      search: false,
      width: 170,
      render: (_: any, row: any) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                creatRef?.current?.open('edit', row);
              }}
            >
              编辑
            </Button>
            <Divider type="vertical" style={{ margin: '0 2px' }} />
            <Button
              type="link"
              onClick={() => {
                history.push({
                  // pathname: `/front/teacher/course/audio-detail?id=${row.id}&courseId=${row.courseId}&courseTitle=${title}`,
                  pathname: '/front/teacher/course/audio-detail',
                  query: { ...row }
                });
              }}
            >
              查看
            </Button>
            <Divider type="vertical" style={{ margin: '0 2px' }} />
            <Popconfirm
              title="删除后，该知识无法找回，确定要删除吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                let res = await deleteItem({ id: row?.id });
                if (res) {
                  tableRef?.current?.reload();
                }
              }}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer
      header={{
        title: '',
        ghost: true,
      }}
      content={
        <div className={style['detail-page']}>
          <div>
            <div className={style['title']}>
              <ArrowLeftOutlined onClick={goBack} style={{ marginRight: '8px' }} />
              <span style={{ marginRight: '8px' }}>{title}</span>
            </div>
          </div>
        </div>
      }
    >
      <ProTable
        actionRef={tableRef}
        rowKey={'id'}
        loading={tableLoading}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" onClick={() => creatRef?.current?.open('add')}>
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return getTableList({ courseId, page: params?.current, ...params, courseType: 1 });
        }}
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      <Add mref={creatRef} courseId={courseId} reload={() => tableRef.current?.reload()}></Add>
    </PageContainer>
  );
}
