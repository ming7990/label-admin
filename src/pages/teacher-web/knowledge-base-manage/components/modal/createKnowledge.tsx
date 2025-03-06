import Condition from '@/components/Condition';
import config from '@/config/index';
import { KnowledgeType, KnowledgeTypeList, authConfigList } from '@/type/knowledge';
import { Button, Modal, Input, Radio, Switch, Upload, Cascader, Form, message, Select } from 'antd';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import PreviewModal from './previewModal';
import { useUploadModel } from '../../model/upload';
import style from './style.less';
import { useAddOrEditModel } from '../../../../teacher-web/video-list/model';
const { successCode } = config;
const docExts = ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ppt', '.pptx', '.txt'];

const baseUrl: string = config.basePath;
const ModelComponent: React.FC<any> = (props: any) => {
  const { ftype, row, reload, getKnowledgeDetail, knowledgeInsert, knowledgeUpdate, knowledgeDirectory, fileDelete, getKnowledgeId, getKnowledgeFiles, status, getPreviewUrl, postVideoMessage } = props;
  const [visible, setVisible] = useState<boolean>(!false);
  const [formType, setFormType] = useState<string>(ftype);
  const [id, setId] = useState<string>('');
  const [knowledgeId, setKid] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [extrData, setExtrData] = useState({});
  const [hasType, setHasType] = useState<boolean>(false);
  const [deleteList, setDeleteList] = useState<any>([]);
  const [cancelList, setCancalList] = useState<any>([]);
  const previewCref = useRef();
  const [uploading, setUploading] = useState<boolean>(false);

  const { getFileMd5 } = useUploadModel();

  const { getClassAll, shareList, shareList2, getFileRecordAll, shares, getShareVideoList } = useAddOrEditModel();

  const [form] = Form.useForm();
  const type = Form.useWatch('knowledgeType', form);
  const videoOrigin = Form.useWatch('videoOrigin', form);
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] =>
    list.map(node => {
      if (node.value === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const isCreate = formType === 'add'; // 是否新建;
  // 目录文件;
  const getFirstDr = (() => {
    knowledgeDirectory({ parentId: '' }).then((res: any) => {
      const arr = res?.data || [];
      const list: any = [];
      arr.forEach((item: any, i: number) => {
        list.push({
          label: item.className,
          value: item.id,
          isLeaf: !item.isDirectory
        });
      });
      setOptions(list);
    })
  });
  // 目录回显;
  const utilsFn = (arr2: any) => {
    const idArr = arr2.slice(0, arr2.length - 1);
    idArr.unshift('');
    let _options = [...options];
    const fn = () => {
      const parentId: any = idArr.shift();
      knowledgeDirectory({ parentId }).then((res: any) => {
        const arr = res?.data || [];
        const list: any = [];
        arr.forEach((item: any, i: number) => {
          list.push({
            label: item.className,
            value: item.id,
            isLeaf: !item.isDirectory
          });
        });
        if (parentId) {
          _options = updateTreeData(_options, parentId, list);
        } else {
          _options = list;
          setOptions(list);
        }
        if (idArr.length) {
          fn();
        } else {
          setOptions(_options);
          console.log(_options, 'ppp');
        }
      });
    }
    fn();
  }
  const onRadioChange = (v: KnowledgeType) => {
    const list: any = [];
    fileList.forEach((item: any) => {
      list.push(item.fileNumber);
    });
    if (list.length) {
      fileDelete({ fileNumberList: list, knowledgeId });
    }
    setFileList([]);
  };

  const loadData = (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    knowledgeDirectory({ parentId: targetOption.value }).then((res: any) => {
      const arr = res?.data || [];
      const list: any = [];
      arr.forEach((item: any, i: number) => {
        if (item.isDirectory) {
          list.push({
            label: item.className,
            value: item.id,
            isLeaf: !item.isDirectory
          });
        }
      });
      targetOption.children = list;
      setOptions([...options]);
    });
  };

  const open = async (type: string, row: any) => {
    setFormType(type);
    if (type == 'edit') {
      await getKnowledgeDetail({ id: row?.id, tab: 0 }).then((res: any) => {
        setId(row?.id);
        const { id, knowledgeType, knowledgeName, knowledge, allowComment, viewAccess, directory = [] } = res?.data || {};
        setHasType(knowledgeType != undefined);
        const classId: string[] = []; // 目录id;
        directory.forEach((item: any) => {
          classId.push(item.classId);
        });
        form.setFieldsValue({
          knowledgeType, knowledgeName, knowledge, allowComment, classId, viewAccess,
          sharefileA: [],
          sharefileB: [],
          videoOrigin: 0,
        });
        if (classId.length <= 1) {
          getFirstDr();
        } else {
          utilsFn([...classId]);
        }
        setKid(id); // 生成knowledgeId
        // 获取上传文件;
        getKnowledgeFiles({ id }).then((res: any) => {
          const list = res?.data || [];
          const files: any = [];
          list.forEach(item => {
            files.push({
              uid: item.id,
              name: item.fileName,
              fileNumber: item.fileNumber,
              status: 'done',
              response: { resultCode: successCode },
              url: item.url,
              // url: (knowledgeType === KnowledgeType.Video && item.urlList) ? item.urlList[0] : item.url
            });
          });
          setFileList(files);
          form.setFieldsValue({ file: files });
        });
      });
    } else {
      form.resetFields();
      getFirstDr();
      const res = await getKnowledgeId();
      console.log(res?.data?.id, 'res?.data?.id');
      setKid(res?.data?.id); // 生成knowledgeId
    }
    setDeleteList([]);
    setCancalList([]);
    setVisible(true);

    getClassAll();
    getFileRecordAll({});
  }

  const selectShareList = (list: any[]) => {
    console.log(list, 'selectShareList');
    getFileRecordAll({ classIdList: list });
  };
  const selectShares = (list: any) => {
    getShareVideoList(list);
  };

  useEffect(() => {
    open(ftype, row);
  }, []);
  const onCancel = (isMa?: boolean) => {
    // form.resetFields();
    // setDeleteList([]);
    // 取消时 删除编辑期间上传的文件;
    if (formType === 'edit' && isMa && cancelList.length) {
      fileDelete({ idList: cancelList, knowledgeId }).then(res => {
        setCancalList([]);
      });
    }
    setVisible(false);
  }

  const getFormData = () => {
    const { knowledgeType, knowledgeName, knowledge, allowComment, classId, viewAccess } = form.getFieldsValue();
    let cid = '';
    if (classId) {
      cid = classId.length ? classId[classId.length - 1] : '';
    }
    return { knowledgeId, knowledgeType, knowledgeName, knowledge, allowComment, viewAccess, classId: cid };
  };
  const onSave = async () => {
    const data: any = { ...getFormData(), status: 2 };
    if (data.knowledgeType == undefined) {
      return message.warn('请选择类型');
    }
    if (!data.knowledgeName) {
      return message.warn('请输入名称');
    }

    const extParams: any = {};
    if (type === KnowledgeType.Video && videoOrigin == '1' && shares.length) {
      extParams.shareFileList = shares.map((item: any) => item.id);
    }
    data.shareFileList = extParams.shareFileList;
    const res = await knowledgeInsert(data);
    if (res) {
      deleFiles();
      onCancel();
      reload();
    }
  }
  const onSubmit = async () => {
    let valid = await form.validateFields();
    if (valid) {
      const params: any = { ...getFormData() };
      const extParams: any = {};
      if (type === KnowledgeType.Video && videoOrigin == '1') {
        if (!shares.length) {
          return message.warn('请选择共享文件');
        }
        extParams.shareFileList = shares.map((item: any) => item.id);
      }
      params.shareFileList = extParams.shareFileList;
      if (formType == 'add') {
        const res = await knowledgeInsert({ ...params, status: 0 });
        if (res) {
          deleFiles();
          onCancel();
          reload();
        }
      } else {
        const res = await knowledgeUpdate({ id, ...params, status });
        if (res) {
          deleFiles();
          onCancel();
          reload();
        }
      }
    }
  }
  const deleFiles = () => {
    if (deleteList.length) {
      fileDelete({ idList: deleteList, knowledgeId }).then(res => {
        setDeleteList([]);
      });
    }
  }
  // useImperativeHandle(cref, () => ({
  //   open,
  // }));

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const beforeUpload = (file: File) => {
    console.log(fileList, 'fileList');
    let i = fileList.length;
    const fns = [];
    for (let j = 0; j < i; j++) {
      if (fileList[j].fileNumber == 'number') {
        fns.push(fileList[j].fileNumber);
      }
    }
    if (fns.length) i = Math.max(...fns);
    setExtrData({
      fileNumber: i++,
      knowledgeId: knowledgeId,
      knowledgeType: type
    })
  }

  const handleChange = ({ file, fileList = [] }: any) => {
    console.log(file, 'infor');
    if (file.status === 'done') {
      // file.response.data.fileNumber = extrData.fileNumber;
      if (file.response.resultCode == successCode) {
        console.log(file.response);
        // const list = fileList.map((file: any) => ({
        //   status: file.status,
        //   uid: file.uid,
        //   fileNumber: file.fileNumber == undefined ? extrData.fileNumber : file.fileNumber,
        //   url: file.response?.resultCode ? file.response?.data?.url : file.url,
        // }));
        fileList.forEach(item => {
          item.fileNumber = item.fileNumber == undefined ? extrData.fileNumber : item.fileNumber;
        });
        // setFileList(list);
        // console.log(list, extrData);
        const list = [...cancelList];
        list.push(file.fileId);
        setCancalList(list);
        message.success(`上传成功`);
      } else {
        message.error(`上传失败`);
      }
    } else if (file.status === 'error') {
      message.error(`上传失败`);
    }
    fileList = fileList.filter(item => item.status || (item.status && item.status != 'error'));
    setFileList([...fileList]);
  };
  const onRemove = (file: any) => {
    console.log(file);
    return new Promise(r => {
      if (file.status === 'done') {
        const uid = file.uid;
        const list = [...deleteList];
        uid != undefined && list.push(uid);
        setDeleteList(list); // 缓存待删除的id;
        const { files = [] } = form.getFieldsValue();
        const index = files.findIndex(item => item.uid == file.uid);
        files.splice(index, 1);
        form.setFieldsValue({ file: files });
        r(true);
        // fileDelete({ knowledgeId, fileNumber }).then(res => {
        //   if (res) {
        //     const { files = [] } = form.getFieldsValue();
        //     const index = files.findIndex(item => item.fileNumber == file.fileNumber);
        //     files.splice(index, 1);
        //     form.setFieldsValue({ file: files });
        //   }
        //   r(res);
        // });
      } else {
        r(true);
      }
    });
  };

  const uploadProps = {
    action: `${baseUrl}/services/knowledge/file/upload`,
    onRemove,
    data: extrData,
    beforeUpload: (file: File) => {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (type === KnowledgeType.Audio && !isLt50M) {
        message.error('文件大小需小于50MB!');
        return false;
      }
      beforeUpload(file);
    },
    fileList,
    onChange: handleChange,
    onPreview: (file: any) => {
      console.log(file, 'onPreview={handlePreview}');
      if (type == KnowledgeType.Audio) {
        const url = getPreviewUrl({ fileNumber: file.fileNumber, knowledgeId });
        window.open(url, '_blank');
      }
    }
  }
  const videoUplodProps = Object.assign({}, uploadProps, {
    // accept: ['.avi', '.mp4', '.flv', '.mkv', '.m4v', '.mov'],
    data: extrData,
    action: `${baseUrl}/services/knowledge/videoFile/upload`,
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

        setUploading(true);
        const res = await postVideoMessage({ fileNumber, knowledgeId, fileName: file.name, size: file.size })
        setUploading(false);
        setExtrData({
          // fileNumber,
          videoId: res?.data.fileId,
          // videoMD5: md5,
          knowledgeId: knowledgeId,
          knowledgeType: type
        });
        if (res) {
          return r(true);
        } else {
          return j(false);
        }
      });
    },
  });

  const upLabel = {
    [KnowledgeType.Audio]: '上传音频',
    [KnowledgeType.Doc]: '上传文档',
  }[type];
  const handlePreview = async (file: any) => {
    console.log(file, 'f')
    previewCref?.current?.open(getPreviewUrl({ fileNumber: file.fileNumber, knowledgeId }));
  };


  const fileValidator = (rule, value, callback) => {
    console.log(value);
    if (value && (value.length || value?.fileList?.length)) return Promise.resolve(true);
    return Promise.reject(new Error('请上传文件'));
  }
  const onDeleteShareFile = (item: any) => {
    const shareIds: any[] = [];
    shares.forEach((o: any) => {
      if (item.shareId != o.shareId) shareIds.push(o.shareId);
    });
    form.setFieldsValue({ sharefileB: shareIds });
    selectShares(shareIds);
  }
  return (
    <Modal
      width={600}
      bodyStyle={{ maxHeight: '500px', overflow: 'auto' }}
      title={isCreate ? '新建知识' : '编辑知识'}
      visible={visible}
      onCancel={() => onCancel(true)}
      footer={[
        <Button key="back" onClick={onCancel}>取 消</Button>,
        isCreate ? <Button key="submit" onClick={onSave}>存放草稿箱</Button> : null,
        <Button
          key="save"
          type="primary"
          // loading={loading}
          onClick={onSubmit}
        >保 存</Button>,
      ]}
    >
      <Form form={form} layout="horizontal" {...formItemLayout}>
        <Form.Item
          name="knowledgeType"
          label="类型"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Radio.Group disabled={(formType === 'edit' && hasType)} onChange={onRadioChange}>
            {
              KnowledgeTypeList.map(item => (
                <Radio key={item.value} value={item.value}>{item.label}</Radio>
              ))
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="knowledgeName"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder='请输入名称' showCount maxLength={100}></Input>
        </Form.Item>
        <Form.Item
          name="knowledge"
          label="主题内容"
        >
          <Input.TextArea placeholder='请输入主题内容' rows={5} showCount maxLength={1000}></Input.TextArea>
        </Form.Item>
        {
          [KnowledgeType.Pic].includes(type) ?
            <Form.Item
              label="上传图片"
              name={'file'}
              rules={[{ required: true, message: '请上传图片', validator: fileValidator }]}
            >
              <Upload
                action={`${baseUrl}/services/knowledge/file/upload`}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/*"
                data={extrData}
                beforeUpload={beforeUpload}
                onRemove={onRemove}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              </Upload>
            </Form.Item> : null
        }
        {
          [KnowledgeType.Audio, KnowledgeType.Doc].includes(type) &&
          <Form.Item
            label={upLabel}
            name={'file'}
            rules={[{ required: true, message: '请' + upLabel, validator: fileValidator }]}
          >
            <Upload {...uploadProps} accept={type === KnowledgeType.Audio ? ".mp3,.wav" : docExts}>
              <Button icon={<UploadOutlined />}>点击上传{KnowledgeType.Audio === type}</Button>
              {
                type === KnowledgeType.Audio ? <div className="tips" style={{ color: '#00000073' }}>大小不超过50MB</div> : null
              }
            </Upload>
          </Form.Item>
        }
        {
          [KnowledgeType.Video].includes(type) && <>
            {/*  */}
            <Form.Item
              name="videoOrigin"
              label="视频来源"
              initialValue={0}
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                placeholder="请选择"
              // disabled={(type === 'edit')}
              >
                <Select.Option key={0} value={0}>
                  本地视频
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
                  label={'上传视频'}
                  name={'file'}
                  rules={[{ required: true, message: '请上传视频', validator: fileValidator }]}
                >
                  <Upload {...videoUplodProps} disabled={uploading}>
                    <Button icon={<UploadOutlined />} loading={uploading}>点击上传</Button>
                  </Upload>
                </Form.Item>
                )
            }
            {/*  */}
          </>
        }
        <Form.Item
          name="allowComment"
          label="允许互相评论"
          initialValue={0}
          rules={[{ required: true, message: '请选择' }]}
        >
          <Radio.Group disabled={false}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="classId"
          label="知识保存目录"
          rules={[{ required: true, message: '请选择知识保存目录' }]}
        >
          <Cascader
            placeholder="请选择知识保存目录"
            options={options} loadData={loadData}
            changeOnSelect
          // displayRender={(label) => label[label.length - 1]}
          />
        </Form.Item>
        <Form.Item
          name="viewAccess"
          label="权限配置"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select optionFilterProp="children" showSearch allowClear placeholder="请选择">
            {authConfigList?.map((item: any) => {
              return (
                <Select.Option key={item?.value} value={item?.value}>
                  {item?.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
      <PreviewModal cref={previewCref} />
    </Modal >
  )
}

export default ModelComponent;
