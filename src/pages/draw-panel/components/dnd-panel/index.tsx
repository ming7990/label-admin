import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import style from './index.less';

const shapeList: any = [
  {
    type: 'start',
    text: '开始节点',
  },
  {
    type: 'student',
    text: '学员节点',
  },
  {
    type: 'customer',
    text: '客户节点',
  },
  {
    type: 'finish',
    text: '结束节点',
  },
];

const DndDiyPanel: React.FC<any> = (props: any) => {
  // 鼠标点击事件
  const { lf } = props;

  const mouseDown = (shape: any) => {
    // 开始节点只允许创建一个
    // 结束节点只允许创建一个

    //
    const { nodes } = lf.graphModel;
    console.log('节点 创建nodes:', shape);

    if (
      shape.type === 'start'
      // || shape.type === 'finish'
    ) {
      let node = nodes.find((item: any) => item.type === shape.type);

      if (node) {
        message.warn(`${shape.type === 'start' ? '开始' : '结束'}节点已存在，不能重复创建`);
        return;
      }
    }

    lf.dnd.startDrag({
      type: shape.type,
      text: `${shape.text}`,
      properties: {
        text: `${shape.text}`,
      },
    });
  };

  return (
    <div className={style['panel']}>
      {shapeList.map((shape: any) => {
        const { type, text } = shape;
        return (
          <div key={type}>
            <div
              className={style['panel-item']}
              onMouseDown={() => {
                mouseDown(shape);
              }}
            >
              <div className={style['panel-bg']}>
                <div className={style[`panel-${type}`]} />
              </div>

              <div className={style['panel-title']}>{text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DndDiyPanel;
