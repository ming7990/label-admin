import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Tabs, Select, Button, message, Spin, Space, notification, Drawer } from 'antd';
import styles from './../style.less';
import KnowledgeTable from '../components/knowledgeTable';
import { useTableModel } from '../model';
import { history } from 'umi';

const KnowledgeManage = () => {
  const query: any = history.location.query || {};
  const [status, setStatus] = useState('0');
  const tabChange = (v) => {
    setStatus(v);
  }
  useEffect(() => {
    tabChange(query.status ? query.status : '0');
  }, []);
  const {
    tableLoading, getTableList, getKnowledgeDetail, knowledgeInsert, knowledgeUpdate,
    knowledgeUpDown, knowledgeDelete, knowledgeDirectory, getCreatorList, knowledgeUpload
  } = useTableModel();
  return (
    <div className={styles.commonTabsSty}>
      <PageContainer
        header={{
          title: '知识管理',
          breadcrumb: {},
        }}
      >
        <Tabs defaultActiveKey={query.status ? query.status : '0'} onChange={tabChange}>
          <Tabs.TabPane tab="已上架" key="0">
            {
              status == '0' ?
                <KnowledgeTable
                  status={0}
                /> : null
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="已下架" key="1">
            {
              status == '1' ?
                <KnowledgeTable
                  status={1}
                /> : null
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="草稿箱" key="2">
            {
              status == '2' ?
                <KnowledgeTable
                  status={2}
                /> : null
            }
          </Tabs.TabPane>
        </Tabs>
      </PageContainer>
    </div>
  )
}

export default KnowledgeManage;
