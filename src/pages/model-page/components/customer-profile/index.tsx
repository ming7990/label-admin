import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Descriptions, Card, Select, Form } from 'antd';
import style from './style.less';
import { useProfileModel } from '@/pages/model-page/model';
import { useSoundConfigModel } from '@/pages/teacher-web/params-manage/model';

const CustomerProfile = forwardRef(({ onCustomerDataChange, profileIdChange = null, id = '' }, ref) => {
  const [form] = Form.useForm();
  const { getProfileList, getProfileDetail } = useProfileModel();
  const { timbreListApi } = useSoundConfigModel();
  const [profileId, setProfileId] = useState('');
  const [profileList, setProfileList] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [timbreList, setTimbreList] = useState<any>([]);

  const [descriptionsData, setDescriptionsData] = useState([
    { key: '1', field: '姓名', value: 'customer_name' },
    { key: '2', field: '性别', value: 'gender' },
    { key: '3', field: '年龄', value: 'age' },
    { key: '4', field: '单位', value: 'unit' },
    { key: '5', field: '单位地址', value: 'unit_address' },
    { key: '6', field: '户籍地址', value: 'home_addr' },
    { key: '7', field: '紧急联系人', value: 'emergency_contact' },
    { key: '8', field: '学历', value: 'educational_level' },
    { key: '9', field: '婚姻状况', value: 'matrimony' },
    { key: '10', field: '贷款产品', value: 'prod_name' },
    { key: '11', field: '逾期天数', value: 'overdue_day' },
    { key: '12', field: '逾期金额', value: 'overdue_count', },
    { key: '13', field: '结清金额', value: 'settled_amount' },
    { key: '14', field: '逾期期数', value: 'overdues' },
    { key: '15', field: '逾期次数', value: 'overdue_times' },
    { key: '16', field: '总负债', value: 'total_liabilities' },
    { key: '17', field: '房贷笔数', value: 'mortgage_loans' },
    { key: '18', field: '房贷余额', value: 'mortgage_loan_balance' },
    { key: '19', field: '房贷结清笔数', value: 'settled_mortgage_loans' },
    { key: '20', field: '车贷笔数', value: 'auto_loans' },
    { key: '21', field: '车贷余额', value: 'auto_loan_balance' },
    { key: '22', field: '车贷结清笔数', value: 'number_autoLoans_settled' },
    { key: '23', field: '房贷最后一次还款时间', value: 'last_time_mortgage_loan' },
    { key: '24', field: '车贷最后一次还款时间', value: 'last_time_auto_loan' },
    { key: '25', field: '未结户贷记卡数', value: 'total_creditLine_granted' },
    { key: '26', field: '非抵押类贷款笔数', value: 'number_non_mortgage_loans' },
    { key: '27', field: '抵押类贷款笔数', value: 'number_mortgage_loans' },
    { key: '28', field: '近一年查询记录', value: 'query_records_past_year' },
    { key: '29', field: '公积金最近缴纳地及公司', value: 'latest_pf_pay_site_and_firm' },
    { key: '30', field: '本人有沟通次数', value: 'pers_commCounts' },
    { key: '31', field: '本人承诺次数', value: 'number_personal_commits' },
    { key: '32', field: '第三方联系次数', value: 'number_contacts_third_parties' },
    { key: '33', field: '第三方有效沟通次数', value: 'count_valid_communications_third_parties' },
    { key: '34', field: '近一个月是否可联系', value: 'last_month_contactable' },
    { key: '35', field: '近一个月是否承诺', value: 'commitment_last_month' },
    { key: '36', field: '最近一次联系时间', value: 'last_contact_time' },
  ]);

  // 暴露验证方法给父组件  
  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      return await form.validateFields();
    }
  }));

  const queryProfileList = async () => {
    const res = await getProfileList()
    setProfileList(res?.data || []);
  }

  const getTimbreListApi = async () => {
    const res = await timbreListApi({});
    setTimbreList(res?.data?.list || [])
  };

  useEffect(() => {
    if (id) {
      setProfileId(id)
      form.setFieldsValue({ profileId: id });
      profileChange(id)
    }
    getTimbreListApi()
    queryProfileList()
  }, []);

  function getRandomValue(arr) {
    if (arr.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const profileChange = async (id) => {
    setProfileId(id);
    form.setFieldsValue({ profileId: id });
    const bigModelTypeName = profileList.find(item => item.id === id)?.name || "";
    const res = await getProfileDetail({ customerProfileId: id });
    if (profileIdChange) profileIdChange(id);

    const obj = {};
    res?.data.forEach((item) => {
      if (item.attributeType === 'time' && item.attributeValue) {
        const times = item.attributeValue.split(',')
        obj[item.aliasName] = `${times[0]}至${times[1]}`
      } else if (item.attributeValue) {
        const values = item.attributeValue.split('&&') || []
        obj[item.aliasName] = item.unit ? `${getRandomValue(values)}${item.unit}` : getRandomValue(values)
      }
    });

    descriptionsData.forEach((item) => {
      if (obj[item.value]) item['descriptionsText'] = obj[item.value];
    });

    // const timbreId = form.getFieldValue('timbreId');
    // const timbreName = timbreList.find(item => item.id === timbreId)?.name || "";

    onCustomerDataChange({
      bigCourseCustomerInfoRequest: {
        bigModelTypeName,
        // timbreName,
        customerProfileDataList: descriptionsData
      }
    });

    setDescriptionsData([...descriptionsData]);
    setCustomerData(res?.data || []);
  };

  const handleFormValuesChange = (changedValues) => {
    if (changedValues.profileId) {
      profileChange(changedValues.profileId);
    }
  };

  return (
    <Card className={style['customer-profile']}>
      <Form
        form={form}
        onValuesChange={handleFormValuesChange}
        layout="vertical"
      >
        {/* <Form.Item
          label="音色名称"
          name="timbreId"
          rules={[{ required: true, message: '请选择音色名称' }]}
        >
          <Select
            placeholder="请选择音色名称"
            showSearch
            allowClear
          >
            {timbreList?.map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item
          label="客户画像名称"
          name="profileId"
          rules={[{ required: true, message: '请选择客户画像' }]}
        >
          <Select
            placeholder="请选择客户画像"
            showSearch
            allowClear
            filterOption={(input, option) => {
              return (option?.item as unknown as string)?.toLowerCase()?.includes(input.toLowerCase());
            }}
          >
            {profileList.map((item) => (
              <Select.Option key={item.id} value={item.id} item={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <div
        style={{
          width: 260,
          maxHeight: 'calc(100vh - 400px)',
          overflowY: 'auto',
          border: '1px solid #f0f0f0',
          borderRadius: '4px'
        }}
      >
        <Descriptions
          bordered
          column={1}
          style={{ width: '100%' }}
          size='small'
        >
          {descriptionsData.map(item => (
            <Descriptions.Item key={item.key} label={item.field}>
              {item.descriptionsText || ""}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    </Card>
  );
});

export default CustomerProfile;