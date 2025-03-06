import { Fragment, useRef, useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Divider, Button, Input, Select, message, Modal, Popconfirm, Form } from 'antd';
import { useTableModel } from './model';
import { history, useModel } from 'umi';
import BtnAuth from '@/components/BtnAuth';

export default function () {
  const [formRef] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [type, setType] = useState<'add' | 'edit'>('add');
  const tableRef = useRef();
  const rowId = useRef();
  const [isDetail, setIsDetail] = useState(false);

  const { tableList, tableLoading, addOrEdit, onDelete } = useTableModel();

  const columns: any[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      title: '序号',
      search: false,
    },
    {
      dataIndex: 'title',
      title: '标题',
      search: false,
    },
    {
      dataIndex: 'content',
      title: '内容',
      search: false,
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      search: false,
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      search: false,
    },
    {
      dataIndex: 'updateTime',
      title: '最近更新时间',
      search: false,
    },
    {
      dataIndex: 'opt',
      title: '操作',
      search: false,
      width: 180,
      render: (_: any, record: any) => {
        return (<div>
          <BtnAuth authKey={'paramsManage_tipsManage_detail_btn'}>
            <Button type="link" onClick={() => onEdit(record, true)} key="sameStep">查看</Button>
          </BtnAuth>
          <BtnAuth authKey={'paramsManage_tipsManage_edit_btn'}>
            <Divider type="vertical" style={{ margin: '0' }} />
            <Button type="link" key="sameStep" onClick={() => onEdit(record)}>编辑</Button>
          </BtnAuth>
          <BtnAuth authKey={'paramsManage_tipsManage_delete_btn'}>
            <Divider type="vertical" style={{ margin: '0' }} />
            <Popconfirm
              title="确认删除该条提示？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                const res = await onDelete({ id: record.id });
                if (res) tableRef.current?.reload();
              }}
            >
              <Button type="link" danger>删除</Button>
            </Popconfirm>
          </BtnAuth>
        </div>);
      }
    }
  ];
  const onAdd = () => {
    setType('add');
    formRef.resetFields();
    setVisible(true);
    setIsDetail(false);
  };

  // 编辑;
  const onEdit = ({ title, content, id }: { title: string, content: string, id: any }, readonly?: boolean) => {
    setType('edit');
    rowId.current = id;
    formRef.resetFields();
    formRef.setFieldsValue({ title, content });
    setVisible(true);
    setIsDetail(!!readonly);
  };

  const onOk = async () => {
    const valid = await formRef.validateFields();
    console.log(valid);
    if (valid) {
      if (type == 'edit') valid.id = rowId.current;
      setBtnLoading(true);
      addOrEdit(valid, type, (res: boolean) => {
        setBtnLoading(false);
        if (res) {
          setVisible(false);
          tableRef.current?.reload();
        }
      });
    }
  };

  return (
    <Fragment>
      <PageContainer
        header={{
          title: '提示管理',
          breadcrumb: {},
        }}
      >
        <ProTable
          actionRef={tableRef}
          loading={tableLoading}
          headerTitle={"提示列表"}
          toolBarRender={() => [
            <BtnAuth authKey={'paramsManage_tipsManage_add_btn'}>
              <Button type="primary" key="sameStep" onClick={onAdd}>
                新建
              </Button>
            </BtnAuth>,
          ]}
          options={false}
          search={false}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          request={async (params: any, sort: any) => {
            return tableList({ ...params, page: params?.current, })
          }}
        ></ProTable>
      </PageContainer>
      <Modal
        title={isDetail ? "查看" : (type == 'add' ? "新建" : "编辑")}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onOk}
        footer={isDetail ? null : [
          <div>
            <Button onClick={() => { setVisible(false); setBtnLoading(false) }} type='ghost'>取消</Button>
            <Button loading={btnLoading} onClick={onOk} type='primary'>确定</Button>
          </div>
        ]}
      >
        <Form form={formRef}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input readOnly={isDetail} placeholder="请输入" showCount maxLength={100}></Input>
          </Form.Item>
          <Form.Item label="内容" name="content">
            <Input.TextArea readOnly={isDetail} style={{ width: 'auto' }} placeholder="请输入" showCount cols={21} rows={5} maxLength={500}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}