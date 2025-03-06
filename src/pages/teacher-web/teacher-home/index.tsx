import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Pagination } from 'antd';
import ListPage from './list-page';
import style from './style.less';
import { useTaskModel } from './model';
import TagIcon from './component/TagIcon';
import TabBarRightAction from './component/TabBarRightAction';
import { useUpdateEffect, useMount } from 'ahooks';

const tabInfos: any[] = [
  { tabName: '任务总数', tabKey: 'totalCount', tabQueryVal: undefined },
  { tabName: '进行中', tabKey: 'processingCount', tabQueryVal: 0 },
  { tabName: '已完成', tabKey: 'completeCount', tabQueryVal: 1 },
  { tabName: '未发布', tabKey: 'upPublishCount', tabQueryVal: 2 },
];

const TeacherHome: React.FC<any> = (props: any) => {
  const {
    loading,
    // 任务统计接口
    getTaskCount,
    taskCountInfo,
    // 任务数据统计接口
    getTeachTaskData,
    courselist,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPage,
  } = useTaskModel();

  // 标签页
  const [selectTab, setSelectTab] = useState<any>('totalCount');
  const [tabQueryType, setTabQueryType] = useState<any>(undefined);
  const tabItems: any[] = tabInfos.map(({ tabName, tabKey, tabQueryVal }, index) => {
    return {
      key: tabKey,
      label: (
        <span>
          {tabName}
          <TagIcon isActive={selectTab === tabKey} num={taskCountInfo[tabKey]} />
        </span>
      ),
      children: <ListPage courselist={courselist} loading={loading} />,
    };
  });
  const tabChange = (key: any) => {
    const tabQueryVal = tabInfos.find((info) => info.tabKey === key)?.tabQueryVal;
    // console.log('tabChange', key, tabQueryVal);
    setTabQueryType(tabQueryVal);
    setSelectTab(key);
  };

  // 标签栏右边 action
  const [taskType, setTaskType] = useState<any>(undefined);
  const [searchText, setSearchText] = useState<any>(undefined);
  const tabBarExtraContent = (
    <TabBarRightAction
      // 课程类型切换
      courseTypeChange={(course: any) => {
        const newTaskType = course.queryVal;
        // console.log('courseTypeChange', newTaskType);
        if (taskType === newTaskType) return;
        setTaskType(newTaskType);
      }}
      // 课程名称搜索
      courseNameSearch={(text: any) => {
        // console.log('courseNameSearch', text);
        if (!text) text = undefined;
        setSearchText(text);
      }}
    />
  );

  useMount(() => {
    getTaskCount({}); // 默认获取所有类型数量
    getTeachTaskData({ page, pageSize }); // 默认获取所有类型任务
  });

  // 页签切换
  useUpdateEffect(() => {
    getTaskCount({ taskType, queryTaskName: searchText });
    getTeachTaskData({
      page: 1,
      pageSize,
      taskType,
      type: tabQueryType,
      queryTaskName: searchText,
    });
  }, [selectTab]);

  // 课程类型切换
  useUpdateEffect(() => {
    getTaskCount({ taskType, queryTaskName: searchText });
    getTeachTaskData({
      page: 1,
      pageSize,
      taskType,
      type: tabQueryType,
      queryTaskName: searchText,
    });
  }, [taskType]);

  // 搜索任务名
  useUpdateEffect(() => {
    getTaskCount({ taskType, queryTaskName: searchText });
    getTeachTaskData({
      page: 1,
      pageSize,
      taskType,
      type: tabQueryType,
      queryTaskName: searchText,
    });
  }, [searchText]);

  // 页码切换
  // useUpdateEffect(() => {
  //   getTeachTaskData({ page, pageSize, taskType, type: tabQueryType, queryTaskName: searchText });
  // }, [page, pageSize]);

  const pageOrPageSizeChange = (page: any, pageSize: any) => {
    getTeachTaskData({
      page,
      pageSize,
      taskType,
      type: tabQueryType,
      queryTaskName: searchText,
    });
  };

  return (
    <PageContainer
      header={{
        title: '首页',
        ghost: true,
      }}
    >
      <div className={style['page-bg']}>
        <Tabs
          size={'large'}
          activeKey={selectTab}
          onChange={tabChange}
          tabBarExtraContent={tabBarExtraContent}
        >
          {tabItems.map((item: any, index: any) => {
            return (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        {!courselist?.length ? null : (
          <div style={{ display: 'flex', justifyContent: 'right', height: '64px' }}>
            <Pagination
              current={page}
              total={totalPage}
              pageSize={pageSize}
              // showQuickJumper
              showSizeChanger
              pageSizeOptions={[12, 24, 36, 72]}
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
              onChange={(current: any, size: any) => {
                // console.log('onChange - ', current, size);
                if (pageSize !== size) current = 1; // pageSize 发生变化时，默认切换至首页
                setPageSize(size);
                pageOrPageSizeChange(current, size);
              }}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TeacherHome;
