import React, { useRef, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Select } from 'antd';
import { useTableModel } from './model';
import { history, useModel } from 'umi';
import DuplicateForm from './components/duplicateForm';
import TableForm from './components/tableForm';
import BtnAuth from '@/components/BtnAuth';
import style from './style.less';
import SoundDrawer from '@/pages/teacher-web/course/teacher-draw/component/soundDrawer';

const TeacherWeb: React.FC<any> = (props: any) => {
  const {
    allTableList,
    tableLoading,
    formLoading,
    getTableList,
    getAllTablelist,
    courseAdd,
    courseDetail,
    courseEdit,
    courseDelete,
    coursePublish,
    courseDown,
    courseCopy,
  } = useTableModel();

  const duplicateRef = useRef<any>(null);
  const tableFormRef = useRef<any>(null);
  const tableRef = useRef<any>(null);
  const soundDrawerRef: any = useRef<any>(null);

  const { setCourseInfo } = useModel('course', (model: any) => ({
    setCourseInfo: model.setCourseInfo,
  }));

  let columns: any = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      search: false,
    },
    {
      title: '任务名称',
      dataIndex: 'taskNameList',
      search: false,
      render: (v: any, r: any) => {
        return Array.isArray(r.taskNameList) && r.taskNameList.join('，') || '-';
      },
    },
    {
      title: '课程名称',
      dataIndex: 'courseIdList',
      hideInTable: true,
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select
            mode="multiple"
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.item?.courseName as unknown as string)
                ?.toLowerCase()
                ?.includes(input.toLowerCase())
            }
          >
            {allTableList?.map((item: any, index: any) => (
              <Select.Option key={index} value={item.id} item={item}>
                {item.courseName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '合格分',
      dataIndex: 'passMark',
      search: false,
    },
    {
      title: '课程状态',
      dataIndex: 'courseStatus',
      valueEnum: {
        0: { text: '未上线', status: 'default' },
        1: { text: '已发布', status: 'success' },
      },
    },
    {
      title: '课程样式',
      dataIndex: 'courseType',
      valueEnum: {
        0: { text: '常规' },
        1: { text: '剧情' },
        2: { text: '文本' },
        3: { text: '视频' },
        4: { text: '大模型剧情' },
        5: { text: '录音' },
      },
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      search: false,
      render: (v: any, r: any) => {
        return r.userName || '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'op',
      search: false,
      fixed: 'right',
      width: 320,
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <div style={{ display: 'flex' }}>
              <BtnAuth authKey={'teacher_course_infoEdit_btn'}>
                <Button
                  type="link"
                  onClick={() => {
                    tableFormRef?.current?.open('edit', row);
                  }}
                >
                  信息编辑
                </Button>
              </BtnAuth>
              {row?.courseType != 4 && <BtnAuth authKey={'teacher_course_processEdit_btn'}>
                <Button
                  type="link"
                  onClick={() => {
                    setCourseInfo(row);
                    setTimeout(() => {
                      if (row.courseType == 2) {
                        history.push(
                          `/front/teacher/course/question-list?id=${row?.id}&name=${row?.courseName}`,
                        );
                      } else if (row.courseType == 3) {
                        history.push(
                          `/front/teacher/course/video-list?id=${row?.id}&name=${row?.courseName}&courseType=${row?.courseType}`,
                        );
                      } else if (row.courseType == 5) {
                        history.push(
                          `/front/teacher/course/audio-list?id=${row?.id}&name=${row?.courseName}&courseType=${row?.courseType}`,
                        );
                      } else {
                        history.push(
                          `/front/teacher/course/draw?id=${row?.id}&name=${row?.courseName}`,
                        );
                      }
                    }, 100);
                  }}
                >
                  流程编辑
                </Button>
              </BtnAuth>}
              {/* {row.courseType == 4 && <BtnAuth authKey={'teacher_course_infoEdit_btn'}>
                <Button type="link" onClick={() => {
                  setCourseInfo(row);
                  soundDrawerRef?.current?.open('', row)
                }}>
                  录音设置
                </Button>
              </BtnAuth>} */}
              <BtnAuth authKey={'teacher_course_publish_btn'}>
                <Popconfirm
                  title="确定要发布吗？"
                  okText="确定"
                  cancelText="取消"
                  disabled={row?.courseStatus == 1}
                  onConfirm={async () => {
                    let res = await coursePublish({ id: row?.id });
                    if (res) {
                      tableRef?.current?.reload();
                    }
                  }}
                >
                  <Button type="link" disabled={row?.courseStatus == 1}>
                    发布
                  </Button>
                </Popconfirm>
              </BtnAuth>
              <BtnAuth authKey={'teacher_course_down_btn'}>
                <Popconfirm
                  title={
                    <div>
                      <div>{'确定要下线吗？'}</div>
                      <div className={style['title-description']}>
                        {'下线后课程将无法被选择配置'}
                      </div>
                    </div>
                  }
                  okText="确定"
                  cancelText="取消"
                  disabled={row?.courseStatus == 0}
                  onConfirm={async () => {
                    let res = await courseDown({ id: row?.id });
                    if (res) {
                      tableRef?.current?.reload();
                    }
                  }}
                >
                  <Button type="link" disabled={row?.courseStatus == 0}>
                    下线
                  </Button>
                </Popconfirm>
              </BtnAuth>
              <BtnAuth authKey={'teacher_course_delete_btn'}>
                <Popconfirm
                  title={
                    <div>
                      <div>{'确定要删除吗?'}</div>
                      <div className={style['title-description']}>{'删除后课程将消失'}</div>
                    </div>
                  }
                  okText="确定"
                  cancelText="取消"
                  onConfirm={async () => {
                    let res = await courseDelete({ id: row?.id });
                    if (res) {
                      tableRef?.current?.reload();
                    }
                  }}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </BtnAuth>
              <SoundDrawer cref={soundDrawerRef} isEdit={row?.courseStatus == 0}></SoundDrawer>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '课程管理',
        ghost: true,
      }}
    >
      <ProTable
        actionRef={tableRef}
        headerTitle={'课程管理'}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        toolBarRender={() => {
          return [
            <BtnAuth authKey={'teacher_course_copy_btn'}>
              <Button
                onClick={() => {
                  duplicateRef?.current?.open();
                }}
              >
                复制
              </Button>
            </BtnAuth>,
            <BtnAuth authKey={'teacher_course_add_btn'}>
              <Button
                type="primary"
                onClick={() => {
                  tableFormRef?.current?.open('add');
                }}
              >
                新建
              </Button>
            </BtnAuth>,
          ];
        }}
        search={{
          labelWidth: 100,
          span: 8,
          defaultCollapsed: false,
          collapseRender: () => null,
        }}
        columns={columns}
        scroll={{ x: columns.length * 150, y: 400 }}
        rowKey="id"
        loading={tableLoading}
        request={async (params = {}, sort, filter) => {
          await getAllTablelist({});
          return getTableList({ page: params?.current, ...params });
        }}
      />
      {/* //复制弹窗 */}
      <DuplicateForm
        cref={duplicateRef}
        allTableList={allTableList}
        courseCopy={courseCopy}
        reload={() => {
          tableRef?.current?.reload();
        }}
      ></DuplicateForm>
      {/* 新增编辑表单 */}
      <TableForm
        cref={tableFormRef}
        courseAdd={courseAdd}
        courseDetail={courseDetail}
        courseEdit={courseEdit}
        reload={() => {
          tableRef?.current?.reload();
        }}
        loading={formLoading}
      ></TableForm>
    </PageContainer>
  );
};

export default TeacherWeb;
