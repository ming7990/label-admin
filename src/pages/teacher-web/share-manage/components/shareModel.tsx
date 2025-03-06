import { useState, useImperativeHandle, Fragment, useEffect, useRef } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Checkbox,
  Space,
  Radio,
  Upload,
  Popconfirm,
} from 'antd';
import { useTableModel } from '../model';
import { UploadOutlined } from '@ant-design/icons';
import config from '@/config/index';
const { successCode } = config;
import { getShareVideoList } from '../model/api';
import style from '../style.less';

export default (props: any) => {
  const { cref, loading, comfirmSubmit } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [pageType, setPageTyp] = useState<any>('');

  const uploadRef = useRef<any>();
  const [extrData, setExtrData] = useState({});
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const baseUrl: string = config.basePath;

  const { classAll, getClassAll, createId } = useTableModel();

  useImperativeHandle(cref, () => ({
    open: (record: any, type: any) => {
      setVisible(true);
      setRowData(record);
      setPageTyp(type);
      getClassAll();
      if (type == 'add') {
        form.setFieldsValue({ type: 2, name: '', classId: '' });
        createId().then((res) => {
          setRowData({ id: res.data?.id });
        });
      } else if (type == 'edit') {
        getShareVideoList({ shareId: record.id }).then((res: any) => {
          const list = res?.data || [];
          const files: any = [];
          list.forEach((item: any) => {
            files.push({
              uid: item.id,
              name: item.fileName,
              status: 'done',
              response: { resultCode: successCode },
            });
          });
          setFileList(files);
          form.setFieldsValue({ file: files });
        });
        form.setFieldsValue({ type: 2, name: record?.name, classId: record?.classId });
      }
    },
    close: onClose,
  }));

  const onClose = () => {
    setVisible(false);
    setFileList([]);
    form.resetFields();
  };

  const save = async () => {
    let formVal = await form.validateFields();
    comfirmSubmit(formVal, rowData, pageType);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const fileValidator = (rule: any, value: any, callback: any) => {
    console.log(value);
    if (value && (value.length || value?.fileList?.length)) return Promise.resolve(true);
    return Promise.reject(new Error('请上传文件'));
  };

  const handleChange = ({ file, fileList = [] }: any) => {
    console.log(file, 'infor');
    if (file.status === 'done') {
      // file.response.data.fileNumber = extrData.fileNumber;
      if (file.response.resultCode == successCode) {
        console.log(file.response);
        form.setFieldsValue({ file: [file] });
        message.success(`上传成功`);
        setFileList([...fileList]);
      } else {
        message.error(`上传失败`);
        setFileList([]);
        form.setFieldsValue({ file: [] });
      }
    } else if (file.status === 'error') {
      message.error(`上传失败`);
      setFileList([]);
      form.setFieldsValue({ file: [] });
    } else {
      setFileList([...fileList]);
    }
  };

  const videoUplodProps = {
    // accept: ['.avi', '.mp4', '.flv', '.mkv', '.m4v', '.mov'],
    fileList,
    onChange: handleChange,
    data: extrData,
    action: `${baseUrl}/services/share/video/upload`,
    beforeUpload: (file: File) => {
      return new Promise(async (r, j) => {
        const isLimit = file.size / 1024 / 1024 > 2048;
        if (isLimit) {
          message.error('文件大小需小于2048MB!');
          return j(false);
        }

        setExtrData({
          type: '2',
          shareId: rowData.id,
        });
        return r(true);
      });
    },
  };

  return (
    <Modal
      title={pageType == 'add' ? '新建共享文件' : pageType == 'edit' ? '编辑共享文件' : ''}
      width={572}
      centered
      onCancel={onClose}
      visible={visible}
      footer={
        <Space>
          <Button onClick={onClose} loading={loading}>
            取消
          </Button>
          <Button type="primary" onClick={save} loading={loading}>
            确定
          </Button>
        </Space>
      }
      destroyOnClose
    >
      <Form form={form} {...layout}>
        <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择类型' }]}>
          <Radio.Group disabled={pageType === 'edit'}>
            <Radio key={2} value={2}>
              视频
            </Radio>
            {/* <Radio key={1} value={1}>
              录音
            </Radio> */}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input maxLength={100} showCount />
        </Form.Item>
        <Form.Item
          label="文件分类"
          name="classId"
          rules={[{ required: true, message: '请选择文件分类' }]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.item?.className as unknown as string)
                ?.toLowerCase()
                ?.includes(input.toLowerCase())
            }
          >
            {classAll?.map((item, index) => (
              <Select.Option key={index} value={item.id} item={item}>
                {item.className}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={'上传文件'}
          name={'file'}
          rules={[{ required: true, message: '请上传文件', validator: fileValidator }]}
        >
          <Popconfirm
            title={
              <span style={{ width: 200, display: 'block' }}>
                仅支持上传一个文件且替换原文件，是否确认操作！
              </span>
            }
            onConfirm={() => {
              uploadRef?.current?.click();
            }}
            placement="right"
            okText="确认"
            cancelText="取消"
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              点击上传
            </Button>
          </Popconfirm>
          <Upload
            {...videoUplodProps}
            className={style['upload']}
            disabled={uploading}
            maxCount={1}
          >
            <div style={{ display: 'none' }} ref={uploadRef}></div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
