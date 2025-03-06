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
import { useModel } from 'umi';
import styles from './style.less';

const SoundDrawer: React.FC<any> = (props: any) => {
    const { cref, isEdit, comfirmSubmit } = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<any>(false);
    const [rows, setRows] = useState<any>({});
    const { courseSoundConfig, courseSoundConfigSave, getallVoiceNames, soundList } = useDrawModel();
    const [info, setInfo] = useState<any>({});
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
            try {
                // 构建保存数据  
                const saveData = {
                    ...valid,
                    id: rows?.id,
                };

                // 直接调用父组件的 comfirmSubmit 方法  
                await comfirmSubmit(saveData);

                // 保存成功后的操作  
                onCancel()
            } catch (error) {
                console.error('保存失败:', error);
                message.error('保存失败，请重试');
            }
        }
    };

    const open = async (type: any, row?: any) => {
        setRows(row);
        await getallVoiceNames({});
        form.setFieldsValue(row);
        setVisible(true);
        // await courseSoundConfig({ courseId: row?.id || courseInfo?.id }).then((res) => {
        //     if (res) {
        //         form.setFieldsValue(res?.data);
        //         setInfo(res?.data);
        //         setVisible(true);
        //     }
        // });
    };

    const listenNonVar = async () => {
        let valid = await form.validateFields();
        if (valid) {
            let reqData = {
                ...valid,
                courseId: courseInfo?.id,
                soundName: valid.name,
                soundVolume: valid.volume,
                soundTone: valid.tone,
                soundSpeed: valid.speed,
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
                <Form.Item
                    name="name"
                    label="音色名称"
                    rules={[{ required: true, message: '请输入音色名称' }]}
                >
                    <Input placeholder={'请输入音色名称'} />
                </Form.Item>

                <Form.Item
                    name="sex"
                    label="音色性别"
                    rules={[{ required: true, message: '请选择音色' }]}
                >
                    <Select placeholder={'请选择音色'}>
                        {[{ label: '男', value: 0 }, { label: '女', value: 1 }].map((item: any) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="type"
                    label="音色分类"
                    rules={[{ required: true, message: '请选择音色' }]}
                >
                    <Select placeholder={'请选择音色'}>
                        {[{ label: '严厉', value: 0 }, { label: '温柔', value: 1 }].map((item: any) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="timbre"
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
                                name="volume"
                                rules={[{ required: true, message: '请拖动选择音量' }]}
                                noStyle
                                initialValue={5}
                            >
                                <Slider min={0} max={100} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="volume"
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
                                name="speed"
                                rules={[{ required: true, message: '请拖动选择音速' }]}
                                noStyle
                                initialValue={1}
                                step={0.1}
                            >
                                <Slider min={-500} max={500} step={0.1} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="speed"
                                rules={[{ required: true, message: '请输入音速' }]}
                                noStyle
                            >
                                <InputNumber
                                    controls={false}
                                    min={-500}
                                    max={500}
                                    step={0.1}
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
                                name="tone"
                                rules={[{ required: true, message: '请拖动选择音调' }]}
                                noStyle
                                initialValue={5}
                            >
                                <Slider min={-500} max={500} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="tone"
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
            </Form>
        </Drawer>
    );
};

export default SoundDrawer;
