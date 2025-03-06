import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useModel } from 'umi';
import style from './style.less';
import logo from '@/asset/image/homelogo.png';

// 首页
const Home: React.FC = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {}, []);

  return (
    <div className={style['image-bg']}>
      <img src={logo} className={style['image']} />
    </div>
  );
};

export default Home;
