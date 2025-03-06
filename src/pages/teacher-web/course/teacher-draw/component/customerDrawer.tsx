import { useDrawModel } from '@/pages/teacher-web/course/model';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';

const CustomerDrawer: React.FC<any> = (props: any) => {
  const { cref, isEdit } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<any>(false);
  const { courseCustomInfo, courseCustomInfoSave } = useDrawModel();
  const [info, setInfo] = useState<any>({});

  const { courseInfo } = useModel('course', (model: any) => ({
    courseInfo: model.courseInfo,
  }));

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onOk = async () => {
    let valid = await form.validateFields();
    if (valid) {
      await courseCustomInfoSave({ ...info, ...valid }).then((res) => {
        if (res) {
          onCancel();
        }
      });
    }
  };

  const open = async (type: any, row?: any) => {
    // setFormType(type);
    await courseCustomInfo({ courseId: courseInfo?.id }).then((res) => {
      if (res) {
        form.setFieldsValue(res?.data);
        setInfo(res?.data);
        setVisible(true);
      }
    });
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Drawer
      title={'客户信息'}
      placement="right"
      onClose={onCancel}
      visible={visible}
      footer={
        <Space align="baseline" style={{ float: 'right' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onOk} disabled={isEdit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item name="customerInfo" label="客户信息">
          <Input.TextArea rows={5} showCount maxLength={100} placeholder="请输入客户背景或信息" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CustomerDrawer;
