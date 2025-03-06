import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Tree, Menu, Button, message, Spin, Space, notification, Dropdown } from 'antd';
import { UnorderedListOutlined, FolderOutlined, FileOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import style from '../style.less';
import ContentDetail from './components/contentDetail';
import CommentDetail from './components/commentDetail';
import { history, useModel } from 'umi';

const KnowledgeDetail = (props: any) => {
  // const [id, setId] = useState('');
  const query: any = history.location.query || {};
  const id: any = query?.id;

  const goBack = () => {
    // 回到管理列表页面
    history.replace(`/front/teacher/knowledgeBaseManage/knowledgeManage?status=${query.status}`);
  };
  return (
    <div className={style["rightside-box"]}>
      <div className={style["knowledge-box"]}>
        <ContentDetail
          id={id}
          goBack={goBack}
        />
        <CommentDetail id={id}></CommentDetail>
      </div>
    </div>
  );
};

export default KnowledgeDetail;
