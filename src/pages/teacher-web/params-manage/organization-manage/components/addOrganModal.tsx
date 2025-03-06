import { Button, Modal, Form, Input, message } from 'antd';
import React, { useState, useImperativeHandle, useRef, useEffect } from 'react';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const AddWorkplaceModal = React.forwardRef((props: any, ref) => {
  const { updateData } = props;
  const [actionType, setActionType] = useState('add');
  const [organizationInfo, setOrganizationInfo] = useState({} as any);
  let actionRef = useRef(async (o: any) => { });

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      showModal,
      handleCancel,
      handleOk,
    };
  });

  const showModal = (params: any) => {
    const { organInfo, actType, action } = params;
    console.log(1111, params)
    setOpen(true);
    setActionType(actType);
    setOrganizationInfo(organInfo);
    actionRef.current = action;
    if (actType === 'add') {
      form.setFieldsValue({ organizationName: '' });
    } else if (actType === 'edit') {
      form.setFieldsValue({ organizationName: organInfo.organizationName });
    }
  };

  const handleOk = async () => {
    try {
      const fromParams = await form.validateFields();
      setConfirmLoading(true);
      if (actionType === 'add') {
        await actionRef.current(fromParams);
      } else if (actionType === 'edit' && fromParams.organizationName !== organizationInfo.organizationName) {
        await actionRef.current({ ...fromParams, id: organizationInfo.id });
      }
      updateData()
      setConfirmLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={actionType === 'add' ? '新增机构' : '编辑机构'}
      visible={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="机构名称"
          name="organizationName"
          rules={[{ required: true, message: '请输入机构名称' }]}
        >
          <Input maxLength={30} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddWorkplaceModal;
