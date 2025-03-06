import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import DelayTextInput from './delay-text';
import DelayTime from './delay-time';
import RightChatContent from './chat-right';
import style from './style.less';

// 头像
import customerPhoto from '@/asset/image/customer.png';
import robotPhoto from '@/asset/image/robot.png';

// 消息盒子
const MessageBox: React.FC<any> = (props: any) => {
  const { cref, showIcon = true } = props;

  const [list, setList] = useState<any[]>([]);

  useImperativeHandle(cref, () => ({
    init: (l: any) => {
      if (Array.isArray(l)) {
        setList([...l]);
      } else {
        setList([]);
      }
    },
    push: (item: any) => {
      list.push(item);
      setList([...list]);
    },
    pop: () => {
      list.pop();
      setList([...list]);
    },
    clear: () => {
      setList([]);
    },
  }));

  return (
    <>
      {list.map((item: any, index: any) => {
        const lastType: any = index >= 1 ? list[index - 1]?.type : null;

        // type 类型  // 类型
        // text 文本内容
        // keysTips 关键点提示 （flag， desc）
        // delay 该话读完需要的秒数
        // status  （loading 加载 / success 回答完全答对 / fail 有关键点没提到）

        const { type, text, role, keysTips, intents, delay = 0, status } = item;

        if (type === 'customer') {
          //// 左边内容
          return (
            <div className={style['box_customer']} key={index}>
              <div className={style['box-avator']}>
                {lastType !== type && (
                  <img className={style['avator']} src={customerPhoto} alt="客方"></img>
                )}
              </div>
              <div className={style['box-bg']}>
                <DelayTime text={text} delay={delay} />
                <div className={`${style['box-content']}`}>
                  <DelayTextInput text={text} delay={delay}></DelayTextInput>
                </div>
              </div>
            </div>
          );
        } else if (type === 'student') {
          // 右边内容
          return (
            <RightChatContent
              showIcon={showIcon}
              key={index}
              status={status}
              text={text}
              keysTips={keysTips}
              intents={intents}
              showAvator={lastType !== type}
            />
          );
        } else if (type === 'system') {
          // 中间提示
          return (
            <div className={style['box_tips']} key={index}>
              <div className={style['box_tips_text']}>{text}</div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default MessageBox;
