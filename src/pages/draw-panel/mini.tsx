import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect, Menu, Control } from '@logicflow/extension';
// 样式
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import { useModel } from 'umi';
import { Button, message } from 'antd';
import style from './style.less';
import { registerNode2 } from './components/node';

import { setMenuConfig, setControlConfig, checkEdge } from './config';

// 首页
const MiniDrawPanel: React.FC<any> = (props: any) => {
  const { cref, addNode = () => true, deleteNode = () => true } = props;

  // const { initialState, setInitialState } = useModel('@@initialState');

  // const curLf: any = useRef<any>(null);
  const drawDomRef: any = useRef<any>(null);
  const drawPanelRef: any = useRef<any>(null);
  const [curLf, setLf] = useState<any>(null);

  // -------

  //初始化
  const init = () => {
    const lf: any = new LogicFlow({
      container: drawDomRef.current,
      plugins: [SelectionSelect, Control],
      grid: false,
      adjustNodePosition: false,
      edgeType: 'line',
    });
    // 节点注册
    registerNode2(lf);
    console.log('节点注册');
    // 赋值到curLf
    setLf(lf);
    setControlConfig(lf);
    lf.zoom(0.8);
    lf.translate(-150, 100);
    // ----
    drawPanelRef.current = lf;
  };

  useImperativeHandle(cref, () => ({
    initPanel: (data: any) => {
      console.log(data, 'initPanel');
      const odata = JSON.parse(JSON.stringify(data));
      const { edges } = data || {};
      const onodes = data.nodes || [];
      const nodes = onodes.filter((item: any) => !['customer', 'customerIntent'].includes(item.type));
      // 不展示客户节点
      onodes.filter((item: any) => item.type === 'customer' || item.type === 'customerIntent').forEach((item: any) => {
        const sindex = edges.findIndex(((e: any) => e.sourceNodeId === item.id));
        const tindex = edges.findIndex(((e: any) => e.targetNodeId === item.id));
        if (tindex !== -1) {
          // 更改终点信息;
          edges[tindex].pointsList.push(...edges[sindex].pointsList);
          edges[tindex].startPoint = edges[tindex].pointsList[0];
          edges[tindex].endPoint = edges[tindex].pointsList[1];
          edges[tindex].targetNodeId = edges[sindex].targetNodeId;
        }

        if (sindex !== -1) {
          edges.splice(sindex, 1); // 删掉以它为原点的线条;
        }
      });
      const _data = { nodes, edges };
      if (drawPanelRef.current) {
        // console.log(curLf);
        try {
          drawPanelRef.current?.render(_data || {});
        } catch (error) {
          drawPanelRef.current?.render(odata || {});
        }
      }
    },
    getLf: () => {
      return curLf;
    },
  }));

  useEffect(() => {
    // 初始化画布
    init();
  }, []);

  return (
    <div className={style['mini-box_bg']}>
      <div id="mini-box" ref={drawDomRef} className={style['mini-box']}></div>
    </div>
  );
};

export default MiniDrawPanel;
