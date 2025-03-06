import React, { useEffect, useRef, useState } from 'react';

import style from './style.less';

function formate(time: any) {
  if (!time) {
    return '00:00';
  }
  time = parseInt(time as any as string);
  let second: any = time % 60;
  let min: any = parseInt((time / 60) as any as string);
  second = second < 10 ? '0' + second : second;
  min = min < 10 ? '0' + min : min;
  return min + ':' + second;
}

const DelayTime: React.FC<any> = (props: any) => {
  const [type, setType] = useState<any>('finish');

  const [width, setWidth] = useState<any>(0);
  const [time, setTime] = useState<any>(0);

  const { text, delay } = props;

  const textRef: any = useRef<any>({});

  const startDelayShow = (str: any, d: number) => {
    let strLen: any = str.length;
    if (strLen === 0) {
      return;
    }

    let delaytime = (d * 1000) / strLen; // d是秒数;

    delaytime = delaytime > 100 ? delaytime : 100;
    setType('loading');
    textRef.current.timer = setInterval(() => {
      try {
        textRef.current.i++;
        let width = textRef.current.i / strLen;
        setWidth(width);
        setTime(width * delay);
        if (textRef.current.i === strLen) {
          clearInterval(textRef.current.timer);
          setType('finish');
        }
      } catch (e) {
        clearInterval(textRef.current.timer);
      }
    }, delaytime);
  };

  useEffect(() => {
    clearInterval(textRef.current.timer);
    if (text.length === 0 || delay === 0) {
      setWidth(0);
      setType('finish');
    } else {
      textRef.current.i = 0;
      startDelayShow(text, delay);
    }
  }, [text, delay]);

  if (text.length === 0 || delay === 0) {
    return null;
  }

  return (
    <div className={style['delay-timer_bg']}>
      <div className={style['delay-bar_bg']}>
        <div className={style['delay-bar']} style={{ width: width * 100 + '%' }}></div>
      </div>

      <div className={style['delay-text']}>
        <span> {formate(time)}</span>
        <span> / </span>
        <span> {formate(delay)}</span>
      </div>
    </div>
  );
};

export default DelayTime;
