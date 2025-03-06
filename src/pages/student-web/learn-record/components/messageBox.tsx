import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import DelayTextInput from '@/pages/chat-page/components/message-box/delay-text';
// import DelayTime from './delay-time';
import AudioPlay from './audioPlay';
import RightChatContent from './rightContent';
import style from './style.less';
import styles from './index.less';
import config from '@/config';

// 头像
import customerPhoto from '@/asset/image/customer.png';
import robotPhoto from '@/asset/image/robot.png';

// 消息盒子
const MessageBox: React.FC<any> = (props: any) => {
  const { cref } = props;

  const [list, setList] = useState<any[]>([]);

  useImperativeHandle(cref, () => ({
    init: (l: any) => {
      setList([...l]);
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
        const lastType: any = index >= 1 ? list[index - 1]?.role : null;

        // role 类型  // 类型
        // text 文本内容
        // keysTips 关键点提示 （flag， desc）
        // delay 该话读完需要的秒数
        // status  （loading 加载 / success 回答完全答对 / fail 有关键点没提到）

        const {
          role,
          text,
          keyPointList,
          courseTypeName,
          delay = 0,
          status,
          errorIndexList,
        } = item;

        if (role === 'customer') {
          //// 左边内容
          return (
            <div className={style['box_customer']} key={index}>
              <div className={style['box-avator']}>
                {lastType !== role && (
                  <img className={style['avator']} src={customerPhoto} alt="客方" />
                )}
              </div>
              <div className={style['box-bg']}>
                {/* <DelayTime text={text} delay={delay} /> */}
                <div className={style.audioBox}>
                  <AudioPlay
                    musicSrc={
                      process.env.mock
                        ? '/ai-teach/mp3/story.mp3'
                        : `${config.basePath}/services/stu/course/fragment/listen?dialogueId=${item?.id}`
                    }
                  />
                </div>
                <div className={`${style['box-content']}`}>
                  <DelayTextInput text={text} delay={delay} />
                </div>
              </div>
            </div>
          );
        } else if (role === 'student') {
          // 右边内容
          return (
            <RightChatContent
              key={index}
              errorIndexList={item?.errorIndexList}
              status={item?.actionAccess}
              id={item?.id}
              text={text}
              keysTips={keyPointList}
              courseTypeName={courseTypeName}
              showAvator={lastType !== role}
            />
          );
        } else if (role === 'system') {
          // 中间提示
          return (
            <div className={style['box_tips']} key={index}>
              {errorIndexList?.map((item: any) => {
                return (
                  <div className={styles.sortNum} key={item}>
                    {item}
                  </div>
                );
              })}
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
