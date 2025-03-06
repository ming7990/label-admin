import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

import style from './style.less';

// 消息盒子
const TipsBox: React.FC<any> = (props: any) => {
  const { tips } = props;

  return (
    <div className={style['tips-box_bg']}>
      <div className={style['tips-box']}>{tips}</div>
    </div>
  );
};

export default TipsBox;
