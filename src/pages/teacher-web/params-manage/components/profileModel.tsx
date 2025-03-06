
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, Divider, Checkbox } from 'antd';
import moment from 'moment';

const { Option } = Select;

const CustomerProfileModal = forwardRef(({ confirmSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [mode, setMode] = useState('add'); // 'add' 或 'edit'

  // 使用 useImperativeHandle 让父组件可以调用子组件的方法
  useImperativeHandle(ref, () => ({
    open: (record = {}, mode = 'add') => {
      setMode(mode);
      if (mode === 'edit') {
        // 设置表单字段值
        form.setFieldsValue({
          // 个人基础信息
          name: record.name || '张三',
          gender: record.gender || '男',
          age: record.age || '21',
          company: record.company || '中邮消费金融有限公司',
          companyAddress: record.companyAddress || '广东省广州市天河区林和东路281号',
          homeAddress: record.homeAddress || '广东省广州市天河区林和村',
          emergencyContact: record.emergencyContact || '父亲，张大，18236363636',
          education: record.education || '本科',
          maritalStatus: record.maritalStatus || '未婚',
          // 贷款信息
          loanProduct: record.loanProduct || '邮你贷',
          overdueDays: record.overdueDays || '10天',
          overdueAmount: record.overdueAmount || '1000元',
          settlementAmount: record.settlementAmount || '3000元',
          overduePeriods: record.overduePeriods || '1期',
          overdueTimes: record.overdueTimes || '2次',
          // 债务信息（征信报告）
          totalDebt: record.totalDebt || '500000元',
          mortgageCount: record.mortgageCount || '10笔',
          mortgageBalance: record.mortgageBalance || '300000元',
          mortgageSettledCount: record.mortgageSettledCount || '1笔',
          carLoanCount: record.carLoanCount || '10笔',
          carLoanBalance: record.carLoanBalance || '200000元',
          carLoanSettledCount: record.carLoanSettledCount || '2笔',
          mortgageLastRepaymentDate: record.mortgageLastRepaymentDate ? moment(record.mortgageLastRepaymentDate) : moment('2024-10-20'),
          carLoanLastRepaymentDate: record.carLoanLastRepaymentDate ? moment(record.carLoanLastRepaymentDate) : moment('2024-10-10'),
          creditCardCount: record.creditCardCount || '6户',
          unsecuredLoanCount: record.unsecuredLoanCount || '23笔',
          securedLoanCount: record.securedLoanCount || '3笔',
          inquiriesPastYear: record.inquiriesPastYear || '71次',
          // 公积金最近缴费地及公司
          providentFundLocation: record.providentFundLocation || '广州',
          providentFundCompany: record.providentFundCompany || '中邮消费金融有限公司',
          // 历史催记记录
          communicationTimes: record.communicationTimes || '0次',
          promiseTimes: record.promiseTimes || '0次',
          thirdPartyContactTimes: record.thirdPartyContactTimes || '0次',
          thirdPartyEffectiveCommunicationTimes: record.thirdPartyEffectiveCommunicationTimes || '0次',
          contactableInLastMonth: record.contactableInLastMonth || false,
          promisedInLastMonth: record.promisedInLastMonth || false,
          lastContactDate: record.lastContactDate ? moment(record.lastContactDate) : moment('2024-10-31'),
        });
      } else {
        // 重置表单字段
        form.resetFields();
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const handleOk = () => {
    form.validateFields().then(values => {
      confirmSubmit(values);
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="客户画像"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        {/* 个人基础信息 */}
        <Divider orientation="left">个人基础信息</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Select placeholder="请选择性别">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
              <Input placeholder="请输入年龄" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="education" label="教育程度">
              <Select placeholder="请选择教育程度">
                <Option value="高中">高中</Option>
                <Option value="大专">大专</Option>
                <Option value="本科">本科</Option>
                <Option value="硕士">硕士</Option>
                <Option value="博士">博士</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="maritalStatus" label="婚姻状况">
              <Select placeholder="请选择婚姻状况">
                <Option value="未婚">未婚</Option>
                <Option value="已婚">已婚</Option>
                <Option value="离异">离异</Option>
                <Option value="丧偶">丧偶</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="emergencyContact" label="紧急联系人">
              <Input placeholder="请输入紧急联系人" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="company" label="单位">
              <Input placeholder="请输入单位" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="companyAddress" label="单位地址">
              <Input placeholder="请输入单位地址" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="homeAddress" label="户籍地址">
              <Input placeholder="请输入户籍地址" />
            </Form.Item>
          </Col>
        </Row>

        {/* 贷款信息 */}
        <Divider orientation="left">贷款信息</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="loanProduct" label="贷款产品">
              <Input placeholder="请输入贷款产品" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="overdueDays" label="逾期天数">
              <Input placeholder="请输入逾期天数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="overdueAmount" label="逾期金额">
              <Input placeholder="请输入逾期金额" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="settlementAmount" label="结清金额">
              <Input placeholder="请输入结清金额" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="overduePeriods" label="逾期期数">
              <Input placeholder="请输入逾期期数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="overdueTimes" label="逾期次数">
              <Input placeholder="请输入逾期次数" />
            </Form.Item>
          </Col>
        </Row>

        {/* 债务信息（征信报告） */}
        <Divider orientation="left">债务信息（征信报告）</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="totalDebt" label="总负债">
              <Input placeholder="请输入总负债" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mortgageCount" label="房贷笔数">
              <Input placeholder="请输入房贷笔数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="mortgageBalance" label="房贷余额">
              <Input placeholder="请输入房贷余额" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mortgageSettledCount" label="房贷结清笔数">
              <Input placeholder="请输入房贷结清笔数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="carLoanCount" label="车贷笔数">
              <Input placeholder="请输入车贷笔数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="carLoanBalance" label="车贷余额">
              <Input placeholder="请输入车贷余额" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="carLoanSettledCount" label="车贷结清笔数">
              <Input placeholder="请输入车贷结清笔数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mortgageLastRepaymentDate" label="房贷最后一次还款时间">
              <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="carLoanLastRepaymentDate" label="车贷最后一次还款时间">
              <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="creditCardCount" label="未销户贷记卡户数 (授信总额)">
              <Input placeholder="请输入未销户贷记卡户数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="unsecuredLoanCount" label="非抵押类贷款笔数">
              <Input placeholder="请输入非抵押类贷款笔数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="securedLoanCount" label="抵押类贷款笔数">
              <Input placeholder="请输入抵押类贷款笔数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="inquiriesPastYear" label="近一年查询记录">
              <Input placeholder="请输入近一年查询次数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="providentFundLocation" label="公积金最近缴费地及公司">
              <Input placeholder="请输入公积金最近缴费地及公司" />
            </Form.Item>
          </Col>
        </Row>

        {/* 历史催记记录 */}
        <Divider orientation="left">历史催记记录</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="communicationTimes" label="本人有沟通次数">
              <Input placeholder="请输入本人有沟通次数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="promiseTimes" label="本人承诺次数">
              <Input placeholder="请输入本人承诺次数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="thirdPartyContactTimes" label="第三方联系次数">
              <Input placeholder="请输入第三方联系次数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="thirdPartyEffectiveCommunicationTimes" label="第三方有效沟通次数">
              <Input placeholder="请输入第三方有效沟通次数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="contactableInLastMonth" label="近一个月是否可联" valuePropName="checked">
              <Checkbox>是</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="promisedInLastMonth" label="近一个月是否承诺" valuePropName="checked">
              <Checkbox>是</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="lastContactDate" label="最近一次联系时间">
              <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

export default CustomerProfileModal;

