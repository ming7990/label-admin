import Condition from '@/components/Condition';
import { useDrawModel } from '@/pages/teacher-web/course/model';
import { handleKeyPress, validateSpaces } from '@/utils';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Form, Input, InputNumber, Space, Select } from 'antd';
import { useImperativeHandle, useState, useEffect } from 'react';
import { useIntentionModel } from '@/pages/teacher-web/params-manage/model';
import { history, useModel } from 'umi';
import styles from './style.less';

const PlotDrawer: React.FC<any> = (props: any) => {
  const { cref, changeNodeName, isEdit } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<any>(false);
  const { courseNodeInfo, courseNodeSave } = useDrawModel();
  const [info, setInfo] = useState<any>({});
  const [nodeDetailInfo, setNodeDetailInfo] = useState<any>({});
  const [studentIntentList, setStudentIntentList] = useState<any>([]);
  const [customerIntentList, setCustomerIntentList] = useState<any>([]);

  const { courseInfo } = useModel('course', (model: any) => ({
    courseInfo: model.courseInfo,
  }));
  const { intentListRequest } = useIntentionModel();

  const getIntentList = async (intentType: Number) => {
    if (intentType === 1) {
      let res = await intentListRequest({ modelId: courseInfo.modelId, intentType: 1 });
      setStudentIntentList(res?.data);
    } else {
      let res = await intentListRequest({ modelId: courseInfo.modelId, intentType: 2 });
      setCustomerIntentList(res?.data);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onOk = async () => {
    let valid = await form.validateFields();
    if (valid) {
      let reqData: any = {
        ...info,
        ...valid,
        nodeIntentAction: valid.intents?.map((intent: string) => {
          return { intent };
        }),
        nodeName: valid?.name,
        nodeType: nodeDetailInfo?.nodeType,
      };
      delete reqData.intents;
      await courseNodeSave(reqData).then((res) => {
        if (res) {
          changeNodeName(info.id, valid?.name);
          onCancel();
        }
      });
    }
  };

  const open = async (data: any) => {
    console.log(data);
    setInfo(data);
    setVisible(true);
    await courseNodeInfo({ id: data?.id }).then((res) => {
      if (res) {
        setNodeDetailInfo(res?.data);
        let resData = {
          ...res?.data,
        };
        resData.nodeAction = resData?.nodeAction?.length ? resData?.nodeAction : [{ action: '' }];
        resData.intents = resData?.nodeIntentAction?.length
          ? resData?.nodeIntentAction.map((item: any) => item.intent)
          : [];
        resData.name = resData?.nodeName;
        form.setFieldsValue(resData);
      }
    });
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  useEffect(() => {
    getIntentList(1);
    getIntentList(2);
  }, []);

  const intentListRender = (list: any[]) => {
    return (
      <Form.Item
        name="intents"
        label={'意图'}
        rules={[{ required: true, message: '请选择意图名称' }]}
      >
        <Select
          optionFilterProp="children"
          placeholder="请选择意图名称"
          mode="multiple"
          showSearch
          allowClear
        >
          {list?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.intentName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  };

  return (
    <Drawer
      title={'节点配置'}
      placement="right"
      onClose={onCancel}
      visible={visible}
      footer={
        <Space align="baseline" style={{ float: 'right' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onOk}>
            保存
          </Button>
        </Space>
      }
      className={styles['drawer']}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name={'name'}
          label={'节点名称'}
          rules={[
            { required: true, message: '请输入节点名称' },
            { validator: validateSpaces, trigger: 'change' },
          ]}
        >
          <Input placeholder="请输入节点名称" onKeyPress={handleKeyPress}></Input>
        </Form.Item>
        <Condition r-if={info?.type == 'customerIntent'}>
          {intentListRender(customerIntentList)}
        </Condition>
        <Condition r-if={info?.type == 'finish'}>
          <Form.List name="nodeAction">
            {(fields) =>
              fields.map((field, index) => {
                return (
                  <Form.Item
                    name={[field.name, 'action']}
                    key={field.name + 'action'}
                    label={'结束话术'}
                    rules={[{ required: true, message: '请输入结束话术' }]}
                    initialValue={'恭喜你完成啦！继续努力！！Keep!!'}
                  >
                    <Input.TextArea
                      showCount
                      maxLength={100}
                      placeholder="请输入结束话术"
                      rows={3}
                    ></Input.TextArea>
                  </Form.Item>
                );
              })
            }
          </Form.List>
        </Condition>
        <Condition r-if={info?.type == 'studentIntent'}>
          {intentListRender(studentIntentList)}
          <Form.List name="nodeAction">
            {(fields, { add, remove }) => {
              const addNew = () => {
                let length = fields.length;
                add(
                  {
                    action: '',
                  },
                  length,
                );
              };
              return (
                <div>
                  <div className={styles['nodeFormTitle']}>学员标准话术</div>
                  <div>
                    {fields?.map((field, index) => {
                      return (
                        <div key={index}>
                          <div className={styles['listDelete']}>
                            {fields.length > 1 && (
                              <MinusCircleOutlined
                                style={{ marginRight: '4px', color: '#00000073' }}
                                onClick={() => {
                                  remove(index);
                                }}
                              />
                            )}
                            <div className={styles['num-circle']}>{index + 1}</div>
                            {/* <span className={styles['formRedStar']}>*</span> */}
                            <div>标准话术</div>
                          </div>
                          <Form.Item
                            name={[field.name, 'action']}
                          // rules={[{ required: true, message: '请输入标准话术' }]}
                          >
                            <Input.TextArea
                              showCount
                              maxLength={500}
                              placeholder="请输入标准话术"
                              rows={3}
                            ></Input.TextArea>
                          </Form.Item>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    onClick={addNew}
                    style={{ marginBottom: '24px' }}
                  >
                    添加话术
                  </Button>
                </div>
              );
            }}
          </Form.List>
        </Condition>
      </Form>
    </Drawer>
  );
};

export default PlotDrawer;
