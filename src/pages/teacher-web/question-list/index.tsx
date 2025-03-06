import React, { useCallback, useRef, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Divider } from 'antd';
import { useTableModel } from './model';
import { QuestionTypeList, questionTypeText } from '@/type/question';
import { history, useModel } from 'umi';
import ScoreSetting from './components/scoreSetting';
import CreateQuestion from './components/createQuestion';
import BtnAuth from '@/components/BtnAuth';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from './style.less';
import { accMul } from '@/utils';

const Index: React.FC<any> = () => {
  const query: any = history.location.query || {};
  const courseId: any = query?.id;
  const title: any = query?.name;
  const tableRef = useRef(null);
  const goBack = () => {
    // 回到数据管理列表页面
    history.replace(`/front/teacher/course/tablepage`);
  };

  const {
    tableLoading, getTableList, questionDelete, questionTypeList, setQuestionTypeList, getQuestionTypeList,
    questionSetScore,
    questionInsert,
    questionDetail,
    questionUpdate,
  } = useTableModel();

  const setScore = useCallback(questionSetScore, []);

  const scoreRef = useRef(null);
  const creatRef = useRef(null);

  const columns: any = [
    {
      title: '题干',
      dataIndex: 'question',
      search: true,
    },
    {
      title: '题型',
      dataIndex: 'questionType',
      valueEnum: questionTypeText,
      search: false,
      width: 108,
    },
    {
      title: '题型',
      dataIndex: 'questionTypeList',
      hideInTable: true,
      search: true,
      width: 108,
      renderFormItem: () => (
        <Select
          allowClear
          placeholder="请选择"
          mode="multiple"
        >
          {QuestionTypeList?.map((item: any) => {
            return (
              <Select.Option key={item?.value} value={item?.value} item={item}>
                {item?.label}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '题目序号',
      dataIndex: 'questionNumber',
      sorter: true,
      search: false,
      width: 108,
    },
    {
      title: '答题频次',
      dataIndex: 'answerNum',
      sorter: true,
      search: false,
      width: 108,
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      sorter: true,
      search: false,
      width: 100,
      render: (val: any, row: any, index: number) => {
        return accMul(val, 100) + '%'
      }
    },
    {
      title: '操作',
      search: false,
      dataIndex: 'opt',
      width: 135,
      render: (val: any, row: any, index: number) => (
        <div>
          <BtnAuth authKey={'teacher_course_question_edit_btn'}>
            <Button
              type="link"
              onClick={() => {
                creatRef?.current?.open('edit', row);
              }}
            >编辑</Button>
          </BtnAuth><Divider type="vertical" />
          <BtnAuth authKey={'teacher_course_question_delete_btn'}>
            <Popconfirm
              title="确定要删除吗?"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                let res = await questionDelete({ id: row?.id });
                if (res) {
                  tableRef?.current?.reload();
                }
              }}
            >
              <Button type="link" danger>删除</Button>
            </Popconfirm>
          </BtnAuth>
        </div>
      )
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
        headerTitle={'题目列表'}
        rowKey={'id'}
        options={false}
        actionRef={tableRef}
        loading={tableLoading}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        columns={columns}
        request={async (params = {}, sort, filter) => {
          console.log(sort);
          const key: string = Object.keys(sort)[0];
          const order = { 'questionNumber': 0, 'answerNum': 1, 'accuracy': 2 }[key];
          return getTableList({ order, desc: key && sort[key] == 'descend', courseId, page: params?.current, ...params });
        }}
        toolBarRender={() => {
          return [
            <BtnAuth authKey={'teacher_course_score_set_btn'}>
              <Button
                onClick={async () => {
                  await getQuestionTypeList({ courseId });
                  scoreRef?.current?.open();
                }}
              >
                分数设置
              </Button>
            </BtnAuth>,
            <BtnAuth authKey={'teacher_course_question_add_btn'}>
              <Button
                type="primary"
                onClick={() => {
                  creatRef?.current?.open('add');
                }}
              >
                新建
              </Button>
            </BtnAuth>,
          ];
        }}
      ></ProTable>
      <ScoreSetting
        courseId={courseId}
        setQuestionTypeList={setQuestionTypeList}
        questionTypeList={questionTypeList}
        setScore={setScore}
        cref={scoreRef}
      ></ScoreSetting>
      <CreateQuestion
        courseId={courseId}
        questionInsert={questionInsert}
        questionDetail={questionDetail}
        questionUpdate={questionUpdate}
        cref={creatRef}
        reload={() => {
          tableRef?.current?.reload();
        }}
      ></CreateQuestion>
    </PageContainer>
  );
}

export default Index;
