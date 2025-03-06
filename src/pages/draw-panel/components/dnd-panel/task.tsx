import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import style from './index.less';

const shapeList: any = [
  {
    type: 'course',
    text: '课程节点',
  },
  {
    type: 'task',
    text: '任务节点',
  },
  {
    type: 'step',
    text: '步骤节点',
  },
];

const StudentDiyPanel: React.FC<any> = (props: any) => {
  // 鼠标点击事件
  const { lf } = props;

  const mouseDown = (shape: any) => {
    // 开始节点只允许创建一个
    // 结束节点只允许创建一个
    const { nodes } = lf.graphModel;
    console.log('节点 创建nodes:', shape);

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
                <div className={style[`panel-${type}`]}></div>
              </div>

              <div className={style['panel-title']}>{text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentDiyPanel;
