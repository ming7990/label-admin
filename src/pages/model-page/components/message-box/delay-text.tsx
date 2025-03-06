import React, { useEffect, useRef, useState } from 'react';

import style from './style.less';

const DelayTextInput: React.FC<any> = (props: any) => {
  const [type, setType] = useState<any>('finish');

  const { text = '', delay = 0 } = props;

  const [delayText, setDelayText] = useState<any>('');

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
        let char = str.charAt(textRef.current.i);
        textRef.current.text = textRef.current.text + char;
        textRef.current.i++;
        setDelayText(textRef.current.text);
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
      setDelayText(text);
      setType('finish');
    } else {
      textRef.current.text = '';
      textRef.current.i = 0;
      startDelayShow(text, delay);
    }
  }, [text, delay]);

  return (
    <div className={style['delay-text']}>
      {delayText} {type === 'loading' ? <span className={style['typing-cursor']}>|</span> : ''}
    </div>
  );
};

export default DelayTextInput;
