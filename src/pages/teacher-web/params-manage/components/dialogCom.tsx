import { useEffect, useState } from 'react';
import { Row, Col, Form, InputNumber, Button, message } from 'antd';
import { useRuleManageModel } from './../model';
import styles from './../index.less';

import config from '@/config';
const successCode = config.successCode;

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

export default () => {
  const [form] = Form.useForm();

  const { loading, dialogConfig, dialogSave } = useRuleManageModel();

  useEffect(() => {
    getDialogConfig();
  }, []);

  const getDialogConfig = async () => {
    let res = await dialogConfig({});
    form.setFieldsValue({
      ...res?.data,
    });
  };

  const save = async () => {
    let formVal = await form.validateFields();
    let params = {
      ...formVal,
    };
    let res = await dialogSave(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      getDialogConfig();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  return (
    <Form form={form} {...layout}>
      <Row gutter={12}>
        <Col>话术相似度合格设置</Col>
        <Col span={24}>
          <span className={styles.commonTips}>设置课程常规模式中，学员话术通过标准话术的标准</span>
        </Col>
        <Col span={24}>
          <span style={{ display: 'inline-block', paddingTop: '5px', paddingLeft: '30px' }}>
            相似度:
          </span>
          <Form.Item
            style={{ display: 'inline-block', padding: '0 5px' }}
            initialValue={'90'}
            name="similarNum"
          >
            <InputNumber
              step={1}
              precision={0}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginBottom: '24px' }}>
        <Button type={'primary'} onClick={save} loading={loading}>
          保存
        </Button>
      </Row>
    </Form>
  );
};
