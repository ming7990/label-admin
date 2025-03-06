import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import AudioPlay from './audioPlay';
import robotPhoto from '@/asset/image/ours-avator.png';
import style from './style.less';
import styles from './index.less';
import config from '@/config';

// 关键点提醒
const KeyTipsHtml: React.FC<any> = (props: any) => {
  const { list, courseTypeName } = props;

  if (!Array.isArray(list)) {
    return null;
  }

  return (
    <div className={style['keys-box']}>
      {list.map((subItem: any, i: number) => {
        let icon =
          subItem?.isPass == '1' ? (
            <CheckCircleOutlined style={{ color: '#20C783', marginRight: '8px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: '#FF6065', marginRight: '8px' }} />
          );

        return (
          <div className={style['key-row']} key={i}>
            <div className={style['icon']}>{icon}</div>
            <div className={style['icon']}>{courseTypeName}</div>
            <div className={style['desc']}>{subItem?.keyPointName || '--'}</div>
          </div>
        );
      })}
    </div>
  );
};

const RightChatContent: React.FC<any> = (props: any) => {
  const { status, text, keysTips, showAvator, errorIndexList, id, courseTypeName } = props;

  return (
    <div className={style['box_system']}>
      <div className={style['box-icon']}>
        {status === '1' && <LoadingOutlined style={{ color: '#4878FF', marginRight: '8px' }} />}
        {status === '0' && <CheckCircleOutlined style={{ color: '#20C783', marginRight: '5px' }} />}
      </div>
      <div>
        <div className={style.audioBox}>
          <AudioPlay
            musicSrc={
              process.env.mock
                ? '/ai-teach/mp3/story.mp3'
                : `${config.basePath}/services/stu/course/fragment/listen?dialogueId=${id}`
            }
          />
        </div>
        <div className={style['box-content_sys']}>{text}</div>
        <div className={styles.keyBox}>
          <div>
            {errorIndexList?.map((item: any) => {
              return (
                <div className={styles.sortNum} key={item}>
                  {item}
                </div>
              );
            })}
          </div>
          <KeyTipsHtml list={keysTips} courseTypeName={courseTypeName} />
        </div>
      </div>
      <div className={style['box-avator']}>
        {showAvator && <img className={style['avator']} src={robotPhoto} alt="我方" />}
      </div>
    </div>
  );
};

export default RightChatContent;
