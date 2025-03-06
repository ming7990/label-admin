import Condition from '@/components/Condition';
import config from '@/config';
import { useDrawModel, useTableModel } from '@/pages/teacher-web/course/model';
import { handleKeyPress, validateSpaces } from '@/utils';
import { Button, Drawer, Form, Input, Radio, Select, Space, InputNumber } from 'antd';
import { useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useModel, history, Router } from 'umi';
import { useTaskModel } from '../model';

const FlowDrawer: React.FC<any> = (props: any) => {
  const { cref, changeNodeName } = props;
  const [form] = Form.useForm();
  const courseId = Form.useWatch('courseId', form);
  const [visible, setVisible] = useState<any>(false);
  const [info, setInfo] = useState<any>({});
  const [pageType, setPageType] = useState<any>('');

  const { taskModel, taskType, id } = history?.location?.query || {};
  const taskId = id;
  const [showTimes, setShowTimes] = useState(false); // 是否显示配置次数
  const [isVideo, setIsVideo] = useState(false); // 是否视频课程

  const { allTableList, getAllTablelist } = useTableModel();
  const { taskEdit, formLoading, taskConfigSave, taskConfigFetch } = useTaskModel();

  const { courseInfo } = useModel('course', (model: any) => ({
    courseInfo: model.courseInfo,
  }));

  useEffect(() => {
    let { courseType, minNumberSwitch } = allTableList?.find((item) => item?.id == courseId) || {};
    setIsVideo(courseType == '3');
    console.log(courseType, 'courseType', courseId);
    setShowTimes(!minNumberSwitch && taskType == '2');
  }, [courseId, allTableList]);

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const onOk = async () => {
    let valid: any = await form.validateFields();
    if (valid) {
      let formData: any = form.getFieldsValue();
      if (pageType == 'step') {
        let id = formData?.courseId;
        let name = allTableList?.find((item) => item?.id == id)?.courseName;
        if (showTimes || isVideo) {
          taskConfigSave({ ...valid, courseId: id, taskId }).then(res => {
            if (res) {
              changeNodeName(info.id, { value: name, courseId: id }, pageType);
              onCancel();
            }
          });
        } else {
          changeNodeName(info.id, { value: name, courseId: id }, pageType);
          onCancel();
        }
      } else {
        if (info.type == 'course') {
          await taskEdit({
            id: history?.location?.query?.id,
            taskName: formData?.name,
            editName: true,
          }).then((res) => {
            if (res.resultCode == config.successCode) {
              history.push({
                pathname: '/front/teacher/task/draw',
                query: {
                  ...history?.location?.query,
                  name: formData?.name,
                },
              });
              changeNodeName(info.id, { value: formData?.name }, pageType);
              onCancel();
            }
          });
        } else {
          changeNodeName(info.id, { value: formData?.name }, pageType);
          onCancel();
        }
      }
    }
  };

  const open = async (row: any, type: any) => {
    setPageType(type);
    const excludeCourseTypeList: any = [];
    if (taskType == '2') {
      excludeCourseTypeList.push(3);
    }
    getAllTablelist({ courseStatus: 1, excludeCourseTypeList }, async (list: any[]) => {
      if (type == 'step') {
        const courseId = row?.properties?.courseId;
        let { courseType, minNumberSwitch } = list?.find((item) => item?.id == courseId) || {};
        setIsVideo(courseType == '3');
        console.log(courseType, 'courseType', courseId);
        if (((!minNumberSwitch && taskType == '2') || courseType == '3') && courseId) {
          const res = await taskConfigFetch({ courseId, taskId });
          if (res) {
            form.setFieldsValue({
              examCount: res.examCount,
              retakeCount: res.retakeCount,
              videoLimit: res.videoLimit,
            });
          }
        }
      }
    });
    setInfo(row);
    console.log(row, 'row');
    if (type == 'step') {
      form.setFieldsValue({ courseId: row?.properties?.courseId });
    } else {
      form.setFieldsValue({ name: row?.text?.value });
    }

    setVisible(true);
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Drawer
      title={'编辑节点'}
      placement="right"
      onClose={onCancel}
      visible={visible}
      footer={
        <Space align="baseline" style={{ float: 'right' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onOk} loading={formLoading}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Condition r-if={pageType == 'step'}>
          <Form.Item
            name="courseId"
            label="课程"
            rules={[{ required: true, message: '请选择课程' }]}
          >
            <Select
              placeholder="请选择课程"
              showSearch
              filterOption={(input, option) =>
                (option?.item?.courseName as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase())
              }
            >
              {allTableList?.map((item: any, index: any) => (
                <Select.Option key={index} value={item.id} item={item}>
                  {item.courseName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Condition r-if={showTimes}>
            <Form.Item
              name="examCount"
              label="考试次数"
              rules={[{ required: true, message: '请输入1-100整数' }]}
            >
              <InputNumber style={{ width: 300 }} placeholder='请输入1-100整数' step={1} max={100} min={1} />
            </Form.Item>
            <Form.Item
              name="retakeCount"
              label="申请重考次数"
              rules={[{ required: true, message: '请输入1-100整数' }]}
            >
              <InputNumber style={{ width: 300 }} placeholder='请输入1-100整数' step={1} max={100} min={1} />
            </Form.Item>
          </Condition>
          <Condition r-if={isVideo}>
            <Form.Item
              name="videoLimit"
              label="视频进度开关"
              rules={[{ required: true, message: '' }]}
              initialValue={0}
            >
              <Radio.Group>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
              </Radio.Group>
            </Form.Item>
          </Condition>
        </Condition>
        <Condition r-if={pageType == 'other'}>
          <Form.Item
            name="name"
            label="节点名称"
            rules={[
              { required: true, message: '请输入节点名称' },
              { validator: validateSpaces, trigger: 'change' },
            ]}
          >
            <Input maxLength={75} showCount onKeyPress={handleKeyPress}></Input>
          </Form.Item>
        </Condition>
      </Form>
    </Drawer>
  );
};

export default FlowDrawer;
