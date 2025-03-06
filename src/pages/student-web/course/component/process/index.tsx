import React, { useEffect, useState } from 'react';
import style from './style.less';
import config from '@/config';
import Condition from '@/components/Condition';

const { basePath } = config;

const Process: React.FC<any> = (props: any) => {
  const { percent } = props;

  return (
    <div className={style['process-bg']}>
      <div className={style['process-bar']} style={{ width: percent * 100 + '%' }} />
    </div>
  );
};

export default Process;
