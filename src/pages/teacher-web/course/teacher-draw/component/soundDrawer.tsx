import config from '@/config';
import { useDrawModel } from '@/pages/teacher-web/course/model';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Slider,
  Space,
} from 'antd';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import styles from './style.less';
import { useSoundConfigModel } from '@/pages/teacher-web/params-manage/model';

const SoundDrawer: React.FC<any> = (props: any) => {
  const { cref, isEdit, onSaveSound } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<any>(false);
  const { courseSoundConfig, courseSoundConfigSave, getallVoiceNames, soundList, courseEditTimbre } = useDrawModel();
  const { timbreListApi } = useSoundConfigModel();
  const [info, setInfo] = useState<any>({});
  const [timbreList, setTimbreList] = useState<any>([]);
  const audio = useRef<any>(null);



  const { courseInfo } = useModel('course', (model: any) => ({
    courseInfo: model.courseInfo,
  }));

  const onCancel = () => {
    form.resetFields();
    audio?.current?.pause();
    setVisible(false);
  };

  const onOk = async () => {
    let valid = await form.validateFields();
    if (valid) {
      if (courseInfo && courseInfo.courseType === 0 || courseInfo.courseType === 1) {
        await courseEditTimbre({ ...valid, id: history?.location?.query?.id }).then((res) => {
          if (res) {
            onCancel();
            onSaveSound()
          }
        });
      } else {
        await courseSoundConfigSave({ ...info, ...valid }).then((res) => {
          if (res) {
            onCancel();
          }
        });
      }
    }
  };

  const getTimbreListApi = async () => {
    const res = await timbreListApi({});
    setTimbreList(res?.data?.list || [])
  };

  const open = async (type: any, row?: any) => {
    await getTimbreListApi()
    await getallVoiceNames({});
    // setFormType(type);
    await courseSoundConfig({ courseId: row?.id || courseInfo?.id }).then((res) => {
      if (res) {
        form.setFieldsValue(res?.data);
        setInfo(res?.data);
        setVisible(true);
      }
    });
    if (courseInfo && courseInfo.timbreId) form.setFieldsValue(courseInfo.timbreId);
  };

  const listenNonVar = async () => {
    let valid = await form.validateFields();
    if (valid) {
      let reqData = {
        ...valid,
        courseId: courseInfo?.id,
      };
      if (audio?.current) {
        audio?.current?.pause?.();
      }
      audio.current = new Audio();
      // audio.current.src = `/robot-train/mp3/story.mp3`
      audio.current.src = `${config?.basePath}/services/course/soundParse?${objectToUrlParams(
        reqData,
      )}`;
      audio?.current?.play?.();
      audio.current.onerror = (e: any) => {
        console.log(e);
        message.warning('获取音频错误');
      };
    }
  };

  function objectToUrlParams(obj: any) {
    let params = '';
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        params += `${encodeURIComponent(key)}=${encodeURIComponent(obj?.[key] ?? '')}&`;
      }
    }
    return params.slice(0, -1);
  }

  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Drawer
      title={'音色设置'}
      placement="right"
      onClose={onCancel}
      visible={visible}
      footer={
        <Space align="baseline" style={{ float: 'right' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onOk} disabled={isEdit}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {
          courseInfo && courseInfo.courseType === 0 || courseInfo.courseType === 1 ? (<Form.Item
            name="timbreId"
            label="音色名称"
            rules={[{ required: true, message: '请选择音色' }]}
          >
            <Select placeholder={'请选择音色'}>
              {timbreList?.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>) :
            (
              <>
                <Form.Item
                  name="soundName"
                  label="音色选择"
                  rules={[{ required: true, message: '请选择音色' }]}
                >
                  <Select placeholder={'请选择音色'}>
                    {soundList?.map((item: any) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      <span className={styles['formRedStar']}>*</span>
                      {'音量'}
                    </span>
                  }
                >
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name="soundVolume"
                        rules={[{ required: true, message: '请拖动选择音量' }]}
                        noStyle
                        initialValue={5}
                      >
                        <Slider min={0} max={100} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="soundVolume"
                        rules={[{ required: true, message: '请输入音量' }]}
                        noStyle
                      >
                        <InputNumber
                          controls={false}
                          precision={0}
                          min={0}
                          max={100}
                          style={{ margin: '0 16px' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      <span className={styles['formRedStar']}>*</span>
                      {'音速'}
                    </span>
                  }
                >
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name="soundSpeed"
                        rules={[{ required: true, message: '请拖动选择音速' }]}
                        noStyle
                        initialValue={5}
                      >
                        <Slider min={-500} max={500} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="soundSpeed"
                        rules={[{ required: true, message: '请输入音速' }]}
                        noStyle
                      >
                        <InputNumber
                          controls={false}
                          precision={0}
                          min={-500}
                          max={500}
                          style={{ margin: '0 16px' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      <span className={styles['formRedStar']}>*</span>
                      {'音调'}
                    </span>
                  }
                >
                  <Row>
                    <Col span={16}>
                      <Form.Item
                        name="soundTone"
                        rules={[{ required: true, message: '请拖动选择音调' }]}
                        noStyle
                        initialValue={5}
                      >
                        <Slider min={-500} max={500} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="soundTone"
                        rules={[{ required: true, message: '请输入音调' }]}
                        noStyle
                      >
                        <InputNumber
                          controls={false}
                          precision={0}
                          min={-500}
                          max={500}
                          style={{ margin: '0 16px' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item label="试听">
                  <Row>
                    <Col span={21}>
                      <Form.Item name="text" noStyle>
                        <Input maxLength={150} placeholder="请输入文本后点击试听按钮"></Input>
                      </Form.Item>{' '}
                    </Col>
                    <Col span={3}>
                      <Button type="link" onClick={listenNonVar}>
                        试听
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </>
            )
        }
      </Form>
    </Drawer>
  );
};

export default SoundDrawer;
