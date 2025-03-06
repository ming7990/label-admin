import React, { useEffect, useState } from 'react';
import style from './style.less';

const Process: React.FC<any> = (props: any) => {
  const { percent } = props;

  return (
    <div className={style['process-bg']}>
      <div className={style['process-bar']} style={{ width: percent * 100 + '%' }} />
    </div>
  );
};

export default Process;
