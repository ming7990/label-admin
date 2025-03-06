import { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Form, Input, Select, Button, message, Checkbox, Space } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './../index.less';

import { useIntentionModel } from './../model';

export default (props: any) => {
  const { cref, loading, comfirmSubmit } = props;

  const [form] = Form.useForm();

  const { intentDetail } = useIntentionModel();

  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [pageType, setPageTyp] = useState<any>('');

  useImperativeHandle(cref, () => ({
    open: (record: any, type: any) => {
      setVisible(true);
      setRowData(record);
      setPageTyp(type);
      if (type == 'add') {
        form.setFieldsValue({
          intentName: '',
          intentText: '',
          intentTextList: [{ intentText: '' }],
        });
        setRowData({});
      } else if (type == 'edit') {
        getIntentDetail(record?.id);
      }
    },
    close: onClose,
  }));

  const onClose = () => {
    setVisible(false);
  };

  const getIntentDetail = async (id: any) => {
    let res = await intentDetail({ id });
    let data = res?.data;
    form.setFieldsValue({ intentName: data?.intentName, intentTextList: data?.intentTextList });
  };

  const save = async () => {
    let formVal = await form.validateFields();
    comfirmSubmit(formVal, rowData, pageType);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  return (
    <Modal
      title={pageType == 'add' ? '新建意图' : pageType == 'edit' ? '编辑意图' : ''}
      width={572}
      centered
      onCancel={onClose}
      visible={visible}
      footer={
        <Space>
          <Button type="primary" onClick={save} loading={loading}>
            确定
          </Button>
          <Button onClick={onClose} loading={loading}>
            取消
          </Button>
        </Space>
      }
      destroyOnClose
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="意图名称"
          name="intentName"
          rules={[{ required: true, message: '请输入意图名称' }]}
        >
          <Input maxLength={30} showCount />
        </Form.Item>
        <Form.List name={'intentTextList'}>
          {(fields, { add, remove }) => {
            return (
              <Fragment>
                <div>
                  {fields?.map?.(({ key, name, ...restField }, index) => (
                    <div key={index} className={index == 0 ? '' : styles.formListBox}>
                      <Form.Item
                        label={'触发话术'}
                        name={[name, 'intentText']}
                        rules={[{ required: index == 0 ? true : false, message: '请输入触发话术' }]}
                        // style={{ position: 'relative' }}
                      >
                        <Input />
                      </Form.Item>
                      {index !== 0 && (
                        <DeleteOutlined
                          onClick={() => remove(index)}
                          style={{
                            color: 'rgba(0,0,0,0.45)',
                            position: 'absolute',
                            top: '6px',
                            right: '15px',
                            fontSize: '20px',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className={styles.formListBox}>
                  <Form.Item label={'触发按钮'}>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add(
                          // {
                          //   intenText: ''
                          // },
                          fields.length,
                        )
                      }
                      style={{
                        color: 'rgba(0,0,0,0.45)',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      <Space>
                        <PlusCircleOutlined />
                        <span>添加触发话术</span>
                      </Space>
                    </Button>
                  </Form.Item>
                </div>
              </Fragment>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};
