import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Tabs, Select, Button, message, Spin, Space, notification, Drawer, Popconfirm } from 'antd';
import styles from './../index.less';
import { useUserManageModel } from './../model';
import EditUserModal from '../components/editUserModal';
import { CloseCircleOutlined } from '@ant-design/icons';
import { getWorkplaceColumns, useWorkPlaceModel } from '../workplace-manage/model';
import { useRoleManageModel } from '../role-manage/model';
import AddWorkplaceModal from '../workplace-manage/components/addWorkplaceModal';
import AddOrganizationModal from '../organization-manage/components/addOrganModal';
import { useModel } from 'umi';
import RoleModal from '../components/roleModal';
import BtnAuth from '@/components/BtnAuth';
import { getOrganizationApi } from '../model/api'

import config from '@/config';
const successCode = config.successCode;

const UserManage: React.FC = (props: any) => {
  const {
    loading,
    setLoading,
    userPage,
    userListRequest,
    userList,
    groupListRequest,
    groupList,
    workPlaceListRequest,
    workPlaceList,
    sameStepRequest,
    editRequest,
    groupPage,
    addGroupRequest,
    editGroupRequest,
    deleteGroupRequest,
    organizationPageRequest,
    addOrganizationRequest,
    editOrganizationRequest,
    deleteOrganizationRequest,
  } = useUserManageModel();

  const { getWorkPlacePage, addWorkPlace, workPlaceDelete, workPlaceEdit } = useWorkPlaceModel();
  const {
    loading: roleLoading,
    roleList,
    getRolePage,
    getRoleList,
    roleSynch,
  } = useRoleManageModel();

  // 用户信息
  const { initialState } = useModel('@@initialState');
  const { userInfoAll } = (initialState?.currentUser as any) || {};
  const { menuBtns } = userInfoAll || {};

  const editUserRef = useRef<any>();
  const roleRef = useRef<any>();
  const userActionRef = useRef<any>();
  const groupActionRef = useRef<any>();
  const organizationActionRef = useRef<any>();
  const addWorkplaceModalRef = useRef<any>();
  const addOrganizationModalRef = useRef<any>();
  const roleTableRef = useRef<any>();
  const workplaceTableRef = useRef<any>();
  const [visible, setVisible] = useState<any>(false);
  const [organizationList, setOrganizationList] = useState<any>([]);

  useEffect(() => {
    userListRequest({});
    groupListRequest({});
    getRoleList({});
    workPlaceListRequest({ type: 1 });
    getAllOrganizationList()
  }, []);

  const getAllOrganizationList = () => {
    getOrganizationApi()
      .then((res: any) => {
        setOrganizationList(res?.data)
        console.log('getAllOrganizationList', res)
      }).catch(() => { console.log() })
  }

  const getUserList = async (payload: any) => {
    let params = {
      ...payload,
      page: payload?.current,
    };
    delete params?.current;
    params.startTime = payload?.updateTime?.[0];
    params.endTime = payload?.updateTime?.[1];
    params.groupName = params?.groupName?.join(',');
    delete params?.updateTime;
    let res = await userPage(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const sameStep = async () => {
    let res = await sameStepRequest();
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '同步成功');
    } else {
      message.error(res?.resultDesc || '同步失败');
    }
  };

  const editUser = (record: any) => {
    editUserRef?.current?.open(record, 'editUser');
  };

  const comfirmSubmit = async (formVal: any, rowData: any, pageType: any) => {
    let params = {
      id: rowData?.id,
      ...formVal,
    };
    let res;
    if (pageType == 'editUser') {
      res = await editRequest(params);
    } else if (pageType == 'addGroup') {
      res = await addGroupRequest(params);
    } else if (pageType == 'editGroup') {
      res = await editGroupRequest(params);
    }
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      editUserRef?.current?.close();
      if (pageType == 'editUser') {
        userActionRef?.current?.reloadAndRest();
        userListRequest({});
      } else {
        groupActionRef?.current?.reloadAndRest();
        userActionRef?.current?.reloadAndRest();
        groupListRequest({});
      }
    } else {
      message.error(res?.resultDesc || '失败');
    }
  };

  const getGroupList = async (payload: any) => {
    let params = {
      ...payload,
      groupName: payload?.groupName?.join(','),
      page: payload?.current,
    };
    delete params?.current;
    params.startTime = payload?.createTime?.[0];
    params.endTime = payload?.createTime?.[1];
    delete params?.createTime;
    let res = await groupPage(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const addGroup = () => {
    editUserRef?.current?.open({}, 'addGroup');
  };
  const editGroup = (record: any) => {
    editUserRef?.current?.open(record, 'editGroup');
  };
  const deleteGroup = async (record: any) => {
    let params = {
      id: record?.id,
    };
    let res = await deleteGroupRequest(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      groupActionRef?.current?.reloadAndRest();
      userListRequest({});
    } else {
      const key = `open${Date.now()}`;
      notification.open({
        message: '',
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        description: (
          <Fragment>
            <div>删除失败</div>
            <div>{res?.resultDesc || '该组别存在学员，请先修改学员组别'}</div>
          </Fragment>
        ),
        duration: null,
        key,
        btn: (
          <Button type="primary" size="small" onClick={() => notification.close(key)}>
            知道了
          </Button>
        ),
      });
    }
  };
  const userColumns: any[] = [
    {
      title: '用户账号',
      dataIndex: 'account',
      key: 'account',
      ellipsis: true,
      search: false,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true,
      search: true,
      renderFormItem: () => (
        <Select optionFilterProp="children" showSearch allowClear placeholder="请选择姓名">
          {userList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.userName}>
                {item?.userName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '注册号码',
      dataIndex: 'userCode',
      key: 'userCode',
      search: false,
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ellipsis: true,
      search: false,
    },
    {
      title: '职场',
      dataIndex: 'workPlaceName',
      key: 'workPlaceName',
      ellipsis: true,
      search: false,
    },
    {
      title: '部门组别',
      dataIndex: 'groupName',
      key: 'groupName',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请选择部门组别',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择部门组别"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.groupName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {groupList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.groupName} item={item}>
                {item?.groupName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true,
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'roleIdList',
      hideInTable: true,
      search: true,
      width: 78,
      renderFormItem: () => (
        <Select
          allowClear
          placeholder="请选择"
          mode="multiple"
        >
          {roleList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.roleName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '机构',
      dataIndex: 'organizationId',
      key: 'organizationId',
      ellipsis: true,
      search: false,
      render: (t: any, r: any, i: any) => {
        const { organizationId } = r;
        console.log(1111, organizationList)
        return (
          <span>
            {organizationList.find(item => ('' + item.id) === ('' + organizationId))?.organizationName || ''}
          </span>
        );
      },
    },
    {
      title: '机构',
      dataIndex: 'organizationId',
      hideInTable: true,
      search: true,
      width: 78,
      renderFormItem: () => (
        <Select
          allowClear
          placeholder="请选择"
          mode="multiple"
        >
          {organizationList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.organizationName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '同步时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '同步时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
      search: true,
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['开始时间', '结束时间'],
      },
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        const { roleCode = [] } = r;
        if (roleCode.length === 1 && roleCode[0] === 'admin') return null;
        return (
          <BtnAuth authKey={'paramsManage_userManage_user_edit_btn'}>
            <a onClick={() => editUser(r)}>编辑</a>
          </BtnAuth>
        );
      },
    },
  ];

  const groupColumns: any[] = [
    {
      title: '部门组别',
      dataIndex: 'groupName',
      key: 'groupName',
      ellipsis: true,
      search: true,
      fieldProps: {
        placeholder: '请选择部门组别',
      },
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          mode="multiple"
          placeholder="请选择部门组别"
          filterOption={(input, option) =>
            (option?.item?.groupName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {groupList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.groupName} item={item}>
                {item?.groupName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return r.userName || '-';
      },
    },
    {
      title: '职场',
      dataIndex: 'workPlaceName',
      key: 'workPlaceName',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      search: true,
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <Space>
            <BtnAuth authKey={'paramsManage_userManage_rule_edit_btn'}>
              <a onClick={() => editGroup(r)}>编辑</a>
            </BtnAuth>
            <BtnAuth authKey={'paramsManage_userManage_rule_delete_btn'}>
              <a style={{ color: 'red' }} onClick={() => deleteGroup(r)}>
                删除
              </a>
            </BtnAuth>
          </Space>
        );
      },
    },
  ];

  const organizationColumns: any[] = [
    {
      title: '机构名称',
      dataIndex: 'organizationName',
      key: 'organizationName',
      ellipsis: true,
      search: false,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      search: false,
      // render: (v: any, r: any) => {
      //   return r.userName || '-';
      // },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <Space>
            <BtnAuth authKey={'paramsManage_userManage_rule_edit_btn'}>
              <a onClick={() => editOrganization(r)}>编辑</a>
            </BtnAuth>
            <BtnAuth authKey={'paramsManage_userManage_rule_delete_btn'}>
              <Popconfirm
                title="确定删除吗?"
                onConfirm={() => deleteOrganization(r)}
                okText="确认"
                cancelText="取消"
              >
                <a style={{ color: 'red' }}>
                  删除
                </a>
              </Popconfirm>
            </BtnAuth>
          </Space>
        );
      },
    },
  ];

  // 职场管理 start
  const clickWorkPlaceAdd = () => {
    const params = { actType: 'add', addWorkplaceAct: addWorkplaceAction };
    addWorkplaceModalRef.current.showModal(params);
  };

  const addWorkplaceAction = async (params: any) => {
    const isSuccess = await addWorkPlace(params);
    if (isSuccess) {
      workplaceTableRef?.current?.reloadAndRest();
    }
    return isSuccess;
  };

  const showOrganizationModal = () => {
    const params = { actType: 'add', action: addOrganizationRequest };
    addOrganizationModalRef.current.showModal(params);
  };

  const editOrganization = (record: any) => {
    const params = { actType: 'edit', action: editOrganizationRequest, organInfo: record };
    addOrganizationModalRef.current.showModal(params);
  };

  const getOrganizationList = async (payload: any) => {
    let params = {
      ...payload,
      groupName: payload?.groupName?.join(','),
      page: payload?.current,
    };
    delete params?.current;
    params.startTime = payload?.createTime?.[0];
    params.endTime = payload?.createTime?.[1];
    delete params?.createTime;
    let res = await organizationPageRequest(params);
    return {
      data: res?.data?.list,
      total: res?.data?.totalPage,
      current: payload?.current || 1,
      pageSize: payload?.pageSize || 10,
    };
  };

  const deleteOrganization = async (record: any) => {
    let params = {
      id: record?.id,
    };
    let res = await deleteOrganizationRequest(params);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc || '成功');
      organizationActionRef?.current?.reloadAndRest();
    } else {
      const key = `open${Date.now()}`;
      notification.open({
        message: '',
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        description: (
          <Fragment>
            <div>删除失败</div>
            <div>{res?.resultDesc || '该组别存在学员，请先修改学员组别'}</div>
          </Fragment>
        ),
        duration: null,
        key,
        btn: (
          <Button type="primary" size="small" onClick={() => notification.close(key)}>
            知道了
          </Button>
        ),
      });
    }
  };

  const clickWorkplaceEdit = (info: any) => {
    const params = { actType: 'edit', editWorkplaceAct: editWorkplaceAction, wpInfo: info };
    addWorkplaceModalRef.current.showModal(params);
  };

  const editWorkplaceAction = async (params: any) => {
    const isSuccess = await workPlaceEdit(params);
    if (isSuccess) {
      workplaceTableRef?.current?.reloadAndRest();
    }
    return isSuccess;
  };

  const deleteWorkplaceAction = async (params: any) => {
    const isSuccess = await workPlaceDelete(params);
    if (isSuccess) {
      workplaceTableRef?.current?.reloadAndRest();
    }
    return isSuccess;
  };
  // 职场管理 end

  // 角色管理 start
  const roleColumns: any[] = [
    {
      title: '角色编码',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      ellipsis: true,
      search: true,
      renderFormItem: () => (
        <Select
          optionFilterProp="children"
          showSearch
          allowClear
          placeholder="请选择角色名称"
          mode="multiple"
          filterOption={(input, option) =>
            (option?.item?.roleName as unknown as string)
              ?.toLowerCase()
              ?.includes(input.toLowerCase())
          }
        >
          {roleList?.map((item: any) => {
            return (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.roleName}
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '同步者',
      dataIndex: 'creator',
      key: 'creator',
      ellipsis: true,
      search: false,
      render: (v: any, r: any) => {
        return r.creator || '-';
      },
    },
    {
      title: '同步时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      valueType: 'option',
      render: (t: any, r: any, i: any) => {
        return (
          <BtnAuth authKey={'paramsManage_userManage_role_edit_btn'}>
            <Space>
              <Button type="link" loading={roleLoading} onClick={() => editRole(r)}>
                编辑
              </Button>
            </Space>
          </BtnAuth>
        );
      },
    },
  ];

  const editRole = (record: any) => {
    roleRef?.current?.open(record);
  };

  const roleSameStep = async () => {
    const v = await roleSynch();
    if (v) {
      roleTableRef?.current?.reloadAndRest();
    }
  };
  // 角色管理 end

  const tabChange = (key: any) => {
    if (!['1', '2'].includes(key)) return;
    workPlaceListRequest({ type: +key });
  };

  return (
    <div className={styles.commonTabsSty}>
      <PageContainer
        header={{
          title: '用户管理',
          breadcrumb: {},
        }}
      >
        <Tabs defaultActiveKey="1" onChange={tabChange}>
          {menuBtns?.includes('paramsManage_userManage_user_btn') ? (
            <Tabs.TabPane tab="用户管理" key="1">
              <Spin spinning={loading}>
                <ProTable
                  rowKey={(record: any) => record?.id}
                  actionRef={userActionRef}
                  headerTitle="用户列表"
                  toolBarRender={() => [
                    <BtnAuth authKey={'paramsManage_userManage_user_sameStep_btn'}>
                      <Button type="primary" key="sameStep" onClick={sameStep}>
                        同步
                      </Button>
                    </BtnAuth>,
                  ]}
                  options={false}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  search={{
                    labelWidth: 'auto',
                  }}
                  columns={userColumns}
                  scroll={{ x: userColumns?.length * 150 }}
                  request={async (params = {}, sort, filter) => {
                    return getUserList({ ...params });
                  }}
                />
              </Spin>
            </Tabs.TabPane>
          ) : undefined}
          {menuBtns?.includes('paramsManage_userManage_rule_btn') ? (
            <Tabs.TabPane tab="组别管理" key="2">
              <Spin spinning={loading}>
                <ProTable
                  rowKey={(record: any) => record?.id}
                  actionRef={groupActionRef}
                  headerTitle="组别列表"
                  toolBarRender={() => [
                    <BtnAuth authKey={'paramsManage_userManage_rule_add_btn'}>
                      <Button type="primary" key="sameStep" onClick={() => addGroup()}>
                        新建
                      </Button>
                    </BtnAuth>,
                  ]}
                  options={false}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  search={{
                    labelWidth: 'auto',
                  }}
                  columns={groupColumns}
                  scroll={{ x: groupColumns?.length * 150 }}
                  request={async (params = {}, sort, filter) => {
                    return getGroupList({ ...params });
                  }}
                />
              </Spin>
            </Tabs.TabPane>
          ) : undefined}
          {menuBtns?.includes('paramsManage_userManage_rule_btn') ? (
            <Tabs.TabPane tab="机构管理" key="5">
              <Spin spinning={loading}>
                <ProTable
                  rowKey={(record: any) => record?.id}
                  actionRef={organizationActionRef}
                  search={false}
                  headerTitle="机构列表"
                  toolBarRender={() => [
                    <BtnAuth authKey={'paramsManage_userManage_rule_add_btn'}>
                      <Button type="primary" key="sameStep" onClick={() => showOrganizationModal('add')}>
                        新建
                      </Button>
                    </BtnAuth>,
                  ]}
                  options={false}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  columns={organizationColumns}
                  scroll={{ x: organizationColumns?.length * 150 }}
                  request={async (params = {}, sort, filter) => {
                    return getOrganizationList({ ...params });
                  }}
                />
              </Spin>
            </Tabs.TabPane>
          ) : undefined}
          {menuBtns?.includes('paramsManage_userManage_workplace_btn') ? (
            <Tabs.TabPane tab="职场管理" key="3">
              <Spin spinning={loading}>
                <ProTable
                  rowKey={(record: any) => record?.id}
                  actionRef={workplaceTableRef}
                  headerTitle="职场列表"
                  toolBarRender={() => [
                    <BtnAuth authKey={'paramsManage_userManage_workplace_add_btn'}>
                      <Button type="primary" key="sameStep" onClick={() => clickWorkPlaceAdd()}>
                        新建
                      </Button>
                    </BtnAuth>,
                  ]}
                  options={false}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  search={false}
                  columns={getWorkplaceColumns(clickWorkplaceEdit, deleteWorkplaceAction)}
                  request={async (params = {}, sort, filter) => {
                    return getWorkPlacePage(params);
                  }}
                />
              </Spin>
            </Tabs.TabPane>
          ) : undefined}
          {menuBtns?.includes('paramsManage_userManage_role_btn') ? (
            <Tabs.TabPane tab="角色管理" key="4">
              <Spin spinning={roleLoading}>
                <ProTable
                  rowKey={(record: any) => record?.id}
                  actionRef={roleTableRef}
                  headerTitle="角色列表"
                  toolBarRender={() => [
                    <BtnAuth authKey={'paramsManage_userManage_role_sameStep_btn'}>
                      <Button type="primary" key="sameStep" onClick={() => roleSameStep()}>
                        同步
                      </Button>
                    </BtnAuth>,
                  ]}
                  options={false}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  search={{
                    labelWidth: 'auto',
                  }}
                  columns={roleColumns}
                  scroll={{ x: roleColumns?.length * 150 }}
                  request={async (params = {}, sort, filter) => {
                    return getRolePage(params);
                  }}
                />
                <RoleModal cref={roleRef} loading={roleLoading} comfirmSubmit={comfirmSubmit} />
              </Spin>
            </Tabs.TabPane>
          ) : undefined}
        </Tabs>
        <EditUserModal
          cref={editUserRef}
          loading={loading}
          groupList={groupList}
          workplaceList={workPlaceList}
          comfirmSubmit={comfirmSubmit}
          organizationList={organizationList}
        />
        <AddWorkplaceModal ref={addWorkplaceModalRef} />
        <AddOrganizationModal ref={addOrganizationModalRef} updateData={() => organizationActionRef?.current?.reloadAndRest()} />
      </PageContainer>
    </div>
  );
};

export default UserManage;
