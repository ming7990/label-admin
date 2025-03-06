import Condition from '@/components/Condition';
import config from '@/config';
import { handleKeyPress, validateSpaces } from '@/utils';
import { Modal, Input, Radio, Switch, Form, InputNumber, Checkbox, Select } from 'antd';
import { useEffect, useImperativeHandle, useState } from 'react';
import { useCourceModel, usePlotModel } from '../../params-manage/model';

const { TextArea } = Input;
const { Item: FormItem } = Form;

const TableForm: React.FC<any> = (props) => {
  const { cref, courseAdd, courseDetail, courseEdit, reload, loading } = props;
  const [form] = Form.useForm();
  const courseStyle = Form.useWatch('courseType', form);
  const minNumberSwitch = Form.useWatch('minNumberSwitch', form);

  const { courceData, loading: getListLoading } = useCourceModel();
  const { getPlotList } = usePlotModel();

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const [visible, setVisible] = useState<any>(false);
  const [formType, setFormType] = useState<any>('add');
  const [tableInfo, setTableInfo] = useState<any>({});
  const [modelList, setModelList] = useState<any>([]);

  const onCancel = () => {
    form.resetFields();
    setTableInfo({});
    setVisible(false);
  };

  const onOk = async () => {
    let valid = await form.validateFields();
    if (valid) {
      console.log(valid);
      let reqData = { ...tableInfo, ...valid };
      if (formType == 'add') {
        await courseAdd(reqData).then((res: any) => {
          if (res) {
            onCancel();
            reload();
          }
        });
      } else if (formType == 'edit') {
        await courseEdit(reqData).then((res: any) => {
          if (res) {
            onCancel();
            reload();
          }
        });
      }
    }
  };

  const open = async (type: any, row?: any) => {
    setFormType(type);
    if (type === 'edit') {
      if (row?.courseType) courseTypeChange(row?.courseType)
      await courseDetail({ id: row?.id }).then((res: any) => {
        setTableInfo(res?.data || row);
        form.setFieldsValue({
          ...res?.data,
        });
      });
    } else {
      courseTypeChange(1)
    }
    setVisible(true);
  };

  const courseTypeChange = (value: any) => {
    const reqData = {};
    form.setFieldsValue({
      modelId: undefined, // 或者使用 undefined  
    });
    if (value === 4) {
      reqData['status'] = 0;
      getPlotList(reqData).then((res: any) => {
        if (res?.resultCode === config.successCode) {
          setModelList(res?.data);
        }
      });
    } else {
      courceData({}).then((res) => {
        if (res?.resultCode === config.successCode) {
          setModelList(res?.data);
        }
      });
    }
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  return (
    <Modal
      visible={visible}
      title={`${formType == 'edit' ? '编辑' : '新增'}课程`}
      onCancel={onCancel}
      onOk={onOk}
      width={600}
      confirmLoading={loading}
    >
      <Form form={form} layout="horizontal" {...formItemLayout}>
        <Form.Item
          name="courseName"
          label="课程名称"
          rules={[
            { required: true, message: '请输入课程名称' },
            { validator: validateSpaces, trigger: 'change' },
          ]}
        >
          <Input
            showCount
            maxLength={75}
            placeholder="请输入课程名称"
            onKeyPress={handleKeyPress}
          />
        </Form.Item>
        <Form.Item
          name={'passMark'}
          label="合格分数"
          rules={[{ required: true, message: '请输入合格分数' }]}
        >
          <InputNumber
            disabled={tableInfo?.isEdit}
            precision={0}
            style={{ width: '135px' }}
            controls={false}
            min={1}
            max={100}
            placeholder={'请输入1-100整数'}
          />
        </Form.Item>
        <Form.Item
          name={'courseType'}
          label="课程样式"
          initialValue={0}
          rules={[{ required: true, message: '请选择课程样式' }]}
        >
          <Radio.Group disabled={formType == 'edit'} onChange={e => courseTypeChange(e.target.value)}>
            <Radio value={0}>常规</Radio>
            <Radio value={1}>剧情</Radio>
            <Radio value={2}>文本</Radio>
            <Radio value={3}>视频</Radio>
            <Radio value={4}>大模型剧情</Radio>
            <Radio value={5}>录音</Radio>
          </Radio.Group>
        </Form.Item>
        <Condition r-if={courseStyle == 1 || courseStyle == 4}>
          <Form.Item
            name="modelId"
            label="课程模型"
            rules={[{ required: true, message: '请选择课程模型' }]}
          >
            <Select
              placeholder="请选择课程模型"
              loading={getListLoading}
              mode={courseStyle === 4 ? "multiple" : undefined}  // 根据课程样式决定是否多选 
              allowClear
              showSearch
              showArrow
            >
              {modelList?.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.modelName || item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Condition>
        {/* 答题时间 */}
        <Condition r-if={courseStyle == 2}>
          <Form.Item
            label={'答题时间'}
            name={'answerTime'}
            rules={[{ required: true, message: '请输入答题时间' }]}
          >
            <InputNumber
              disabled={tableInfo?.isEdit}
              precision={0}
              controls={false}
              style={{ width: '185px' }}
              min={1}
              max={999}
              placeholder={'请输入1-999整数'}
              addonAfter="分钟"
            />
          </Form.Item>
        </Condition>
        <Form.Item label="最少训练次数">
          <Form.Item noStyle name={'minNumberSwitch'} valuePropName="checked" initialValue={0}>
            <Checkbox
              disabled={tableInfo?.isEdit}
              onChange={(e: any) => {
                form.setFieldsValue({ minNumberSwitch: e?.target?.checked ? 1 : 0 });
              }}
            >
              开启
            </Checkbox>
          </Form.Item>
          <Condition r-if={minNumberSwitch}>
            <Form.Item
              noStyle
              name={'minNumber'}
              rules={[{ required: true, message: '请输入最少训练次数' }]}
            >
              <InputNumber
                disabled={tableInfo?.isEdit}
                precision={0}
                controls={false}
                style={{ width: '135px' }}
                min={1}
                max={100}
                placeholder={'请输入1-100整数'}
              />
            </Form.Item>
          </Condition>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableForm;
