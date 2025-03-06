import { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Form, Input, Select, Button, message, Checkbox, Space } from 'antd';

export default (props: any) => {
  const { cref, loading, groupList, comfirmSubmit } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [pageType, setPageTyp] = useState<any>('');

  useImperativeHandle(cref, () => ({
    open: (record: any, type: any) => {
      setVisible(true);
      setRowData(record);
      setPageTyp(type);
      if (type == 'add') {
        form.setFieldsValue({ modelName: '', modelAddress: '' });
        setRowData({});
      } else if (type == 'edit') {
        form.setFieldsValue({ modelName: record?.modelName, modelAddress: record?.modelAddress });
      }
    },
    close: onClose,
  }));

  const onClose = () => {
    setVisible(false);
  };

  const save = async () => {
    let formVal = await form.validateFields();
    comfirmSubmit(formVal, rowData, pageType);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <Modal
      title={pageType == 'add' ? '新建课程模型' : pageType == 'edit' ? '编辑课程模型' : ''}
      width={572}
      centered
      onCancel={onClose}
      visible={visible}
      footer={
        <Space>
          <Button type="primary" onClick={save} loading={loading}>
            确定
          </Button>
          <Button onClick={onClose} loading={loading}>
            取消
          </Button>
        </Space>
      }
      destroyOnClose
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="模型名称"
          name="modelName"
          rules={[{ required: true, message: '请输入模型名称' }]}
        >
          <Input maxLength={30} showCount />
        </Form.Item>
        <Form.Item
          label="nlu地址"
          name="modelAddress"
          rules={[{ required: true, message: '请输入nlu地址' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
