import React, { useEffect, useRef, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Divider } from 'antd';
import { useTableModel } from './model';
import { history, useModel } from 'umi';
import BtnAuth from '@/components/BtnAuth';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from './style.less';

export default function () {
  const query: any = history.location.query || {};
  const { courseId, taskId, nodeId } = query || {};
  const title: any = query?.name;
  const tableRef = useRef(null);
  const goBack = () => {
    history.goBack();
  };

  const { tableLoading, getTableList, createId } = useTableModel();
  const [studyId, setId] = useState('');
  useEffect(() => {
    createId().then((res) => {
      setId(res.data?.id);
    });
  }, []);

  const columns: any[] = [
    {
      title: '主题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '视频量',
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
        return <div style={{ width: 200, lineHeight: '16px', marginBottom: 10, 'wordWrap': 'break-word' }}>{row.content}</div>
      }
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
                history.push(`/front/student/video-detail?taskId=${taskId}&courseId=${courseId}&nodeId=${nodeId}&id=${row.id}&courseTitle=${title}&studyId=${studyId}`)
              }}
            >去学习</Button>
          </div>
        )
      }
    }
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

        ]}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return getTableList({ courseId, page: params?.current, ...params });
        }}
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      ></ProTable>
    </PageContainer>
  );
}