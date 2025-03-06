import { useEffect, useState } from 'react';
import { Row, Col, Form, InputNumber, Button, message, Space } from 'antd';
import { useRuleManageModel } from './../model';
import styles from './../index.less';

import config from '@/config';
const successCode = config.successCode;

const layout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 10 },
};

export default () => {
  const [form] = Form.useForm();

  const { loading, gradeConfig, scoreSave } = useRuleManageModel();

  const [totalRate, setTotalNum] = useState<any>(0);

  useEffect(() => {
    getGradeConfig();
  }, []);

  const getGradeConfig = async () => {
    let res = await gradeConfig({});
    form.setFieldsValue({
      ...res?.data,
    });
    let data = res?.data;
    let actionRate = data?.actionRate ? Number(data?.actionRate) : 0;
    let serviceRate = data?.serviceRate ? Number(data?.serviceRate) : 0;
    let dialogueRate = data?.dialogueRate ? Number(data?.dialogueRate) : 0;
    let totalNum = actionRate + serviceRate + dialogueRate;
    setTotalNum(totalNum);
  };

  const onChange = () => {
    let formVal = form.getFieldsValue(true);
    let actionRate = formVal?.actionRate ? Number(formVal?.actionRate) : 0;
    let serviceRate = formVal?.serviceRate ? Number(formVal?.serviceRate) : 0;
    let dialogueRate = formVal?.dialogueRate ? Number(formVal?.dialogueRate) : 0;
    let totalNum = actionRate + serviceRate + dialogueRate;
    setTotalNum(totalNum);
  };

  const save = async () => {
    let formVal = await form.validateFields();
    let params = {
      ...formVal,
    };
    let res = await scoreSave(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      getGradeConfig();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  return (
    <Form form={form} {...layout} className={styles.commonFormSty}>
      <div style={{ display: 'flex' }}>
        <Col>
          <Form.Item label="话术评分占比" name="actionRate">
            <InputNumber step={10} precision={0} min={0} max={100} onChange={onChange} />
          </Form.Item>
        </Col>
      </div>
      <div style={{ display: 'flex' }}>
        <Col>
          <Form.Item label="服务评分占比" name="serviceRate">
            <InputNumber step={10} precision={0} min={0} max={100} onChange={onChange} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="单次触发扣分占比" name="serviceSingleRate">
            <InputNumber
              step={1}
              precision={0}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
            />
          </Form.Item>
        </Col>
      </div>
      <div style={{ display: 'flex' }}>
        <Col>
          <Form.Item label="对话流畅度评分占比" name="dialogueRate">
            <InputNumber step={10} precision={0} min={0} max={100} onChange={onChange} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="单次触发扣分占比" name="dialogueSingleRate">
            <InputNumber
              step={1}
              precision={0}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
            />
          </Form.Item>
        </Col>
      </div>
      <Row style={{ marginBottom: '24px', marginLeft: '110px' }}>
        <Col>总计: {totalRate}</Col>
        {totalRate > 100 && (
          <Col span={24}>
            <span style={{ color: 'red' }}>总计需等于去100,请修改</span>
          </Col>
        )}
      </Row>
      <Row style={{ marginBottom: '24px', marginLeft: '110px' }}>
        <Col span={6}>
          <Button type="primary" onClick={save} disabled={totalRate > 100} loading={loading}>
            保存
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
