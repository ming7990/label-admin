import { outLogin } from '@/services/ant-design-pro/api';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

import userPic from './user.png';
import userPic1 from './user1.png';

const { confirm } = Modal;

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  window.location.href = '/ai-teach/logout';
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      console.log('dropdown menu-click');
      const { key } = event;
      if (key === 'logout') {
        confirm({
          title: '是否确认退出登录?',
          icon: <ExclamationCircleOutlined />,
          onOk() {
            setInitialState((s: any) => ({ ...s, currentUser: undefined }));
            loginOut();
          },
          onCancel() {},
        });
        return;
      } else if (key === 'login') {
        // history.push(`/login`);
        if (process.env.UMI_ENV == 'dev') {
          history.push(`/login`);
        } else {
          window.location.href = '/ai-teach/login';
        }
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser }: any = initialState;

  // console.log(currentUser);

  if (!currentUser || !currentUser.userName) {
    return loading;
  }

  const menuItems: ItemType[] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const overMenu = (
    <Menu className={styles.menu} onClick={onMenuClick}>
      <Menu.Item key={'logout'}>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={overMenu}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser.avatar || userPic1}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>
          {currentUser.userName + ` (${currentUser.userCode})`}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
