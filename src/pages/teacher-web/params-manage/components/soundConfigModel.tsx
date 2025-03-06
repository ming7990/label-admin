import React, { useImperativeHandle, useState } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

interface IProps {
  cref: any;
  comfirmSubmit: (values: any, record: any, type: string) => void;
}

const UserProfileModal: React.FC<IProps> = ({ cref, comfirmSubmit }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [type, setType] = useState<string>('');

  useImperativeHandle(cref, () => ({
    open: (row: any, pageType: string, detail?: any) => {
      setRecord(row);
      setType(pageType);
      setVisible(true);
      if (pageType === 'edit' && detail) {
        form.setFieldsValue(detail);
      } else {
        form.resetFields();
      }
    },
    close: () => {
      setVisible(false);
      form.resetFields();
    },
  }));

  const handleSubmit = async () => {
    const values = await form.validateFields();
    comfirmSubmit(values, record, type);
  };

  return (
    <Modal
      title="音色设置"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setVisible(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit}>
          保存
        </Button>,
      ]}
      destroyOnClose
      width={500}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="音色名称"
          name="name"
          rules={[{ required: true, message: '请输入音色名称' }]}
        >
          <Input placeholder="请输入音色名称" />
        </Form.Item>

        <Form.Item
          label="音色选择"
          name="voiceType"
          rules={[{ required: true, message: '请选择音色' }]}
          initialValue="xiaoyun"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="音量"
          name="volume"
          rules={[{ required: true, message: '请设置音量' }]}
          initialValue={50}
        >
          <Input type="range" min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="音速"
          name="speed"
          rules={[{ required: true, message: '请设置音速' }]}
          initialValue={0}
        >
          <Input type="range" min={-100} max={100} />
        </Form.Item>

        <Form.Item
          label="音调"
          name="pitch"
          rules={[{ required: true, message: '请设置音调' }]}
          initialValue={0}
        >
          <Input type="range" min={-100} max={100} />
        </Form.Item>

        <Form.Item label="试听" name="preview">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.TextArea
              placeholder="请输入文本点击试听按钮"
              rows={4}
            />
            <Button type="link" style={{ padding: 0 }}>
              试听
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProfileModal;