import { useState, useImperativeHandle, Fragment, FocusEvent, useEffect } from 'react';
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
} from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

const formItemList = [
  { name: '姓名', key: 'customer_name', dataType: 'text', type: 'input', unit: '' },
  {
    name: '性别',
    key: 'gender',
    dataType: 'text',
    type: 'select',
    options: ['男', '女'],
    unit: '',
  },
  { name: '年龄', key: 'age', dataType: 'int', type: 'input', unit: '岁' },
  { name: '单位', key: 'unit', dataType: 'text', type: 'input', unit: '' },
  { name: '单位地址', key: 'unit_address', dataType: 'text', type: 'input', unit: '' },
  { name: '户籍地址', key: 'home_addr', dataType: 'text', type: 'input', unit: '' },
  { name: '紧急联系人信息', key: 'emergency_contact', dataType: 'text', type: 'input', unit: '' },
  {
    name: '教育程度',
    key: 'education_level',
    dataType: 'text',
    type: 'select',
    options: ['小学', '初中', '高中', '大学', '大学及以上'],
    unit: '',
  },
  {
    name: '婚姻状况',
    key: 'matrimony',
    dataType: 'text',
    type: 'select',
    options: ['未婚', '已婚', '离异'],
    unit: '',
  },
  { name: '贷款产品', key: 'prod_name', dataType: 'text', type: 'input', unit: '' },
  { name: '逾期天数', key: 'overdue_day', dataType: 'int', type: 'input', unit: '天' },
  { name: '逾期金额', key: 'overdue_count', dataType: 'float', type: 'input', unit: '元' },
  { name: '结清金额', key: 'settled_amount', dataType: 'float', type: 'input', unit: '元' },
  { name: '逾期期数', key: 'overdues', dataType: 'int', type: 'input', unit: '次' },
  { name: '逾期次数', key: 'overdue_times', dataType: 'int', type: 'input', unit: '次' },
  { name: '总负债', key: 'total_liabilities', dataType: 'float', type: 'input', unit: '元' },
  { name: '房贷笔数', key: 'mortgage_loans', dataType: 'int', type: 'input', unit: '笔' },
  { name: '房贷余额', key: 'mortgage_loan_balance', dataType: 'float', type: 'input', unit: '元' },
  {
    name: '房贷结清笔数',
    key: 'settled_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '笔',
  },
  { name: '车贷笔数', key: 'auto_loans', dataType: 'int', type: 'input', unit: '笔' },
  { name: '车贷余额', key: 'auto_loan_balance', dataType: 'float', type: 'input', unit: '元' },
  {
    name: '车贷结清笔数',
    key: 'number_autoLoans_settled',
    dataType: 'int',
    type: 'input',
    unit: '笔',
  },
  {
    name: '房贷最后一次还款时间',
    key: 'last_time_mortgage_loan',
    dataType: 'time',
    type: 'input',
    unit: '',
  },
  {
    name: '车贷最后一次还款时间',
    key: 'last_time_auto_loan',
    dataType: 'time',
    type: 'input',
    unit: '',
  },
  {
    name: '未销户贷记卡户数(授信总额)',
    key: 'total_creditLine_granted',
    dataType: 'int',
    type: 'input',
    unit: '',
  },
  {
    name: '非抵押类贷款笔数',
    key: 'number_non_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '笔',
  },
  {
    name: '抵押类贷款笔数',
    key: 'number_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '笔',
  },
  {
    name: '近一年查询记录',
    key: 'number_mortgage_loans',
    dataType: 'int',
    type: 'input',
    unit: '次',
  },
  {
    name: '公积金最近缴费地及公司',
    key: 'query_records_past_year',
    dataType: 'text',
    type: 'input',
    unit: '',
  },
  { name: '本人有沟通次数', key: 'pers_commCounts', dataType: 'int', type: 'input', unit: '次' },
  {
    name: '本人承诺次数',
    key: 'number_personal_commitments',
    dataType: 'int',
    type: 'input',
    unit: '次',
  },
  {
    name: '第三方联系次数',
    key: 'number_contacts_third_parties',
    dataType: 'int',
    type: 'input',
    unit: '次',
  },
  {
    name: '第三方有效沟通次数',
    key: 'count_valid_communications_third_parties',
    dataType: 'int',
    type: 'input',
    unit: '次',
  },
  {
    name: '近一个月是否可联',
    key: 'last_month_contactable',
    dataType: 'text',
    type: 'select',
    options: ['是', '否'],
    unit: '',
  },
  {
    name: '近一个月是否承诺',
    key: 'commitment_last_month',
    dataType: 'text',
    type: 'select',
    options: ['是', '否'],
    unit: '',
  },
  { name: '最近一次联系时间', key: 'last_contact_time', dataType: 'time', type: 'input', unit: '' },
];

export default (props: any) => {
  const { cref, loading, comfirmSubmit } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [pageType, setPageTyp] = useState<any>('');
  const [profileData, setProfileData] = useState<any>({});

  useImperativeHandle(cref, () => ({
    open: (record: any, type: any) => {
      form.resetFields();
      setVisible(true);
      // const tempData = {}
      // formItemList.forEach(item => tempData[item.key] = [])
      // setProfileData(tempData);
      // setRowData(record);
      // setPageTyp(type);
      // if (type == 'editUser') {
      //     const { roleCode = [] } = record;
      //     const showGp = roleCode.includes('student');
      //     setShowGroup(showGp);
      //     const showWp = roleCode?.includes('teacher') || roleCode?.includes('business');
      //     setShowWorkplace(showWp);
      //     form.setFieldsValue({ groupId: record?.groupId });
      //     showWp && form.setFieldsValue({ workPlaceId: record?.workPlaceId });
      // } else if (type == 'addGroup') {
      //     setRowData({});
      // } else if (type == 'editGroup') {
      //     form.setFieldsValue({ workPlaceId: record?.workPlaceId });
      //     form.setFieldsValue({ groupName: record?.groupName });
      // }
    },
    close: onClose,
  }));

  const onClose = () => {
    setProfileData({});
    setVisible(false);
  };

  const save = async () => {
    const data = { ...profileData };
    console.log(data);
    for (let i = 0; i < formItemList.length; i++) {
      const item = formItemList[i];
      if (!data[item.key] || data[item.key]?.length === 0) {
        message.warn(`请输入${item.name}`);
        break;
      }
    }
  };

  const changeValue = (
    item:
      | { name: string; key: string; dataType: string; type: string; options?: undefined }
      | { name: string; key: string; dataType: string; type: string; options: string[] },
    event: FocusEvent<HTMLInputElement, Element>,
    position: string = '',
  ) => {
    const value: any =
      Object.prototype.toString.call(event) === '[object Object]' ? event?.target?.value : event;
    if (value === '') return;
    const oldData = { ...profileData };
    if (item.dataType === 'time') {
      oldData[item.key] = [
        moment(value[0]).format('YYYY-MM-DD'),
        moment(value[1]).format('YYYY-MM-DD'),
      ];
    } else if (item.dataType !== 'text') {
      if (position !== '') {
        if (!oldData[item.key]) {
          oldData[item.key] = [];
        }
        oldData[item.key][position] = value;
      } else {
        oldData[item.key] = [value];
      }
    } else {
      if (oldData[item.key]) {
        oldData[item.key].indexOf(value) === -1 && oldData[item.key].push(value);
      } else {
        oldData[item.key] = [value];
      }
    }
    console.log(oldData);
    setProfileData(oldData);
  };

  const removeItem = (key: string, value: any) => {
    const oldData = { ...profileData };
    oldData[key].splice(oldData[key].indexOf(value), 1);
    setProfileData(oldData);
  };

  return (
    <Modal
      title={
        pageType == 'editUser' ? '编辑' : pageType == 'addGroup' ? '新建客户画像' : '编辑客户画像'
      }
      width={'60%'}
      centered
      onCancel={onClose}
      visible={visible}
      footer={
        <Space>
          <Button type="primary" onClick={save} loading={loading}>
            保存
          </Button>
          <Button onClick={onClose} loading={loading}>
            取消
          </Button>
        </Space>
      }
      destroyOnClose
    >
      {formItemList.map((item) => {
        return (
          <div key={item.name} style={{ margin: '20px 0' }}>
            <span style={{ marginRight: '20px' }}>{item.name}</span>
            {item.dataType == 'text' && item.type === 'input' && (
              <Input onBlur={(value) => changeValue(item, value)} style={{ width: '200px' }} />
            )}
            {item.dataType == 'text' && item.type === 'select' && (
              <Select onChange={(value) => changeValue(item, value)} style={{ width: '200px' }}>
                {item.options?.map((item) => (
                  <Select.Option key={item}>{item}</Select.Option>
                ))}
              </Select>
            )}
            {(item.dataType == 'int' || item.dataType === 'float') && (
              <div style={{ display: 'inline-block' }}>
                <InputNumber<string>
                  style={{ width: 200 }}
                  step={item.dataType === 'int' ? '1' : '0.001'}
                  onChange={(value) => changeValue(item, value, 0)}
                  stringMode
                />
                {/* <span style={{ marginLeft: '3px', marginRight: '10px' }}>{item.unit}</span>—— */}
                <span style={{ margin: '0 10px' }}>——</span>
                <InputNumber<string>
                  style={{ width: 200, marginLeft: '10px' }}
                  step={item.dataType === 'int' ? '1' : '0.001'}
                  onChange={(value) => changeValue(item, value, 1)}
                  stringMode
                />
                {/* <span style={{ marginLeft: '3px' }}>{item.unit}</span> */}
              </div>
            )}
            {item.dataType == 'time' && (
              <RangePicker onChange={(value) => changeValue(item, value)} format={'YYYY-MM-DD'} />
            )}
            {item.dataType == 'text' && (
              <div style={{ marginTop: '5px' }}>
                {profileData[item.key]?.map((itemData: {} | null | undefined) => (
                  <Tag closable onClose={() => removeItem(item.key, itemData)} key={itemData}>
                    {itemData}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </Modal>
  );
};
