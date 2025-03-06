import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Tabs, Select, Button, message, Spin, Space, notification, Drawer } from 'antd';
import styles from './../style.less';
import KnowledgeQualityTable from '../components/knowledgeQualityTable';
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
          title: '品质知识库',
          breadcrumb: {},
        }}
      >
        <Tabs defaultActiveKey={query.status ? query.status : '0'} onChange={tabChange}>
          <Tabs.TabPane tab="文件管理" key="0">
            {
              status == '0' ?
                <KnowledgeQualityTable
                  status={0}
                /> : null
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="题库管理" key="1">
            {
              status == '1' ?
                <KnowledgeQualityTable
                  status={1}
                /> : null
            }
          </Tabs.TabPane>
        </Tabs>
      </PageContainer>
    </div>
  )
}

export default KnowledgeManage;
