import { useState, useImperativeHandle, useRef, FocusEvent, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  DatePicker,
  Space,
  Tag,
  InputNumber,
  Row,
  Col,
  Divider,
} from 'antd';
import styles from './../index.less';
import TagsCom from './tagsCom';
import moment from 'moment';
const { RangePicker } = DatePicker;

const formItemList = [
  { title: '个人基础信息' },
  { name: '姓名', key: 'customer_name', dataType: 'text', type: 'input', unit: '', required: true, attributeClass: 0 },
  {
    name: '性别',
    key: 'gender',
    dataType: 'text',
    type: 'select',
    options: ['男', '女'],
    unit: '',
    required: true,
    attributeClass: 0
  },
  { name: '年龄', key: 'age', dataType: 'int', type: 'input', unit: '岁', required: true, attributeClass: 0 },
  { name: '单位', key: 'unit', dataType: 'text', type: 'input', unit: '', required: true, attributeClass: 0 },
  { name: '单位地址', key: 'unit_address', dataType: 'text', type: 'input', unit: '', required: true, attributeClass: 0 },
  { name: '户籍地址', key: 'home_addr', dataType: 'text', type: 'input', unit: '', required: true, attributeClass: 0 },
  { name: '紧急联系人信息', key: 'emergency_contact', dataType: 'text', type: 'input', unit: '', required: true, attributeClass: 0 },
  {
    name: '教育程度',
    key: 'education_level',
    dataType: 'text',
    type: 'select',
    options: ['小学', '初中', '高中', '大学', '大学及以上'],
    unit: '',
    required: true, attributeClass: 0
  },
  {
    name: '婚姻状况',
    key: 'matrimony',
    dataType: 'text',
    type: 'select',
    options: ['未婚', '已婚', '离异'],
    unit: '',
    required: true, attributeClass: 0
  },
  { title: '贷款信息' },
  { name: '贷款产品', key: 'prod_name', dataType: 'text', type: 'input', unit: '', required: true, attributeClass: 1 },
  { name: '逾期天数', key: 'overdue_day', dataType: 'int', type: 'input', unit: '天', required: true, attributeClass: 1 },
  { name: '逾期金额', key: 'overdue_count', dataType: 'float', type: 'input', unit: '元', required: true, attributeClass: 1 },
  { name: '结清金额', key: 'settled_amount', dataType: 'float', type: 'input', unit: '元', required: true, attributeClass: 1 },
  { name: '逾期期数', key: 'overdues', dataType: 'int', type: 'input', unit: '次', required: true, attributeClass: 1 },
  { name: '逾期次数', key: 'overdue_times', dataType: 'int', type: 'input', unit: '次', required: true, attributeClass: 1 },
  { title: '债务信息（征信报告）' },
  { name: '总负债', key: 'total_liabilities', dataType: 'float', type: 'input', unit: '元', attributeClass: 2 },
  { name: '房贷笔数', key: 'mortgage_loans', dataType: 'int', type: 'input', unit: '笔', attributeClass: 2 },
  { name: '房贷余额', key: 'mortgage_loan_balance', dataType: 'float', type: 'input', unit: '元', attributeClass: 2 },
  {
    name: '房贷结清笔数',
    key: 'settled_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '笔', attributeClass: 2
  },
  { name: '车贷笔数', key: 'auto_loans', dataType: 'int', type: 'input', unit: '笔', attributeClass: 2 },
  { name: '车贷余额', key: 'auto_loan_balance', dataType: 'float', type: 'input', unit: '元', attributeClass: 2 },
  {
    name: '车贷结清笔数',
    key: 'number_autoLoans_settled',
    dataType: 'int',
    type: 'input',
    unit: '笔', attributeClass: 2
  },
  {
    name: '房贷最后一次还款时间',
    key: 'last_time_mortgage_loan',
    dataType: 'time',
    type: 'input',
    unit: '', attributeClass: 2
  },
  {
    name: '车贷最后一次还款时间',
    key: 'last_time_auto_loan',
    dataType: 'time',
    type: 'input',
    unit: '', attributeClass: 2
  },
  {
    name: '未销户贷记卡户数(授信总额)',
    key: 'total_creditLine_granted',
    dataType: 'int',
    type: 'input',
    unit: '', attributeClass: 2
  },
  {
    name: '非抵押类贷款笔数',
    key: 'number_non_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '笔', attributeClass: 2
  },
  {
    name: '抵押类贷款笔数',
    key: 'number_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '笔', attributeClass: 2
  },
  {
    name: '近一年查询记录',
    key: 'query_records_past_year',
    dataType: 'int',
    type: 'input',
    unit: '次', attributeClass: 2
  },
  {
    name: '公积金最近缴费地及公司',
    key: 'latest_pf_pay_site_and_firm',
    dataType: 'text',
    type: 'input',
    unit: '', attributeClass: 2
  },
  { title: '历史催记记录' },
  { name: '本人有沟通次数', key: 'pers_commCounts', dataType: 'int', type: 'input', unit: '次', attributeClass: 3 },
  {
    name: '本人承诺次数',
    key: 'number_personal_commitments',
    dataType: 'int',
    type: 'input',
    unit: '次', attributeClass: 3
  },
  {
    name: '第三方联系次数',
    key: 'number_contacts_third_parties',
    dataType: 'int',
    type: 'input',
    unit: '次', attributeClass: 3
  },
  {
    name: '第三方有效沟通次数',
    key: 'count_valid_communications_third_parties',
    dataType: 'int',
    type: 'input',
    unit: '次', attributeClass: 3
  },
  {
    name: '近一个月是否可联',
    key: 'last_month_contactable',
    dataType: 'text',
    type: 'select',
    options: ['是', '否'],
    unit: '', attributeClass: 3
  },
  {
    name: '近一个月是否承诺',
    key: 'commitment_last_month',
    dataType: 'text',
    type: 'select',
    options: ['是', '否'],
    unit: '', attributeClass: 3
  },
  { name: '最近一次联系时间', key: 'last_contact_time', dataType: 'time', type: 'input', unit: '', attributeClass: 3 },
];

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 12 },
};

export default (props: any) => {
  const { cref, comfirmSubmit } = props;

  const [form] = Form.useForm();

  const tagsRefs = useRef<{ [key: string]: any }>({});
  const toneWordsRef = useRef<any>({});

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [pageType, setPageTyp] = useState<any>('');
  const [profileData, setProfileData] = useState<any>({});

  useImperativeHandle(cref, () => ({
    open: (record: any, type: any, data) => {
      form.resetFields();
      setVisible(true);
      setPageTyp(type);
      if (type == 'add') {
        setRowData({});
      } else if (type == 'edit') {
        const formData = { name: record.name }
        data.forEach(item => {
          if (item.attributeType === 'time' && item.attributeValue) {
            const times = item.attributeValue.split(',')
            formData[item.aliasName] = [moment(times[0]), moment(times[1])]
          } else if (item.attributeType === 'int' || item.attributeType === 'float' && item.attributeValue) {
            const values = item.attributeValue.split('&&')
            formData[item.aliasName] = { leftValue: values[0], rightValue: values[1] }
          } else if (item.aliasName && item.attributeValue) {
            tagsRefs.current[item.aliasName]?.setTags(item.attributeValue.split('&&') || [])
            formData[item.aliasName] = item.attributeValue.split('&&') || []
          }
        });

        console.log('表单', formData);
        form.setFieldsValue({ ...formData });
        setRowData(record);
      }
    },
    close: onClose,
  }));

  const onClose = () => {
    setProfileData({});
    setVisible(false);
  };

  // 获取tag数据
  const getAllTagsData = () => {
    const tagsData = {};
    Object.keys(tagsRefs.current).forEach(key => {
      tagsData[key] = tagsRefs.current[key]?.tags?.join('&&') || '';
    });
    return tagsData;
  };

  // 参数转换
  const transformFormData = (formValues: any) => {
    const profileDataList: any[] = [];
    formItemList.forEach(item => {
      if (item.key && formValues[item.key] !== undefined && !item.title) {
        let attributeValue = formValues[item.key];
        if (item.dataType === 'int' || item.dataType === 'float' ? attributeValue.leftValue && attributeValue.rightValue : attributeValue) {
          if (item.dataType === 'int' || item.dataType === 'float') {
            attributeValue = `${attributeValue.leftValue}&&${attributeValue.rightValue}`
          } else if (item.dataType === 'time') {
            attributeValue = `${moment(attributeValue[0]).format('YYYY-MM-DD')},${moment(attributeValue[1]).format('YYYY-MM-DD')}`
          }
          profileDataList.push({
            attributeName: item.name,
            attributeValue: attributeValue.toString(),
            attributeType: item.dataType,
            unit: item.unit || '',
            attributeClass: item.attributeClass,
            aliasName: item.key,
            // create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            creator: 'admin'
          });
        }
      }
    });
    return {
      name: formValues.name,
      // id: moment().format('YYYYMMDDHHmmss'), // 生成一个临时ID  
      profileDataList,
    };
  }

  const save = async () => {
    try {
      // 验证表单  
      setLoading(true)
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const tagsData = getAllTagsData() // 获取tag数据
      const result = transformFormData({ ...formValues, ...tagsData })
      console.log('转换后的数据:', result);
      comfirmSubmit(result, rowData, pageType)
      // 调用提交方法   
      // onClose();
      setLoading(false)
    } catch (errorInfo) {
      console.log('表单验证失败:', errorInfo);
      message.error('请填写必填项');
      setLoading(false)
    }
  };

  const removeItem = (key: string, value: any) => {
    const oldData = { ...profileData };
    oldData[key].splice(oldData[key].indexOf(value), 1);
    setProfileData(oldData);
  };

  return (
    <Modal
      title={
        pageType == 'add' ? '新建客户画像' :
          '编辑客户画像'
      }
      centered
      onCancel={onClose}
      visible={visible}
      footer={
        <Space>
          <Button type="primary" onClick={save} loading={loading}>
            保存
          </Button>
          <Button onClick={onClose}>
            取消
          </Button>
        </Space>
      }
      destroyOnClose
      width={1100}
    >
      <Form form={form} {...layout}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="name" label="客户画像名称" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          {formItemList.map((item, index) => (
            item.title ? <Divider orientation="left" style={{ marginTop: index === 0 ? 0 : 16, marginBottom: 24 }}>{item.title}</Divider> :
              <Col key={item.name} span={12}>
                {item.dataType == 'text' && (
                  <Form.Item label={`${item.name}`} style={{ marginBottom: 16 }} name={item.key} rules={item.required ? [{ required: true, message: '请输入' }] : []}>
                    <div style={{ display: 'inline-block', maxHeight: '400px', paddingLeft: '10px', overflowY: 'auto', textAlign: 'left' }}>
                      <TagsCom
                        cref={(ref) => tagsRefs.current[item.key] = ref}
                        addBtnText={`新增${item.name}`}
                        allowClose={true}
                      />
                    </div>
                  </Form.Item>
                )}

                {(item.dataType == 'int' || item.dataType === 'float') && (
                  <Form.Item key={`${item.key}-main`} label={`${item.required ? '* ' : ''}${item.name}`} style={{ marginBottom: 16 }}>
                    <div className="flex items-center">
                      <Form.Item
                        key={`${item.key}-left`}
                        name={[item.key, 'leftValue']}
                        noStyle
                        rules={item.required ? [
                          { required: true, message: '请输入左边的值' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const rightValue = getFieldValue([item.key, 'rightValue']);
                              if (value !== undefined && rightValue !== undefined && Number(value) > Number(rightValue)) {
                                return Promise.reject(new Error('左边值必须小于右边值'));
                              }
                              return Promise.resolve();
                            },
                          }),
                        ] : [
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const rightValue = getFieldValue([item.key, 'rightValue']);
                              if (value !== undefined && rightValue !== undefined && Number(value) > Number(rightValue)) {
                                return Promise.reject(new Error('左边值必须小于右边值'));
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <InputNumber
                          precision={0}
                          min={0}
                          step={1}
                          className="mr-2"
                          onChange={() => {
                            form.validateFields([item.key]); // 手动触发验证  
                          }}
                        />
                      </Form.Item>
                      <span className="mr-2" style={{ paddingLeft: '4px' }}>{item.unit}</span>
                      <span className="mr-2" style={{ padding: '0 8px' }}>~</span>
                      <Form.Item
                        key={`${item.key}-right`}
                        name={[item.key, 'rightValue']}
                        noStyle
                        rules={item.required ? [
                          { required: true, message: '请输入右边的值' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const leftValue = getFieldValue([item.key, 'leftValue']);
                              if (value !== undefined && leftValue !== undefined && Number(value) < Number(leftValue)) {
                                return Promise.reject(new Error('左边值必须小于右边值'));
                              }
                              return Promise.resolve();
                            },
                          }),
                        ] : [
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const leftValue = getFieldValue([item.key, 'leftValue']);
                              if (value !== undefined && leftValue !== undefined && Number(value) < Number(leftValue)) {
                                return Promise.reject(new Error('左边值必须小于右边值'));
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <InputNumber
                          precision={0}
                          min={0}
                          step={1}
                          className="mr-2"
                          onChange={() => {
                            form.validateFields([item.key]); // 手动触发验证  
                          }}
                        />
                      </Form.Item>
                      <span style={{ paddingLeft: '4px' }}>{item.unit}</span>
                    </div>
                  </Form.Item>
                )}

                {item.dataType == 'time' && (
                  <Form.Item label={`${item.name}`} style={{ marginBottom: 16 }} name={item.key} rules={item.required ? [{ required: true, message: '请输入' }] : []}>
                    <RangePicker
                      format={'YYYY-MM-DD'}
                    />
                  </Form.Item>
                )}
              </Col>
          ))}
        </Row>
      </Form>
    </Modal >
  );
};
