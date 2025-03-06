import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import robotPhoto from '@/asset/image/ours-avator.png';
import style from './style.less';

// 关键点提醒
const KeyTipsHtml: React.FC<any> = (props: any) => {
  const { list } = props;

  if (!Array.isArray(list)) {
    return null;
  }

  return (
    <div className={style['keys-box']}>
      {list.map((subItem: any, i: number) => {
        let icon = subItem?.flag ? (
          <CheckCircleOutlined style={{ color: '#20C783', marginRight: '8px' }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#FF6065', marginRight: '8px' }} />
        );

        if (subItem && typeof subItem.flag !== 'boolean') {
          icon = <LoadingOutlined style={{ color: '#4878FF', marginRight: '8px' }} />;
        }

        return (
          <div className={style['key-row']} key={i}>
            <div className={style['icon']}>{icon}</div>
            <div className={style['icon']}>关键点：</div>
            <div className={style['desc']}>{subItem?.desc || '--'}</div>
          </div>
        );
      })}
    </div>
  );
};

// 意图提醒
const IntentsHtml: React.FC<any> = (props: any) => {
  const { list } = props;

  if (!Array.isArray(list)) {
    return null;
  }

  return (
    <div className={style['keys-box']}>
      {list.map((subItem: any, i: number) => {
        let icon = subItem?.flag ? (
          <CheckCircleOutlined style={{ color: '#20C783', marginRight: '8px' }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#FF6065', marginRight: '8px' }} />
        );

        if (subItem && typeof subItem.flag !== 'boolean') {
          icon = <LoadingOutlined style={{ color: '#4878FF', marginRight: '8px' }} />;
        }

        return (
          <div className={style['key-row']} key={i}>
            <div className={style['icon']}>{icon}</div>
            <div className={style['icon']}>意图：</div>
            <div className={style['desc']}>{subItem?.intent || '--'}</div>
          </div>
        );
      })}
    </div>
  );
};

const RightChatContent: React.FC<any> = (props: any) => {
  const { status, text, keysTips, intents, showAvator, showIcon = true } = props;

  return (
    <div className={style['box_system']}>
      <div className={style['box-icon']}>
        {status === 'loading' && showIcon && (
          <LoadingOutlined style={{ color: '#4878FF', marginRight: '8px' }} />
        )}
        {status === 'success' && showIcon && (
          <CheckCircleOutlined style={{ color: '#20C783', marginRight: '8px' }} />
        )}
      </div>
      <div>
        <div className={style['box-content_sys']}>{text}</div>
        {keysTips ? (
          <KeyTipsHtml list={keysTips}></KeyTipsHtml>
        ) : (
          <IntentsHtml list={intents}></IntentsHtml>
        )}
      </div>
      <div className={style['box-avator']}>
        {showAvator && <img className={style['avator']} src={robotPhoto} alt="我方"></img>}
      </div>
    </div>
  );
};

export default RightChatContent;
