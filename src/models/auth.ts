import { useState } from 'react';
import { useModel } from 'umi';

export default function useAuthModel() {
  // 初始化信息
  const { initialState } = useModel('@@initialState');

  const { userAuth = [] }: any = initialState || {};

  console.log('userAuth', userAuth);

  return {
    isLeader: userAuth?.includes('RISK_MANAGER'),
    isDeveloper: userAuth?.includes('RISK_MODEL_DEVELOPER'),
    userAuth,
    isLeaderDisabled: userAuth?.includes('RISK_MANAGER'),
  };
}
