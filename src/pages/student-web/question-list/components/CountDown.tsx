import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import style from '../style.less';

export default function (props: any) {
  const [hour, setHour] = useState<string>('00');
  const [minute, setMinute] = useState<string>('00');
  const [second, setSecond] = useState<string>('00');
  const { cref, totalTime, onTerminate } = props;

  const timeId = useRef<any>(null);
  let remainTime = totalTime;
  const now = Date.now();
  const formatTime = () => {
    const current = Date.now();
    remainTime = Math.ceil((totalTime - (current - now)) / 1000);
    if (remainTime <= 0) {
      clearInterval(timeId.current);
      remainTime = 0;
      onTerminate && onTerminate();
    }
    let h = Math.floor(remainTime / 3600);
    const hours = h < 10 ? '0' + h : String(h);
    setHour(hours);
    let m = (Math.floor(remainTime / 60)) % 60;
    const minutes = m < 10 ? '0' + m : String(m);
    setMinute(minutes);
    let s = remainTime % 60;
    const seconds = s < 10 ? '0' + s : String(s);
    setSecond(seconds);
  }
  const clear = () => {
    timeId.current && clearInterval(timeId.current);
    console.log('成功清除计时器');
  }

  useEffect(() => {
    if (totalTime === 0) return;
    timeId.current = setInterval(() => {
      formatTime();
    }, 50);
    return clear;
  }, [totalTime]);

  useImperativeHandle(cref, () => ({
    clear: () => {
      clear();
    },
  }));

  return (
    <div className={style["countdown-box"]}>
      <h3 className={style.tle}>剩余答题时间</h3>
      <div className={style.countdown}>
        <div className={style["cell-box"]}>
          <div className={style.cell}>{hour}</div>
          <div className={style.unit}>时</div>
        </div>
        <div className={style["cell-box"]}>
          <div className={style.split}>:</div>
        </div>
        <div className={style["cell-box"]}>
          <div className={style.cell}>{minute}</div>
          <div className={style.unit}>分</div>
        </div>
        <div className={style["cell-box"]}>
          <div className={style.split}>:</div>
        </div>
        <div className={style["cell-box"]}>
          <div className={style.cell}>{second}</div>
          <div className={style.unit}>秒</div>
        </div>
      </div>
    </div>
  )
}