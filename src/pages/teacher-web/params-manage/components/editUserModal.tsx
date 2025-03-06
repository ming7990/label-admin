import { useState, useImperativeHandle, Fragment } from 'react';
import { Modal, Form, Input, Select, Button, message, Checkbox, Space } from 'antd';

export default (props: any) => {
  const { cref, loading, groupList, workplaceList, comfirmSubmit, organizationList } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});
  const [pageType, setPageTyp] = useState<any>('');
  const [showGroup, setShowGroup] = useState<any>(false);
  const [showWorkplace, setShowWorkplace] = useState<any>(false);

  useImperativeHandle(cref, () => ({
    open: (record: any, type: any) => {
      form.resetFields();
      setVisible(true);
      setRowData(record);
      setPageTyp(type);
      if (type == 'editUser') {
        const { roleCode = [] } = record;
        const showGp = roleCode.includes('student');
        setShowGroup(showGp);
        const showWp = roleCode?.includes('teacher') || roleCode?.includes('business');
        setShowWorkplace(showWp);
        form.setFieldsValue({ groupId: record?.groupId, organizationId: record?.organizationId });
        showWp && form.setFieldsValue({ workPlaceId: record?.workPlaceId });
      } else if (type == 'addGroup') {
        setRowData({});
      } else if (type == 'editGroup') {
        form.setFieldsValue({ workPlaceId: record?.workPlaceId });
        form.setFieldsValue({ groupName: record?.groupName });
      }
    },
    close: onClose,
  }));

  const onClose = () => {
    setVisible(false);
  };

  const save = async () => {
    let fromVal = await form.validateFields();
    comfirmSubmit(fromVal, rowData, pageType);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      title={pageType == 'editUser' ? '编辑' : pageType == 'addGroup' ? '新建组别' : '编辑组别'}
      width={380}
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
      <Form form={form} {...layout}>
        {pageType == 'editUser' && (
          <Fragment>
            <Form.Item label="用户账号" name="account">
              {rowData?.account}
            </Form.Item>
            <Form.Item label="姓名" name="userName">
              {rowData?.userName}
            </Form.Item>
            <Form.Item label="角色" name="roleName">
              {rowData?.roleName}
            </Form.Item>
            {!showGroup ? null : (
              <Form.Item
                label="部门组别"
                name="groupId"
                rules={[{ required: true, message: '请选择组别' }]}
              >
                <Select optionFilterProp="children" showSearch allowClear placeholder="请选择组别">
                  {groupList?.map((item: any) => {
                    return (
                      <Select.Option key={item?.id} value={item?.id}>
                        {item?.groupName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {!showWorkplace ? null : (
              <Form.Item
                label="职场"
                name="workPlaceId"
                rules={[{ required: true, message: '请选择职场' }]}
              >
                <Select optionFilterProp="children" showSearch allowClear placeholder="请选择职场">
                  {workplaceList?.map((item: any) => {
                    return (
                      <Select.Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {
              <Form.Item
                label="所属机构"
                name="organizationId"
                rules={[{ required: true, message: '请选择所属机构' }]}
              >
                <Select optionFilterProp="children" showSearch allowClear placeholder="请选择所属机构">
                  {organizationList?.map((item: any) => {
                    return (
                      <Select.Option key={item?.id} value={item?.id}>
                        {item?.organizationName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            }
          </Fragment>
        )}
        {(pageType == 'addGroup' || pageType == 'editGroup') && (
          <Fragment>
            <Form.Item
              label="职场"
              name="workPlaceId"
              rules={[{ required: true, message: '请选择职场' }]}
            >
              <Select optionFilterProp="children" showSearch allowClear placeholder="请选择职场">
                {workplaceList?.map((item: any) => {
                  return (
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="组别名称"
              name="groupName"
              rules={[{ required: true, message: '请输入组别名称' }]}
            >
              <Input maxLength={30} showCount placeholder="请输入组别名称" />
            </Form.Item>
          </Fragment>
        )}
      </Form>
    </Modal>
  );
};
