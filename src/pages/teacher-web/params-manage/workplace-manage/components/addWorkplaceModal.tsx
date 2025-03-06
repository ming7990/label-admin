import { Button, Modal, Form, Input, message } from 'antd';
import React, { useState, useImperativeHandle, useRef, useEffect } from 'react';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const AddWorkplaceModal = React.forwardRef((props: any, ref) => {
  const [actionType, setActionType] = useState('add');
  const [workplaceInfo, setWorkplaceInfo] = useState({} as any);
  let addWorkplaceActionRef = useRef(async (o: any) => {});
  let editWorkplaceActionRef = useRef(async (o: any) => {});

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
    const { wpInfo, actType, addWorkplaceAct, editWorkplaceAct } = params;
    setOpen(true);
    setActionType(actType);
    setWorkplaceInfo(wpInfo);
    if (actType === 'add') {
      addWorkplaceActionRef.current = addWorkplaceAct;
      form.setFieldsValue({ name: '' });
    } else if (actType === 'edit') {
      editWorkplaceActionRef.current = editWorkplaceAct;
      form.setFieldsValue({ name: wpInfo.name });
    }
  };

  const handleOk = async () => {
    try {
      const fromParams = await form.validateFields();
      setConfirmLoading(true);
      if (actionType === 'add') {
        await addWorkplaceActionRef.current(fromParams);
      } else if (actionType === 'edit' && fromParams.name !== workplaceInfo.name) {
        await editWorkplaceActionRef.current({ ...fromParams, id: workplaceInfo.id });
      }
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
      title={actionType === 'add' ? '新增职场' : '编辑职场'}
      visible={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="职场名称"
          name="name"
          rules={[{ required: true, message: '请输入职场名称' }]}
        >
          <Input maxLength={30} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddWorkplaceModal;
