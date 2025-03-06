import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result status="404" title="404" subTitle="无效访问" extra={<></>} />
);

export default NoFoundPage;
