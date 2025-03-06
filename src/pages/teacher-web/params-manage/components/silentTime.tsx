import { useEffect, useState } from 'react';
import { Row, Col, Form, InputNumber, Button, message, Input } from 'antd';
import { useIntentionModel } from './../model';
import styles from './../index.less';

import config from '@/config';
import { handleKeyPress } from '@/utils';
const successCode = config.successCode;

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

export default () => {
  const [form] = Form.useForm();

  const { loading, getSettingConfg, getConfigSave } = useIntentionModel();

  useEffect(() => {
    getDialogConfig();
  }, []);

  const getDialogConfig = async () => {
    let res = await getSettingConfg({});
    form.setFieldsValue({
      ...res?.data,
    });
  };

  const save = async () => {
    let formVal = await form.validateFields();
    let params = {
      ...formVal,
    };
    let res = await getConfigSave(params);
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
        <Col style={{ paddingBottom: '60px', }}>大模型剧情课程，学员沉默触发扣分时间，单位为秒</Col>
        <Col span={24}>
          {/* <span className={styles.commonTips}>大模型剧情课程，学员沉默触发扣分时间，单位为秒</span> */}
        </Col>
        <Col span={24}>
          <span style={{ display: 'inline-block', paddingTop: '5px' }}>
            沉默时间:
          </span>
          <Form.Item
            style={{ display: 'inline-block', padding: '0 5px' }}
            name="silentTime"
          >
            <Input
              onKeyPress={handleKeyPress}
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
