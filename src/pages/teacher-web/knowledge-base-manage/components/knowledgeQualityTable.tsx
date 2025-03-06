import React, { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import BtnAuth from '@/components/BtnAuth';
import { Popconfirm, Select, Button, Space, message } from 'antd';
import { knowledgeTypeText, KnowledgeTypeList } from '@/type/knowledge';
import { history } from 'umi';
import {
  TABLE_PAGINATION,
  AUTH_KEYS,
  QUESTION_STATUS,
  questionTypeText,
  questionStatusText,
  TABLE_CONFIG,
  statusText,
} from './constants';
import FileFormModal from './modal/FileFormModal';
import GenerateQuestionModal from './modal/GenerateQuestionModal';
import KnowledgeQuestion from './modal/knowledgeQuestion';
import { useTableModel } from '../model';

const KnowledgeQualityTable = ({ status }) => {
  const tableRef = useRef(null);
  const creatRef = useRef(null);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [creatorList, setcreatorList] = useState<any>([]);
  const {
    qualityList,
    addQuality,
    editQuality,
    deleteQuality,
    qualityGenQuestion,
    getCreatorList,
    qualityQuestionLis,
    deleteQualityQuestion,
    qualityQuestionStatus
  } = useTableModel();


  useEffect(() => {
    getCreatorList({ change: status }).then((res: any) => {
      setcreatorList(res?.data);
    });
  }, [status]);

  const getFileColumns = () => [
    {
      title: '知识点名称',
      dataIndex: 'name',
      search: true,
      order: 3,
      ellipsis: true,
    },
    // {
    //   title: '类型',
    //   dataIndex: 'type',
    //   valueEnum: knowledgeTypeText,
    //   search: false,
    //   width: 100,
    // },
    // {
    //   title: '类型',
    //   dataIndex: 'typeList',
    //   search: true,
    //   hideInTable: true,
    //   width: 100,
    //   order: 1,
    //   fieldProps: {
    //     placeholder: '请选择',
    //   },
    //   renderFormItem: (t: any, r: any, i: any) => {
    //     return (
    //       <Select
    //         allowClear
    //         showSearch
    //         showArrow
    //         mode='multiple'
    //         style={{ width: '100%' }}
    //         optionFilterProp="label"
    //         filterOption={(input, option) =>
    //           (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    //         }
    //         className="custom-select"
    //         options={KnowledgeTypeList.map((item: any) => ({
    //           label: item.label,
    //           value: item.value
    //         }))}
    //       />
    //     );
    //   },
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      width: 180,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      search: false,
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'creatorList',
      search: true,
      hideInTable: true,
      width: 100,
      order: 2,
      fieldProps: {
        placeholder: '请选择',
      },
      renderFormItem: (t: any, r: any, i: any) => {
        return (
          <Select
            allowClear
            mode='multiple'
            showSearch
            showArrow
            style={{ width: '100%' }}
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            className="custom-select"
            options={creatorList.map((item: any) => ({
              label: item.userName,  // 使用 userName 作为显示文本  
              value: item.account    // 使用 account 作为值  
            }))}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: questionStatusText,
      search: false,
      width: 120,
    },
  ];

  const getQuestionColumns = () => [
    {
      title: '题干',
      dataIndex: 'question',
      search: true,
      order: 3,
      ellipsis: true,
      fieldProps: {
        placeholder: '请输入题干关键字',
      },
    },
    {
      title: '知识点名称',
      dataIndex: 'knowledgePoints',
      search: true,
      order: 1,
      width: 180,
      fieldProps: {
        placeholder: '请输入知识点名称关键字',
      },
    },
    {
      title: '题型',
      dataIndex: 'questionType',
      valueEnum: questionTypeText,
      search: true,
      order: 2,
      width: 120,
      fieldProps: {
        placeholder: '请选择题型',
        mode: 'multiple',
        allowClear: true,
        showArrow: true,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusText,
      search: true,
      width: 120,
      fieldProps: {
        placeholder: '请选择状态',
        mode: 'multiple',
        allowClear: true,
        showArrow: true,
      },
    },
    // {
    //   title: '试题难易等级',
    //   dataIndex: 'difficultyLevel',
    //   valueEnum: difficultyLevelText,
    //   search: true,
    //   width: 120,
    //   fieldProps: {
    //     placeholder: '请选择难易等级',
    //     mode: 'multiple',
    //     allowClear: true,
    //     showArrow: true,
    //   },
    // },
  ];

  const getOperationColumn = () => ({
    title: '操作',
    width: 220,
    fixed: 'right',
    search: false,
    render: (_, record: any) => {
      if (status === 0) {
        return (
          <Space>
            <Button type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => handleGenerateQuestion(record)}>
              生成试题
            </Button>
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      }

      return (
        <Space>
          {record.status === 0 && (
            <Button type="link" onClick={() => handleStatusChange(record.id, 1)}>
              发布
            </Button>
          )}
          {record.status === 1 && (
            <Button type="link" onClick={() => handleStatusChange(record.id, 2)}>
              下线
            </Button>
          )}
          <Button type="link" onClick={() => creatRef?.current?.open('edit', record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      );
    },
  });

  const handleEdit = (record: any = '') => {
    if (record) {
      setCurrentRecord(record);
    } else {
      setCurrentRecord(null);
    }
    setFileModalVisible(true);
  };

  const handleGenerateQuestion = (record) => {
    setCurrentRecord(record);
    setGenerateModalVisible(true);
  };

  const handleFileSubmit = async (values) => {
    try {
      console.log(values);
      if (values['file']) delete values.file
      let res = ""
      if (currentRecord) {
        res = await editQuality({ id: currentRecord.id, ...values })
      } else {
        res = await addQuality(values);
      }
      if (res.resultCode === '100') {
        message.success(res.resultDesc || '保存成功');
        setFileModalVisible(false);
        setCurrentRecord(null);
        tableRef.current?.reload();
      } else {
        message.error(res.resultDesc || '保存失败');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateSubmit = async (values) => {
    try {
      console.log(values);
      const res = await qualityGenQuestion({
        ...values
      });
      if (res.resultCode === '100') {
        message.success(res.resultDesc || '生成成功');
        setGenerateModalVisible(false);
        setCurrentRecord(null);
        tableRef.current?.reload();
      } else {
        message.error(res.resultDesc || '生成失败');
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = status === 0 ? await deleteQuality({ id }) : await deleteQualityQuestion({ id });
      if (res.resultCode === '100') {
        message.success(res.resultDesc || '删除成功');
        tableRef.current?.reload();
      } else {
        message.error(res.resultDesc || '删除失败');
      }
    } catch (error) {

    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await qualityQuestionStatus({ id, status: newStatus });
      if (res.resultCode === '100') {
        message.success(res.resultDesc || '操作成功');
        tableRef.current?.reload();
      } else {
        message.error(res.resultDesc || '操作失败');
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <ProTable
        {...TABLE_CONFIG}
        actionRef={tableRef}
        headerTitle={status === 0 ? "文件列表" : "题目列表"}
        pagination={TABLE_PAGINATION}
        toolBarRender={() =>
          status === 0 ? [
            <Button type="primary" onClick={() => handleEdit()}>
              新建
            </Button>
          ] : []
        }
        columns={[
          ...(status === 0 ? getFileColumns() : getQuestionColumns()),
          getOperationColumn(),
        ]}
        request={async (params = {}, sort) => {
          const key = Object.keys(sort)[0];
          const desc = key ? sort[key] === 'descend' : true;

          try {
            const { current, ...restParams } = params;
            const reqFn = status === 0 ? qualityList : qualityQuestionLis
            const res = await reqFn({
              // orderBy: key,
              // orderDesc: desc,
              ...restParams,
              page: current,
            });

            return {
              data: res?.data?.list || [],
              total: res?.data?.totalPage || 0,
            };
          } catch (error) {
            return {
              data: [],
              total: 0,
            };
          }
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
      />

      <FileFormModal
        visible={fileModalVisible}
        onCancel={() => {
          setFileModalVisible(false);
          setCurrentRecord(null);
        }}
        onSubmit={handleFileSubmit}
        record={currentRecord}
        title={currentRecord ? '编辑知识' : '新建知识'}
      />

      <GenerateQuestionModal
        visible={generateModalVisible}
        onCancel={() => {
          setGenerateModalVisible(false);
          setCurrentRecord(null);
        }}
        onSubmit={handleGenerateSubmit}
        record={currentRecord}
      />
      <KnowledgeQuestion
        cref={creatRef}
        reload={() => {
          tableRef?.current?.reload();
        }}
      ></KnowledgeQuestion>
    </>
  );
};

export default KnowledgeQualityTable;