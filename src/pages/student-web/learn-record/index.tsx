import ProTable from '@ant-design/pro-table';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Divider, Button, Select, message, Space, notification, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useLearnModel } from './model';
import ChatRecord from './components/chatRecord';
import ScoreResultDetail from '../../student-web/question-list/components/modal/ScoreResultDetail';

export default () => {
  const actionRef = useRef<any>();
  const chatRecordRef = useRef<any>();
  const scoreDetail = useRef<any>();

  const { learnRecord, courseList } = useLearnModel();

  const [courseListData, setCourseList] = useState<any>([]);

  useEffect(() => {
    getCourseList();
  }, []);

  const getCourseList = async () => {
    let params = {
      // groupId: '',
    };
    let res = await courseList(params);
    setCourseList(res?.data || []);
  };

  const getLearnRecord = async (payload: any) => {
    let params = {
      ...payload,
      taskId: payload?.taskName?.join(','),
      page: payload?.current,
    };
    delete params?.current;
    delete params?.taskName;
    let res = await learnRecord(params);
    return {
      data: res?.data?.list || [],
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const detail = (r: any) => {
    console.log(r, 'detail');
    if (r.courseType == 2) {
      scoreDetail.current?.open({ courseId: r.courseId, studyId: r.id });
    } else {
      chatRecordRef?.current?.open(r);
    }
  };

  const columns: any[] = [
    {
      title: '课程名称',
      dataIndex: 'taskName',
      key: 'taskName',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请选择课程名称',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择课程名称"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.taskName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {courseListData?.map((item: any) => {
            return (
              <Select.Option key={item?.taskId} value={item?.courseId} item={item}>
                {item?.taskName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '练习技巧名称',
      dataIndex: 'taskNodeName',
      key: 'taskNodeName',
      ellipsis: true,
      search: false,
    },
    {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      ellipsis: true,
      search: false,
    },
    {
      title: '课程类型',
      dataIndex: 'taskType',
      key: 'taskType',
      ellipsis: true,
      search: true,
      valueEnum: {
        1: { text: '培训课程', status: 1 },
        2: { text: '考试课程', status: 2 },
      },
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
            <Space>
              {r.courseType != '3' && (<Button type="link" onClick={() => detail(r)}>详情</Button>)}
            </Space>
          </div>
        );
      },
    },
  ];
  return (
    <Fragment>
      <PageContainer
        header={{
          title: '练习记录',
          breadcrumb: {},
        }}
      >
        <ProTable
          rowKey={(record: any) => record?.id}
          actionRef={actionRef}
          headerTitle="练习课程列表"
          toolBarRender={() => []}
          options={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 'auto',
          }}
          columns={columns}
          scroll={{ x: columns?.length * 150 }}
          request={async (params = {}, sort, filter) => {
            return getLearnRecord({ ...params });
          }}
        />
      </PageContainer>
      <ChatRecord cref={chatRecordRef} />
      <ScoreResultDetail cref={scoreDetail} />
    </Fragment>
  );
};
