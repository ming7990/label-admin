import React, { Fragment, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import styles from './../index.less';
import ScoreSet from './../components/scoreSet';
import ServiceSet from './../components/serviceSet';
import DialogCom from './../components/dialogCom';
import SilentTime from './../components/silentTime';

const RuleManage: React.FC = (props: any) => {
  // 用户信息
  const { initialState } = useModel('@@initialState');
  const { userInfoAll } = (initialState?.currentUser as any) || {};
  const { menuBtns } = userInfoAll || {};
  return (
    <div className={styles.commonTabsSty}>
      <PageContainer
        header={{
          title: '规则管理',
          breadcrumb: {},
        }}
      >
        <Tabs defaultActiveKey="1" destroyInactiveTabPane>
          {menuBtns?.includes('paramsManage_ruleManage_score_btn') ? (
            <Tabs.TabPane tab="评分比例配置" key="1">
              <ScoreSet />
            </Tabs.TabPane>
          ) : undefined}
          {menuBtns?.includes('paramsManage_ruleManage_service_btn') ? (
            <Tabs.TabPane tab="服务规则配置" key="2">
              <ServiceSet />
            </Tabs.TabPane>
          ) : undefined}
          {menuBtns?.includes('paramsManage_ruleManage_dialogCom_btn') ? (
            <Tabs.TabPane tab="话术合格配置" key="3">
              <DialogCom />
            </Tabs.TabPane>
          ) : undefined}
          {(
            <Tabs.TabPane tab="视频评分配置" key="4">
              <div>
                <p>视频播放评分配置</p>
                <p style={{ margin: 0 }} className={styles.commonTips}>设置课程视频模式中，学员通过视频课程的标准</p>
                <div style={{ paddingLeft: 30 }}>
                  <p>（1）按照视频数量平均分配分数（100分➗视频数量 分数保留小数点后两位）</p>
                  <p>（2）按照视频播放时长占视频总时长比值换做分数（分数保留小数点后两位）</p>
                  <p>（3）该课程得分=视频1得分+视频2得分+... 视频N得分，最终得分保留小数点后两位</p>
                </div>
              </div>
            </Tabs.TabPane>
          )}
          {menuBtns?.includes('paramsManage_ruleManage_timeConfig_btn') ? (
            <Tabs.TabPane tab="沉默时间配置" key="5">
              <SilentTime />
            </Tabs.TabPane>
          ) : undefined}
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default RuleManage;
