import React from 'react';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import style from './style.less';
import { useDataManageModel } from './model'

const DetailData = () => {
  const query = history.location.query || {};
  const { id, tab, title, radioValue, cache } = query;
  const { studentDetailReporApi } = useDataManageModel()

  const goBack = () => {
    // 回到数据管理列表页面
    history.replace(`/front/teacher/dataManage/tablepage`, {
      tab,
      radioValue,
      cache,
    });
  };

  const columns = [
    {
      title: '日期',
      dataIndex: '',
      key: 'createDate',
      width: 120,
      search: true,
      valueType: 'dateRange',
      order: 1,
    },
    {
      title: '课程样式',
      dataIndex: 'courseType',
      key: 'courseType',
      width: 120,
      search: true,
      order: 2,
      renderFormItem: () => (
        <Select
          mode="multiple"
          placeholder="请选择课程样式"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { label: '常规', value: '0' },
            { label: '剧情', value: '1' },
            { label: '文本', value: '2' },
            { label: '视频', value: '3' },
            { label: '大模型剧情', value: '4' },
          ]}
        />
      ),
      // 表格中显示的内容  
      render: (_, record) => {
        const typeMap = {
          '0': '常规',
          '1': '剧情',
          '2': '文本',
          '3': '视频',
          '4': '大模型剧情',
        };
        // 如果courseTypeList是数组，就遍历转换；如果是单个值，就直接转换  
        if (Array.isArray(record.courseType)) {
          return record.courseType.map(type => typeMap[type]).join('、');
        }
        return typeMap[record.courseType] || record.courseType;
      }
    },
    {
      title: '训练时长(小时)',
      dataIndex: 'totalExamDuration',
      key: 'totalExamDuration',
      width: 120,
      search: false,
    },
    {
      title: '考试时长(小时)',
      dataIndex: 'totalTrainingDuration',
      key: 'totalTrainingDuration',
      width: 120,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      search: false,
      render: (_, record) => (
        <Button type="link" onClick={() => showCourseDetail(record)}>
          课程详情
        </Button>
      ),
    },
  ];

  const showCourseDetail = (record) => {
    console.log('查看课程详情:', record);
    let src = `/front/teacher/dataManage/courseDetails?id=${id}&title=${title}&tab=${tab}&cache=${cache}&createDate=${record.createDate}`;
    if (tab === 'student') {
      src += `&radioValue=${radioValue}`;
    }
    console.log(src);
    history.push(src)
  };

  // 模拟请求数据的方法  
  const fetchStudentData = async (params) => {
    try {
      const { createDate, courseType, current, pageSize } = params;

      // 构造请求参数  
      const requestParams = {
        page: current,
        pageSize,
        courseType: courseType || [],
        beginTime: createDate?.[0],
        endTime: createDate?.[1]
      };

      const response = await studentDetailReporApi(requestParams);

      return {
        data: response?.data?.list || [],
        total: response?.data?.totalPage || 0,
      };
    } catch (error) {
      console.error('获取详细数据失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  return (
    <PageContainer
      header={{
        title: '',
        ghost: true,
      }}
      content={
        <div className={style['detail-page']}>
          <div className={style['title']}>
            <ArrowLeftOutlined onClick={goBack} style={{ marginRight: '8px' }} />
            <span>{title}-详细数据</span>
          </div>
        </div>
      }
    >
      <ProTable
        rowKey="id"
        columns={columns}
        tableStyle={{ margin: '0 24px' }}
        request={fetchStudentData}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
          collapseRender: false,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        toolBarRender={false}
      />
    </PageContainer>
  );
};

export default DetailData;