import { handleKeyPress, validateSpaces } from '@/utils';
import { Modal, Form, Input, Button, Select } from 'antd';
import { useImperativeHandle, useState } from 'react';

const DuplicateForm: React.FC<any> = (props) => {
  const { cref, allTableList, courseCopy, reload } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<any>(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onOk = async () => {
    let valid = await form.validateFields();
    if (valid) {
      let res = await courseCopy({ ...valid });
      if (res) {
        onCancel();
        reload();
      }
    }
  };

  const open = () => {
    setVisible(true);
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Modal visible={visible} title="复制课程" onCancel={onCancel} onOk={onOk} width={600}>
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name="courseId"
          label="课程名称"
          rules={[{ required: true, message: '请选择要复制的课程' }]}
        >
          <Select placeholder="请选择要复制的课程">
            {allTableList?.map((item: any, index: any) => (
              <Select.Option key={index} value={item.id}>
                {item.courseName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="courseName"
          label="新课程名称"
          rules={[
            { required: true, message: '请输入复制完成的课程名称' },
            { validator: validateSpaces, trigger: 'change' },
          ]}
        >
          <Input
            showCount
            maxLength={75}
            placeholder="请输入复制完成的课程名称"
            onKeyPress={handleKeyPress}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DuplicateForm;
