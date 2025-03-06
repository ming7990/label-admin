import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, InputNumber, Input, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const knowledgeOptions = [
  { value: '轻微违规', label: '轻微违规' },
  { value: '一般违规', label: '一般违规' },
  { value: '严重违规', label: '严重违规' },
  { value: '重大违规', label: '重大违规' },
  { value: '催收话术类', label: '催收话术类' },
  { value: '其他类', label: '其他类' }
];

const questionTypeOptions = [
  { value: 0, label: '单选题' },
  { value: 1, label: '多选题' },
  { value: 2, label: '判断题' },
  { value: 3, label: '填空题' },
  { value: 4, label: '简答题' },
  { value: 5, label: '论述题' }
];

const GenerateQuestionModal = ({ visible, onCancel, onSubmit, record }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 检查知识点和自定义知识点是否至少填写一个  
      const { knowledgePointList = [], customizeknowledgePointList = [] } = values;
      const hasKnowledgePoints = Array.isArray(knowledgePointList) && knowledgePointList.length > 0;
      const hasCustomKnowledge = customizeknowledgePointList.some(item => item && item.trim());

      if (!hasKnowledgePoints && !hasCustomKnowledge) {
        message.error('知识点名称和自定义知识点必须填写一个');
        return;
      }

      setLoading(true);
      console.log('表单数据:', values);
      await onSubmit({ ...values, id: record.id });
      handleCancel();
    } catch (error) {
      if (error) {
        return;
      }
      console.log('生成失败');
    } finally {
      setLoading(false);
    }
  };

  // 依赖项更新时进行表单验证  
  const validateKnowledges = async (rule, value) => {
    const formValues = form.getFieldsValue();
    const { knowledgePointList = [], customizeknowledgePointList = [] } = formValues;
    const hasKnowledgePoints = Array.isArray(knowledgePointList) && knowledgePointList.length > 0;
    const hasCustomKnowledge = customizeknowledgePointList.some(item => item && item.trim());

    if (!hasKnowledgePoints && !hasCustomKnowledge) {
      throw new Error('知识点名称和自定义知识点必须填写一个');
    }
  };

  return (
    <Modal
      title="新建题目"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          knowledgePointList: [],
          customizeknowledgePointList: [''],
          questions: [{ questionType: undefined, questionNumber: undefined }]
        }}
      >
        {/* 知识点名称 */}
        <Form.Item
          name="knowledgePointList"
          label="知识点名称"
          rules={[{ validator: validateKnowledges }]}
        >
          <Select
            placeholder="请选择知识点"
            options={knowledgeOptions}
            mode="multiple"
            allowClear
            style={{ width: 'calc(100% - 76px)' }}  // 减去操作列的宽度  
          />
        </Form.Item>

        {/* 自定义知识点名称 */}
        <Form.List name="customizeknowledgePointList">
          {(fields, { add, remove }) => (
            <div>
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>自定义知识点名称</div>
                <div style={{ width: 60 }}>操作</div>
              </div>
              {fields.map((field, index) => (
                <div key={field.key} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <Form.Item
                    {...field}
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[{ validator: validateKnowledges }]}
                  >
                    <Input placeholder="请输入自定义知识点" maxLength={50} />
                  </Form.Item>
                  <div style={{ display: 'flex', gap: 8, width: 60 }}>
                    <PlusOutlined
                      onClick={() => add('', index + 1)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#1890ff',
                        marginTop: 8
                      }}
                    />
                    {index > 0 && (
                      <DeleteOutlined
                        onClick={() => remove(field.name)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#ff4d4f',
                          marginTop: 8
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Form.List>

        {/* 题型和数量表单组 */}
        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <div>
              <div style={{ display: 'flex', marginBottom: 8 }}>
                <Form.Item
                  label="题型"
                  required
                  colon={false}
                  style={{ flex: 1, marginBottom: 0, height: 22 }}
                />
                <Form.Item
                  label="试题数量"
                  required
                  colon={false}
                  style={{ flex: 1, marginBottom: 0, height: 22 }}
                />
                <div style={{ width: 60 }}>操作</div>
              </div>
              {fields.map((field, index) => (
                <div key={field.key} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <Form.Item
                    name={[field.name, 'questionType']}
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[{ required: true, message: '请选择题型' }]}
                  >
                    <Select
                      placeholder="请选择题型"
                      options={questionTypeOptions}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'questionNumber']}
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[
                      { required: true, message: '请输入数量' },
                      { type: 'number', min: 1, max: 50, message: '数量范围为1-50' }
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={50}
                      placeholder="请输入数量"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', gap: 8, width: 60 }}>
                    <PlusOutlined
                      onClick={() => add({ questionType: undefined, questionNumber: undefined }, index + 1)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#1890ff',
                        marginTop: 8
                      }}
                    />
                    {index > 0 && (
                      <DeleteOutlined
                        onClick={() => remove(field.name)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#ff4d4f',
                          marginTop: 8
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default GenerateQuestionModal;