import { useState, useImperativeHandle, Fragment } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  message,
  Checkbox,
  Space,
  Tree,
  Avatar,
  Spin,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRoleManageModel } from '../role-manage/model';
import routers from '../../../../../config/routes';
import styles from './../index.less';
export default (props: any) => {
  const { cref, groupList, workplaceList, comfirmSubmit } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>({});

  const [checkedKeys, setCheckedKeys] = useState<any>([]);
  const [halfChecked, setHalfChecked] = useState<any>([]);
  const { loading, savePermission, getPermission } = useRoleManageModel();

  useImperativeHandle(cref, () => ({
    open: (record: any) => {
      form.resetFields();
      setCheckedKeys([]);
      getPermission({ id: record.id }).then((data) => {
        if (data.result) {
          setVisible(true);
          setRowData(record);
          setCheckedKeys(data.data.menuCodes);
          setHalfChecked(data.data.codes);
        }
      });
    },
    close: onClose,
  }));

  const getTreeData = async (id: any) => {
    const data = await getPermission({ id });
    setCheckedKeys(data);
  };

  const roleSave = async () => {
    const b = await savePermission({ id: rowData.id, menuCodes: checkedKeys, codes: halfChecked });
    if (b) {
      setVisible(false);
    }
  };

  const onClose = () => {
    // form.resetFields();
    setVisible(false);
  };

  const treeData = (menus: any[]): any[] => {
    const newMenus = menus.filter((item) => item.access && item.access === 'routerAuth');
    return newMenus.map((router: any) => {
      if (router.btnMenu) {
        return {
          title: router.roleName ? router.roleName : router.name,
          key: router.path,
          children: router.btnMenu,
        };
      }
      return {
        title: router.roleName ? router.roleName : router.name,
        key: router.path,
        children: router.routes ? treeData(router.routes) : [],
      };
    });
  };
  const onCheck = (checkedKeysValue: any[], e: any) => {
    setCheckedKeys(checkedKeysValue);
    setHalfChecked(e.halfCheckedKeys);
  };

  return (
    <Spin spinning={loading}>
      <Drawer
        title={'权限配置'}
        placement="right"
        onClose={onClose}
        width={500}
        visible={visible}
        footer={
          <Space align="baseline" style={{ float: 'right' }}>
            <Button onClick={onClose} loading={loading}>
              取消
            </Button>
            <Button type="primary" loading={loading} onClick={roleSave}>
              保存
            </Button>
          </Space>
        }
        className={styles['drawer']}
      >
        <div className={styles['tree-content']}>
          <Avatar
            shape="square"
            size="large"
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#1890ff',
            }}
          />
          <span className={styles['title']}>{rowData.roleName || ''}</span>
        </div>
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={{ checked: checkedKeys, halfChecked: halfChecked }}
          treeData={treeData(routers)}
        />
      </Drawer>
    </Spin>
  );
};
