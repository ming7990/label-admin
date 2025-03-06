import type { ActionType, FormInstance } from '@ant-design/pro-components';
import { useModel, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Button, Select, Tabs, Radio, Popconfirm, Modal, Form, DatePicker } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useDataManageModel } from './model';
import { useUserManageModel, useUserSignModel, } from '../params-manage/model';
import { useTaskModel } from '../task/model';
import moment from 'moment';

import { formatePercent } from '@/utils';
import Condition from '@/components/Condition';

const { MonthPicker, RangePicker } = DatePicker;

export default () => {
  // 用户信息
  const { initialState } = useModel('@@initialState');
  const { userInfoAll } = (initialState?.currentUser as any) || {};
  const { menuBtns } = userInfoAll || {};

  const state: any = history.location.state || {};
  const defaultRadioValue: any = state.radioValue ? Number(state.radioValue) : 0;
  let tab: any = state.tab || 'task';
  if (tab === 'task' && !menuBtns?.includes('teacher_dataManage_task_btn')) {
    tab = 'student';
  }
  const taskFormRef = useRef<FormInstance>();
  const studentFormRef = useRef<FormInstance>();
  const studentActionRef = useRef<ActionType>();
  const { getTaskReport, getStudentReport, getSignReport, signDelete, studentOrSignExport } = useDataManageModel();
  const { userList, groupList, userListRequest, groupListRequest } = useUserManageModel();
  const { userList2, userList3, groupList2, userListRequest2, userListRequest3, groupListRequest2 } = useUserSignModel();
  const { allTableList, getAllTaskList } = useTaskModel();

  const [tabActiveKey, setTabActiveKey] = useState<string>(tab); //'task'-任务、'student'-学员
  const [radioValue, setRadioValue] = useState<number>(defaultRadioValue); //0-当前、1-历史
  const [cache, setCache] = useState<any>(JSON.parse(state.cache || '{}') || {});

  const signActionRef = useRef<ActionType>();
  const signFormRef = useRef<FormInstance>();
  const [exportForm] = Form.useForm();
  const [tabType, setTabType] = useState<string>('');
  const [signVisible, setSignVisible] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const tabList = () => {
    let list = [];
    if (menuBtns?.includes('teacher_dataManage_task_btn')) {
      list.push({
        tab: '任务管理',
        key: 'task',
      });
    }
    if (menuBtns?.includes('teacher_dataManage_student_btn')) {
      list.push({
        tab: '学员数据',
        key: 'student',
      });
    }
    if (menuBtns?.includes('teacher_dataManage_sign_btn')) {
      list.push({
        tab: '签到数据',
        key: 'sign',
      });
    }
    return list;
  };

  useEffect(() => {
    if (tab === 'task') {
      const { taskType, taskName, current, taskStatus, creator } = cache;
      taskFormRef.current?.setFieldsValue({
        taskType,
        taskName,
        taskStatus,
        current,
        creator,
      });
      taskFormRef.current?.submit();
    } else {
      const { userName, groupList } = cache;
      studentFormRef.current?.setFieldsValue({
        userName,
        groupList,
      });
      studentFormRef.current?.submit();
    }
  }, []);

  useEffect(() => {
    userListRequest({});
    groupListRequest({});
    userListRequest2({});
    groupListRequest2({});
    getAllTaskList({ searchDelete: 1 });
  }, []);

  useEffect(() => {
    if (!studentFormRef.current) {
      return;
    }
    studentFormRef.current.submit();
  }, [radioValue]);

  const detailData = (r: any) => {
    const id = tabActiveKey === 'task' ? r.taskId : r.account;
    const title = tabActiveKey === 'task' ? r.taskName : r.userName;
    let cache: any;
    if (tabActiveKey === 'task') {
      cache = JSON.stringify({ ...taskFormRef.current?.getFieldsValue() });
    } else {
      cache = JSON.stringify({ ...studentFormRef.current?.getFieldsValue() });
    }

    let src = `/front/teacher/dataManage/detailData?id=${id}&title=${title}&tab=${tabActiveKey}&cache=${cache}`;
    if (tabActiveKey === 'student') {
      src += `&radioValue=${radioValue}`;
    }
    history.push(src);
  };

  // 学员导出;
  const studentExport = () => {
    exportForm.resetFields();
    setTabType('student');
    setSignVisible(true);
    userListRequest3({ groupIdList: [] });
  };
  const exportFn = () => {
    exportForm.resetFields();
    setTabType('sign');
    setSignVisible(true);
    userListRequest3({ groupIdList: [] });
  };
  const onExport = async () => {
    console.log(exportForm.getFieldsValue());
    const valid = await exportForm.validateFields();
    if (valid) {
      let param = {
        ...valid,
      };
      if (valid.time?.length) {
        param.beginTime = moment(valid.time[0]).format('YYYY-MM-DD 00:00:00');
        param.endTime = moment(valid.time[1]).format('YYYY-MM-DD 00:00:00');
      }
      delete param.time;
      setBtnLoading(true);
      const res = await studentOrSignExport(param, tabType);
      setBtnLoading(false);
      setSignVisible(false);
    }
  }

  const groupChange = (list: any) => {
    console.log(list);
    signFormRef.current?.setFieldsValue({ groupList: list, userName: [] });
    userListRequest2({ groupIdList: list });
  }
  const groupChange2 = (list: any) => {
    console.log(list);
    exportForm.setFieldsValue({ groupList: list, accountList: [] });
    userListRequest3({ groupIdList: Array.isArray(list) ? list : [list] });
  }

  const columns: any[] = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 120,
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请选择任务名称',
      },
      renderFormItem: () => (
        <Select
          mode="multiple"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.item?.taskName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {allTableList?.map((item: any, index: any) => (
            <Select.Option key={index} value={item.id} item={item}>
              {item.taskName}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: '学员人数',
      dataIndex: 'taskUserCount',
      key: 'taskUserCount',
      width: 80,
      search: false,
    },
    {
      title: '完成人数',
      dataIndex: 'completeCount',
      key: 'completeCount',
      width: 80,
      search: false,
    },
    {
      title: '完成率',
      dataIndex: 'completeRate',
      key: 'completeRate',
      width: 80,
      search: false,
      render(t: any, r: any, i: any) {
        return formatePercent(t);
      },
    },
    {
      title: '人均练习次数',
      dataIndex: 'timesAvg',
      key: 'timesAvg',
      width: 110,
      search: false,
    },
    {
      title: '平均分',
      dataIndex: 'scoreAvg',
      key: 'scoreAvg',
      width: 80,
      search: false,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 80,
      valueEnum: {
        1: { text: '培训任务' },
        2: { text: '考试任务' },
      },
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      width: 80,
      valueEnum: {
        0: { text: '关闭', status: 'default' },
        1: { text: '打开', status: 'success' },
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 80,
      search: true,
      renderFormItem: (t: any, r: any, i: any) => (
        <Select
          placeholder="请选择创建人"
          mode="multiple"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.item?.userName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {userList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.account} item={item}>
                {item?.userName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      width: 150,
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <div>
            <Button type="link" onClick={() => detailData(r)}>
              详细数据
            </Button>
          </div>
        );
      },
    },
  ];

  const studentColumns: any[] = [
    {
      title: '学员名称',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
      search: true,
      fieldProps: {
        placeholder: '请选择学员名称',
      },
      renderFormItem: () => (
        <Select
          placeholder="请选择学员名称"
          mode="multiple"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.item?.userName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {userList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.account} item={item}>
                {item?.userName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '学员组别',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 80,
      search: false,
    },
    {
      title: '部门组别',
      key: 'groupList',
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择部门组别',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择部门组别"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.groupName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {groupList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id} item={item}>
                {item?.groupName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: radioValue === 1 ? '历史任务总数' : '任务总数',
      dataIndex: 'taskCount',
      key: 'taskCount',
      width: 80,
      search: false,
    },
    {
      title: radioValue === 1 ? '历史已完成考试数' : '已完成考试数',
      dataIndex: 'completeExamCount',
      key: 'completeExamCount',
      width: 100,
      search: false,
    },
    {
      title: '待完成考试数',
      dataIndex: 'unCompleteExamCount',
      key: 'unCompleteExamCount',
      width: 80,
      search: false,
      hideInTable: radioValue === 1,
    },
    {
      title: radioValue === 1 ? '历史已完成培训数' : '已完成培训数',
      dataIndex: 'completeTrainCount',
      key: 'completeTrainCount',
      width: 100,
      search: false,
    },
    {
      title: '待完成培训数',
      dataIndex: 'unCompleteTrainCount',
      key: 'unCompleteTrainCount',
      width: 80,
      search: false,
      hideInTable: radioValue === 1,
    },
    {
      title: radioValue === 1 ? '完成率' : '完成进度',
      dataIndex: 'completeRate',
      key: 'completeRate',
      width: 80,
      search: false,
      render(t: any, r: any, i: any) {
        return formatePercent(t);
      },
    },
    {
      title: radioValue === 1 ? '历史练习次数' : '练习次数',
      dataIndex: 'trainTimes',
      key: 'trainTimes',
      width: 90,
      search: false,
    },
    {
      title: radioValue === 1 ? '历史平均分' : '平均分',
      dataIndex: 'scoreAvg',
      key: 'scoreAvg',
      width: 80,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      width: 120,
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <div>
            <Button type="link" onClick={() => detailData(r)}>
              详细数据
            </Button>
          </div>
        );
      },
    },
  ];

  // 考勤列表;
  const signColumns: any[] = [
    {
      title: '学员组别',
      dataIndex: 'groupName',
      key: 'groupName',
      width: 80,
      search: false,
    },
    {
      title: '部门组别',
      key: 'groupList',
      dataIndex: 'groupList',
      hideInTable: true,
      fieldProps: {
        placeholder: '请选择部门组别',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          onChange={groupChange}
          placeholder="请选择部门组别"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.groupName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {groupList2?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id} item={item}>
                {item?.groupName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '学员名称',
      dataIndex: 'userName',
      key: 'userName',
      width: 80,
      search: true,
      fieldProps: {
        placeholder: '请选择学员名称',
      },
      renderFormItem: () => (
        <Select
          placeholder="请选择学员名称"
          mode="multiple"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.item?.userName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {userList2?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.account} item={item}>
                {item?.userName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '签到日期',
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true,
      initialValue: [],
      fieldProps: {
        placeholder: ['开始时间', '结束时间'],
      },
    },
    {
      title: '签到日期',
      dataIndex: 'signDate',
      key: 'signDate',
      width: 80,
      search: false,
    },
    {
      title: '签到时间',
      dataIndex: 'signTime',
      key: 'signTime',
      width: 80,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      width: 30,
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        if (menuBtns?.includes('teacher_dataManage_sign_delete_btn'))
          return (
            <div>
              <Popconfirm
                title={
                  <div>{'确定删除签到记录？'}</div>
                }
                okText="是"
                cancelText="否"
                onConfirm={async () => {
                  const res = await signDelete({ id: r?.id });
                  if (res) {
                    signActionRef?.current?.reload();
                  }
                }}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </div>
          );
        return null;
      },
    },
  ];

  const renderProTable = (key: any) => {
    if (key === 'task') {
      return (
        <ProTable
          rowKey={(record: any) => record?.id}
          formRef={taskFormRef}
          headerTitle={'任务数据列表'}
          toolBarRender={() => []}
          options={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 100,
            span: 8,
            defaultCollapsed: false,
            collapseRender: () => null,
          }}
          columns={columns}
          scroll={{ x: columns?.length * 100 }}
          request={async (params = {}, sort, filter) => {
            console.log(params);
            return getTaskReport({ ...params });
          }}
        />
      );
    } else if (key === 'student') {
      return (
        <ProTable
          rowKey={(record: any) => record?.id}
          actionRef={studentActionRef}
          formRef={studentFormRef}
          headerTitle={'学员数据列表'}
          toolBarRender={() => [
            menuBtns?.includes('teacher_dataManage_student_exp_btn') ? <Button type="primary" onClick={studentExport}>导出</Button> : null,
            <Radio.Group onChange={(e) => setRadioValue(e.target.value)} value={radioValue}>
              <Radio.Button value={0}>当前</Radio.Button>
              <Radio.Button value={1}>历史</Radio.Button>
            </Radio.Group>,
          ]}
          options={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 100,
            span: 8,
            defaultCollapsed: false,
            collapseRender: () => null,
          }}
          columns={studentColumns}
          scroll={{ x: studentColumns?.length * 100 }}
          request={async (params = {}, sort, filter) => {
            return getStudentReport({ ...params, type: radioValue });
          }}
        />
      );
    } else if (key === 'sign') {
      return (
        <ProTable
          rowKey={(record: any) => record?.id}
          actionRef={signActionRef}
          formRef={signFormRef}
          headerTitle={'签到数据列表'}
          toolBarRender={() => [
            menuBtns?.includes('teacher_dataManage_sign_exp_btn') ? <Button type="primary" onClick={exportFn}>导出</Button> : null
          ]}
          options={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 70,
            span: 8,
            defaultCollapsed: false,
            collapseRender: () => null,
          }}
          columns={signColumns}
          scroll={{ x: signColumns?.length * 80 }}
          request={async (params = {}, sort, filter) => {
            return getSignReport({ ...params });
          }}
        />
      );
    }
  };
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  return (
    <Fragment>
      <PageContainer
        header={{
          title: '数据管理',
          breadcrumb: {},
        }}
        tabActiveKey={tabActiveKey}
        tabList={tabList()}
        onTabChange={(key) => setTabActiveKey(key)}
      >
        <Tabs activeKey={tabActiveKey} tabBarStyle={{ display: 'none' }}>
          {tabList().map((item) => (
            <Tabs.TabPane key={item.key}>{renderProTable(item.key)}</Tabs.TabPane>
          ))}
        </Tabs>
      </PageContainer>
      <Modal
        title="导出"
        visible={signVisible}
        onCancel={() => { setSignVisible(false); setBtnLoading(false); }}
        footer={[
          <div>
            <Button onClick={() => setSignVisible(false)} type='ghost'>取消</Button>
            <Button loading={btnLoading} onClick={onExport} type='primary'>确定</Button>
          </div>
        ]}
      >
        <Form form={exportForm} layout="horizontal" {...formItemLayout}>
          <Condition r-if={tabType == 'student'}>
            <Form.Item label="部门组别" name="groupIdList" rules={[{ required: true, message: '请选择' }]}>
              <Select
                optionFilterProp="children"
                showSearch
                allowClear
                placeholder="请选择部门组别"
                onChange={groupChange2}
                mode="multiple"
                filterOption={(input, option) =>
                  (option?.item?.groupName as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {groupList2?.map((item: any) => {
                  return (
                    <Select.Option key={item?.id} value={item?.id} item={item}>
                      {item?.groupName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="学员名称" name="accountList" rules={[{ required: true, message: '请选择' }]}>
              <Select
                placeholder="请选择学员名称"
                mode="multiple"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.item?.userName as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {userList3?.map((item: any) => {
                  return (
                    <Select.Option key={item?.id} value={item?.account} item={item}>
                      {item?.userName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="时间" name="time" rules={[{ required: true, message: '请选择' }]}>
              <RangePicker
                format={'YYYY-MM-DD'}
              />
            </Form.Item>
            <Form.Item label="任务类型" name="taskType" rules={[{ required: true, message: '请选择' }]}>
              <Select
                optionFilterProp="children"
                showSearch
                allowClear
                placeholder="请选择"
                filterOption={(input, option) =>
                  (option?.item?.name as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                <Select.Option key='1' value={1} item={{ name: '培训任务' }}>培训任务</Select.Option>
                <Select.Option key='2' value={2} item={{ name: '考试任务' }}>考试任务</Select.Option>
              </Select>
            </Form.Item>
          </Condition>
          <Condition r-if={tabType == 'sign'}>
            <Form.Item label="部门组别" name="groupIdList" rules={[{ required: true, message: '请选择' }]}>
              <Select
                optionFilterProp="children"
                showSearch
                allowClear
                placeholder="请选择部门组别"
                onChange={groupChange2}
                filterOption={(input, option) =>
                  (option?.item?.groupName as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {groupList2?.map((item: any) => {
                  return (
                    <Select.Option key={item?.id} value={item?.id} item={item}>
                      {item?.groupName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="学员名称" name="accountList" rules={[{ required: true, message: '请选择' }]}>
              <Select
                placeholder="请选择学员名称"
                mode="multiple"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.item?.userName as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {userList3?.map((item: any) => {
                  return (
                    <Select.Option key={item?.id} value={item?.account} item={item}>
                      {item?.userName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="时间" name="time" rules={[{ required: true, message: '请选择' }]}>
              <RangePicker
                format={'YYYY-MM-DD'}
              />
            </Form.Item>
          </Condition>
        </Form>
      </Modal>
    </Fragment>
  );
};
