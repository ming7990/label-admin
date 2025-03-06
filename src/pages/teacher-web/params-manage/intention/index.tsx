import { Fragment, useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import { Tabs } from 'antd';
import styles from './../index.less';
import CustomerIntention from '../components/customerIntention';
import StudentIntent from './../components/studentIntent';

export default () => {
  const query: any = history.location.query || {};

  const title: any = query?.title;

  useEffect(() => {}, []);

  const goBack = () => {
    // 回到数据管理列表页面
    history.replace(`/front/teacher/paramsManage/systemManage`);
  };

  return (
    <div className={styles.commonTabsSty}>
      <PageContainer
        header={{
          // title: title,
          breadcrumb: {},
        }}
        content={
          <div className={styles['detail-page']}>
            <div>
              <div className={styles['title']}>
                <ArrowLeftOutlined onClick={goBack} style={{ marginRight: '8px' }} />
                <span style={{ marginRight: '8px' }}>{title}</span>
              </div>
            </div>
          </div>
        }
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane key={'1'} tab="客户意图">
            <CustomerIntention />
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab="学员意图">
            <StudentIntent />
          </Tabs.TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};
