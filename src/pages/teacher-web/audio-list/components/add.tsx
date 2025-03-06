import { useState, useRef, useImperativeHandle } from 'react';
import { Modal, Form, Input, Select, message, Upload, Button } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import config from '@/config/index';
import { useAddOrEditModel } from '../model/index';
import style from '../style.less';
import { getKnowledgeId, getKnowledgeFiles } from '../../knowledge-base-manage/model/api';
const baseUrl: string = config.basePath;
const successCode: any = config.successCode;

export default function (props: any) {
  const [formRef] = Form.useForm();
  const videoOrigin = Form.useWatch('videoOrigin', formRef);

  const [type, setType] = useState<'add' | 'edit'>('add');
  const [visible, setVisible] = useState(false);
  const [extrData, setExtrData] = useState<any>({});
  const [fileList, setFileList] = useState<any[]>([]);
  // const [shares, setShares] = useState<any[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [oFileList, setOfileList] = useState<any>([]);
  const [deleteList, setDeleteList] = useState<any>([]);
  const [cancelList, setCancalList] = useState<any>([]);
  const addId = useRef('');
  const [knowledgeId, setKnowledgeId] = useState<string>('');

  const { btnLoading, addOrEdit, getFileList, deleteVideoFile, getClassAll, shareList, shareList2, getFileRecordAll, shares, getShareVideoList } = useAddOrEditModel();

  const open = async (type: 'add' | 'edit', row?: any) => {
    setType(type);
    if (type == 'edit') {
      getKnowledgeFiles({ id: row.id, tab: 0 }).then(data => {
        const list = data.data
        console.log(1111, list)
        setKnowledgeId(row.id); // 生成knowledgeId
        const arr: any = [];
        list.forEach((item: any) => {
          arr.push({
            uid: item.id,
            name: item.fileName,
            fileNumber: item.fileNumber,
            status: 'done',
          });
        });
        console.log(arr, 'arr');
        setFileList(arr);
        formRef.setFieldsValue({
          title: row.title,
          content: row.content,
          file: arr,
          sharefileA: [],
          sharefileB: [],
          videoOrigin: 0,
        });
        selectShares([]);
        addId.current = row.id;
        setExtrData({ courseVideoId: row.id, fileNumber: 1 });
      });
    } else {
      const res = await getKnowledgeId();
      setKnowledgeId(res?.data?.id); // 生成knowledgeId
      setExtrData({ knowledgeId: res.data?.id, knowledgeType: 1, fileNumber: 1 });
      formRef.resetFields();
      setFileList([]);
    }
    setCancalList([]);
    setDeleteList([]);
    getClassAll();
    getFileRecordAll({});
    setVisible(true);
  };
  const close = () => {
    formRef.resetFields();
    setVisible(false);
    // 取消时 删除编辑期间上传的文件;
    if (type === 'edit' && cancelList.length) {
      deleteVideoFile({ idList: cancelList }).then(res => {
        setCancalList([]);
      });
    }
  };

  const onOk = async () => {
    const valid = await formRef.validateFields();
    if (valid) {
      const { title, content } = valid;
      const extParams: any = {};
      if (videoOrigin == '1' && shares.length) {
        if (!shares.length) {
          return message.warn('请选择共享文件');
        }
        extParams.shareFileList = shares.map((item: any) => item.id);
      }
      addOrEdit({ id: knowledgeId, title, content, courseId: props.courseId, ...extParams, courseType: 1 }, type, () => {
        props?.reload();
        setVisible(false);
        deleFiles();
      });
    }
  };
  const deleFiles = () => {
    if (deleteList.length) {
      deleteVideoFile({ idList: deleteList }).then(res => {
        setDeleteList([]);
      });
    }
  }

  useImperativeHandle(props.mref, () => ({
    open
  }));
  const onRemove = (file: any) => {
    console.log(file);
    return new Promise(r => {
      if (file.status === 'done') {
        const uid = file.uid;
        const list = [...deleteList];
        uid != undefined && list.push(uid);
        setDeleteList(list); // 缓存待删除的id;
        const { files = [] } = formRef.getFieldsValue();
        const index = files.findIndex(item => item.uid == uid);
        files.splice(index, 1);
        formRef.setFieldsValue({ file: files });
        r(true);
      } else {
        r(true);
      }
    });
  };
  const handleChange = ({ file, fileList = [] }: any) => {
    console.log(file, 'infor');
    if (file.status === 'done') {
      if (file.response.resultCode == successCode) {
        console.log(file.response);
        fileList.forEach(item => {
          item.fileNumber = item.fileNumber == undefined ? extrData.fileNumber : item.fileNumber;
        });
        message.success(`上传成功`);
        const list = [...cancelList];
        list.push(file.fileId);
        setCancalList(list);
      } else {
        message.error(`上传失败`);
      }
    } else if (file.status === 'error') {
      message.error(`上传失败`);
    }
    fileList = fileList.filter(item => item.status || (item.status && item.status != 'error'));
    setFileList([...fileList]);
  };
  const fileValidator = (rule, value, callback) => {
    console.log(value);
    if (value && (value.length || value?.fileList?.length)) return Promise.resolve(true);
    return Promise.reject(new Error('请上传文件'));
  };

  const uploadProps = {
    action: `${baseUrl}/services/knowledge/file/upload`,
    data: extrData,
    accept: '.wav,.mp3',
    fileList,
    onChange: handleChange,
    onPreview: (file: any) => { },
    onRemove,
  }
  const videoUplodProps = Object.assign({}, uploadProps, {
    // maxCount: 1,
    data: extrData,
    showUploadList: { showRemoveIcon: true },
    action: `${baseUrl}/services/knowledge/file/upload`,
    beforeUpload: (file: File) => {
      return new Promise(async (r, j) => {
        const isLimit = file.size / 1024 / 1024 > 2048;
        if (isLimit) {
          message.error('文件大小需小于2048MB!');
          return j(false);
        }

        let i = fileList.length;
        const fns = [];
        for (let j = 0; j < i; j++) {
          if (fileList[j].fileNumber == 'number') {
            fns.push(fileList[j].fileNumber);
          }
        }
        if (fns.length) i = Math.max(...fns);

        const fileNumber = i++;
        setExtrData({
          ...extrData,
          fileNumber,
          knowledgeId: knowledgeId,
          knowledgeType: 1
        });

        return r(true);
      });
    },
  });
  const selectShareList = (list: any[]) => {
    console.log(list, 'selectShareList');
    getFileRecordAll({ classIdList: list });
  };
  const selectShares = (list: any) => {
    getShareVideoList(list);
  };

  const onDeleteShareFile = (item: any) => {
    const shareIds: any[] = [];
    shares.forEach((o: any) => {
      if (item.shareId != o.shareId) shareIds.push(o.shareId);
    });
    formRef.setFieldsValue({ sharefileB: shareIds });
    selectShares(shareIds);
  }
  return (
    <Modal
      title={type === 'add' ? '新增录音' : '编辑录音'}
      visible={visible}
      onOk={onOk}
      onCancel={close}
      confirmLoading={btnLoading}
    >
      <Form form={formRef} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item name="title" label="主题" required rules={[{ required: true, message: '请填写主题' }]}>
          <Input maxLength={100} showCount></Input>
        </Form.Item>
        <Form.Item name="content" label="主题内容">
          <Input.TextArea maxLength={1000} showCount></Input.TextArea>
        </Form.Item>
        <Form.Item
          name="videoOrigin"
          label="录音来源"
          initialValue={0}
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select
            placeholder="请选择"
          // disabled={(type === 'edit')}
          >
            <Select.Option key={0} value={0}>
              本地录音
            </Select.Option>
            <Select.Option key={1} value={1}>
              共享文件
            </Select.Option>
          </Select>
        </Form.Item>
        {
          videoOrigin === 1 ? (
            <>
              <div style={{ display: 'flex' }} className='inline-formItem'>
                <Form.Item
                  wrapperCol={{ span: 14 }}
                  labelCol={{ span: 8 }}
                  style={{ display: 'flex', width: '55%', marginLeft: 45 }}
                  name="sharefileA"
                  label="共享文件"
                // rules={[{ required: true, message: '请选择' }]}
                >
                  <Select
                    placeholder="请选择文件分类"
                    optionFilterProp="children"
                    mode="multiple"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        ?.toLowerCase()
                        ?.includes(input.toLowerCase())
                    }
                    // disabled={(type === 'edit')}
                    onChange={selectShareList}
                  >
                    {
                      shareList?.map((item, index) => (
                        <Select.Option key={index} value={item.id}>
                          {item.className}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  wrapperCol={{ span: 18 }}
                  style={{ display: 'flex', width: '45%' }}
                  name="sharefileB"
                  label=""
                  rules={[{ required: true, message: '请选择' }]}
                >
                  <Select
                    placeholder="请选择文件名称"
                    mode="multiple"
                    showSearch
                    allowClear
                    filterOption={(input, option) => {
                      console.log(option)
                      return (option?.children as unknown as string)
                        ?.toLowerCase()
                        ?.includes(input.toLowerCase())
                    }
                    }
                    // disabled={(type === 'edit')}
                    onChange={selectShares}
                  >
                    {
                      shareList2?.map((item, index) => (
                        <Select.Option key={index} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </div>
              <div className={style['share-list']}>
                {
                  shares.map((item: any, index: number) => (
                    <div className={style.li} key={item.id}>
                      <div className={style.file}>{item.fileName}</div>
                      <div onClick={() => onDeleteShareFile(item)}><DeleteOutlined /></div>
                    </div>
                  ))
                }
              </div>
            </>
          ) :
            (<Form.Item
              label="上传录音"
              name="file"
              rules={[{ required: true, message: '请上传录音', validator: fileValidator }]}
            >
              <Upload {...videoUplodProps} disabled={uploading}>
                <Button icon={<UploadOutlined />} loading={uploading}>点击上传</Button>
              </Upload>
            </Form.Item>
            )
        }
      </Form>
    </Modal >
  );
}