import { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, InputNumber, Button, message, Checkbox } from 'antd';
import { useRuleManageModel } from './../model';
import TagsCom from './tagsCom';
import styles from './../index.less';

import config from '@/config';
const successCode = config.successCode;

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

export default () => {
  const [form] = Form.useForm();

  const toneWordsRef = useRef<any>({});

  const { loading, ruleConfig, ruleSave } = useRuleManageModel();

  useEffect(() => {
    getRuleConfig();
  }, []);

  const getRuleConfig = async () => {
    let res = await ruleConfig({});
    let wordage = res?.data?.wordage?.split(',');
    let wordageFir = wordage?.[0];
    let wordageTwo = wordage?.[1];
    let toneWords = res?.data?.toneWords?.split(',');
    form.setFieldsValue({
      ...res?.data,
      wordageFir,
      wordageTwo,
      toneWords,
      speechSwitch: Number(res?.data?.speechSwitch),
      toneSwitch: Number(res?.data?.toneSwitch),
      emotionalSwitch: Number(res?.data?.emotionalSwitch),
      sensation: Number(res?.data?.sensation),
    });
    toneWordsRef?.current?.setTags(toneWords);
  };

  const save = async () => {
    let formVal = await form.validateFields();
    let wordage = `${formVal?.wordageFir},${formVal?.wordageTwo}`;
    let toneWords = toneWordsRef?.current?.tags?.join(',');
    let params = {
      ...formVal,
      wordage,
      toneWords,
      speechSwitch: formVal?.speechSwitch ? '1' : '0',
      toneSwitch: formVal?.toneSwitch ? '1' : '0',
      emotionalSwitch: formVal?.emotionalSwitch ? '1' : '0',
      sensation: formVal?.sensation ? '1' : '0',
    };
    delete params?.wordageFir;
    delete params?.wordageTwo;
    delete formVal?.speechSwitch;
    delete formVal?.toneSwitch;
    delete formVal?.emotionalSwitch;
    delete formVal?.sensation;
    let res = await ruleSave(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      getRuleConfig();
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  return (
    <Form form={form} {...layout}>
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item name="speechSwitch" valuePropName="checked" initialValue={1}>
            <Checkbox>语速检测</Checkbox>
          </Form.Item>
        </Col>
        <Col span={24}>
          <span className={styles.commonTips}>
            检测学员每分钟回复字数，超过或者低于预设值，则代表语速过快或过慢
          </span>
        </Col>
        <Col span={24}>
          <Form.Item style={{ marginBottom: 0 }}>
            <span style={{ display: 'inline-block', paddingLeft: '30px' }}>语气词检测:</span>
            <Form.Item style={{ display: 'inline-block', padding: '0 5px' }} name="wordageFir">
              <InputNumber precision={0} min={0} step={1} />
            </Form.Item>
            <span
              style={{
                display: 'inline-block',
                width: 'auto',
                lineHeight: '32px',
                textAlign: 'left',
              }}
            >
              字/每分钟
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '24px',
                lineHeight: '32px',
                textAlign: 'center',
              }}
            >
              ~
            </span>
            <Form.Item style={{ display: 'inline-block', padding: '0 5px' }} name="wordageTwo">
              <InputNumber precision={0} min={0} step={1} />
            </Form.Item>
            <span
              style={{
                display: 'inline-block',
                width: 'auto',
                lineHeight: '32px',
                textAlign: 'left',
              }}
            >
              字/每分钟
            </span>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="toneSwitch" valuePropName="checked" initialValue={1}>
            <Checkbox>语气词检测</Checkbox>
          </Form.Item>
        </Col>
        <Col span={24}>
          <span className={styles.commonTips}>
            检测学员整通通话是否使用语气词过多，根据触发单个关键词累加，累加超过预设重复次数则扣分并重新计算次数
          </span>
        </Col>
        <Col span={24}>
          <div className={styles.slotBox}>
            <div className={styles.slotTxt}>语气词：</div>
            <div className={styles.slotList}>
              <TagsCom cref={toneWordsRef} addBtnText="新增语气词" />
            </div>
          </div>
        </Col>
        <Col span={24}>
          <span style={{ display: 'inline-block', paddingTop: '5px', paddingLeft: '30px' }}>
            重复次数:
          </span>
          <Form.Item style={{ display: 'inline-block', padding: '0 5px' }} name="repeatTime">
            <InputNumber precision={0} min={0} step={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item name="emotionalSwitch" valuePropName="checked" initialValue={0}>
            <Checkbox disabled>情绪检测</Checkbox>
          </Form.Item>
        </Col>
        <Col span={24}>
          <span className={styles.commonTips}>检测学员情绪，如命中则代表情绪异常</span>
        </Col>
        <Col span={24}>
          <span className={styles.exceteBox}>
            <Form.Item name="sensation" valuePropName="checked" initialValue={0}>
              <Checkbox disabled>激动</Checkbox>
            </Form.Item>
          </span>
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
