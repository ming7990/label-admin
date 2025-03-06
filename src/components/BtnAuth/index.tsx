import React from 'react';

import { useModel } from 'umi';

interface dataProp {
  children: any;
  authKey: any;
}

const BtnAuth: React.FC<dataProp> = (props) => {
  // 用户信息
  const { initialState } = useModel('@@initialState');
  const { userInfoAll } = (initialState?.currentUser as any) || {};
  const { menuBtns } = userInfoAll || {};

  const authKey = props['authKey'];
  const rif = authKey ? menuBtns?.includes(authKey) : false;
  const children = props.children;

  return rif ? <>{children}</> : null;
};

export default BtnAuth;
