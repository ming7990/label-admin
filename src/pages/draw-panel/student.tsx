import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect, Menu, Control } from '@logicflow/extension';
// 样式
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import { useModel } from 'umi';
import { Button, message } from 'antd';
import style from './style.less';
import { registerNode } from './components/node/student';

import { setMenuConfig, setControlConfig, checkEdge } from './config';
import Condition from '@/components/Condition';

// 首页
const DrawPanel: React.FC<any> = (props: any) => {
  const {
    cref,
    isSilentMode = false,
    preMenu, // 菜单左侧
    extraMenu, // 菜单右侧
    onSave,
    onNodeDbClick,
    onEdgeDbClick,
    addNode = () => true,
    deleteNode = () => true,
    onExtraEvent,
  } = props;

  // const { initialState, setInitialState } = useModel('@@initialState');

  // const curLf: any = useRef<any>(null);
  const drawDomRef: any = useRef<any>(null);
  const drawPanelRef: any = useRef<any>(null);
  const [curLf, setLf] = useState<any>(null);

  // -------

  // 事件监听

  const addEvent = (lf: any) => {
    const { eventCenter } = lf.graphModel;

    // 双击节点
    eventCenter.on('node:dbclick', (info: any) => {
      const { data, e, position } = info;
      console.log('node:dbclick', data, e, position);
      onNodeDbClick?.(data);
    });
    // 双击连线
    eventCenter.on('edge:dbclick', (info: any) => {
      const { data, e } = info;
      console.log('edge:dbclick', data, e);
      onEdgeDbClick?.(data);
    });

    // 拖动节点创建
    eventCenter.on('node:dnd-add', async (e: any) => {
      console.log(e);
      // 测试删除节点 // 调接口
      if (e.data.type === 'student') {
        // lf.deleteNode(e.data.id);
      }
      let res: any = await addNode(e.data);
      if (!res) {
        lf.deleteNode(e.data.id);
      }
    });

    // 拖动节点创建
    eventCenter.on('edge:add', async (e: any) => {
      console.log(e);
      // 测试删除节点 // 调接口
      // if (e.data.type === 'student') {
      //   // lf.deleteEdge(e.data.id);
      // }
    });

    eventCenter.on('step-tips:button-click', async (data: any) => {
      onExtraEvent?.('step-tips:button-click', data);
    });
  };

  //初始化
  const init = () => {
    const lf: any = new LogicFlow({
      container: drawDomRef.current,
      plugins: [DndPanel, SelectionSelect, Menu, Control],
      // grid: true,
      isSilentMode: isSilentMode,
      edgeType: 'polyline',
    });
    // 节点注册
    registerNode(lf, {
      isSilentMode,
    });
    console.log('节点注册');
    // 赋值到curLf
    setLf(lf);
    setControlConfig(lf);
    // 设置菜单
    setMenuConfig(lf, {
      isSilentMode,
      deleteNode,
    });
    // 添加监听事件
    addEvent(lf);

    lf.setTheme({
      nodeText: {
        overflowMode: 'autoWrap',
      },
      baseEdge: {
        stroke: '#AAB7C4',
        strokeWidth: 1,
      },
    });
    // ----
    drawPanelRef.current = lf;
  };

  // 保存
  const _save = () => {
    const { nodes, edges } = curLf.getGraphData();
    // console.log('信息保存');
    // console.log(nodes, edges);
    onSave?.({ nodes, edges });
  };

  useImperativeHandle(cref, () => ({
    initPanel: (data: any) => {
      if (drawPanelRef.current) {
        // console.log(curLf);
        drawPanelRef.current?.render(data || {});
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
    <div className={style['draw-box_bg']}>
      <Condition r-if={!isSilentMode}>
        <div className={style['menu-box']}>
          <div className={style['content_left']}>{preMenu}</div>
          <div className={style['content_right']}>
            <Condition r-if={!isSilentMode}>
              <Button className={style['bt-item']}>校验</Button>
              <Button className={style['bt-item']} type="primary" onClick={_save}>
                保存
              </Button>
            </Condition>
            {extraMenu}
          </div>
        </div>
      </Condition>
      {/* ------ 拖动面板 ------ */}
      <div id="draw-box" ref={drawDomRef} className={style['draw-box']}></div>
    </div>
  );
};

export default DrawPanel;
