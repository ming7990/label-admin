import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fileTypeOptions } from '../constants';
import { useTableModel } from '../../model';

interface FileFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  record?: any;
  title?: string;
}

const FileFormModal: React.FC<FileFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  record,
  title = '新建知识',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [knowledgeId, setKid] = React.useState<string>('');

  const {
    knowledgeUpload,
    getKnowledgeId,
    getKnowledgeFiles
  } = useTableModel();

  const getId = async () => {
    const res = await getKnowledgeId();
    console.log(res?.data?.id, 'res?.data?.id');
    setKid(res?.data?.id); // 生成knowledgeId
  }

  useEffect(() => {
    const initForm = async () => {
      if (visible) {
        await getId();
        if (record) {
          try {
            const res = await getKnowledgeFiles({ id: record.id });
            const list = res?.data || [];
            const files = list.map(item => ({
              uid: item.id,
              name: item.fileName,
              fileNumber: item.fileNumber,
              status: 'done',
              url: item.url,
            }));

            setFileList(files);

            // 等待fileList更新后设置表单值  
            form.setFieldsValue({
              type: record.type,
              name: record.name,
              topicContent: record.topicContent,
              file: files // 直接使用新的files数组  
            });
          } catch (err) {
            setFileList([]);
          }
        } else {
          form.resetFields();
          setFileList([]);
        }
      }
    };
    initForm();
  }, [visible, record, form]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit({ ...values, id: record ? record.id : knowledgeId });
      form.resetFields();
      setFileList([]);
      onCancel();
    } catch (error) {
      if (error) {
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: async (file: File) => {
      const extension = file.name.split('.').pop()?.toLowerCase();

      const isValidType = fileTypeOptions.some(type => type.label === extension);

      if (!isValidType) {
        message.error(`请上传正确的文件格式！支持的格式：${fileTypeOptions.map(type => type.label).join('、')}`);
        return Upload.LIST_IGNORE;
      }

      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过100MB！');
        return Upload.LIST_IGNORE;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        // 添加额外的字段  
        formData.append('fileNumber', 0);
        formData.append('knowledgeId', record && record.id ? record.id : knowledgeId);
        formData.append('knowledgeType', 3);
        formData.append('source', 1);
        const response = await knowledgeUpload(formData);

        if (response?.data) {
          setFileList([{
            uid: '-1',
            name: file.name,
            status: 'done',
            url: response.data?.url,
          }]);

          form.setFieldsValue({
            fileName: file.name
          });

          message.success(response?.resultDesc || '文件上传成功');
        } else {
          throw new Error(response?.resultDesc || '上传失败');
        }
      } catch (error) {
        message.error('文件上传失败');
        setFileList([]);
        form.setFieldsValue({
          fileId: undefined,
          fileName: undefined
        });
      } finally {
        setUploading(false);
      }

      return false;
    },
    maxCount: 1,
    onRemove: () => {
      setFileList([]);
      form.setFieldsValue({
        file: undefined,
        fileId: undefined,
        fileName: undefined
      });
    },
    fileList,
    accept: '.doc,.docx,.pdf,.xlsx,.ppt',
    showUploadList: {
      showRemoveIcon: !uploading,
    },
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择文件类型' }]}
        >
          <Select
            placeholder="请选择文件类型"
            options={fileTypeOptions}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="名称"
          rules={[
            { required: true, message: '请输入名称' },
            { max: 100, message: '名称不能超过100个字符' }
          ]}
        >
          <Input placeholder="请输入名称" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="topicContent"
          label="主题内容"
          rules={[{ max: 1000, message: '内容不能超过1000个字符' }]}
        >
          <Input.TextArea
            placeholder="请输入主题内容"
            maxLength={1000}
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="file"
          label="上传文档"
          rules={[{
            required: true, message: '请上传文档', validator: (_, value) => {
              if (fileList.length === 0) {
                return Promise.reject('请上传文档');
              }
              return Promise.resolve();
            }
          }]}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FileFormModal;