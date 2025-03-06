import { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Form, Input, Select, Button, message, Radio, Space } from 'antd';

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
        form.setFieldsValue({ name: '', status: '' });
        setRowData({});
      } else if (type == 'edit') {
        form.setFieldsValue({ name: record?.name, status: record?.status || 0 });
      }
    },
    close: onClose,
  }));

  const onClose = () => {
    setVisible(false);
  };

  const save = async () => {
    let formVal = await form.validateFields();
    console.log(formVal, rowData, pageType);
    comfirmSubmit(formVal, rowData, pageType);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      title="剧情分类"
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
          label="剧情分类名称"
          name="name"
          rules={[{ required: true, message: '请输入模型名称' }]}
        >
          <Input maxLength={30} showCount />
        </Form.Item>
        <Form.Item
          label="启动状态"
          name="status"
          rules={[{ required: true, message: '请输入nlu地址' }]}
        >
          <Radio.Group>
            <Radio value={1}>开</Radio>
            <Radio value={0}>关</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
