import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect, Menu, Control } from '@logicflow/extension';
// 样式
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import { useModel } from 'umi';
import { Button, message } from 'antd';
import style from './style.less';
import DndDiyPanel from './components/dnd-panel/task';
import { registerNode } from './components/node/task';

import { setMenuConfig, setControlConfig, checkEdge } from './config';
import Condition from '@/components/Condition';

// 首页
const DrawPanel: React.FC<any> = (props: any) => {
  const {
    cref,
    maxLen = 16, // 修改文本最大字数
    preMenu, // 菜单左侧
    extraMenu, // 菜单右侧
    onSave,
    onNodeDbClick,
    onEdgeDbClick,
    addNode = () => true,
    deleteNode = () => true,
    onExtraEvent,
    isSilentMode = false,
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
      // console.log('node:dbclick', data, e, position);
      if (isSilentMode) {
        return;
      }
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

      // if (!checkEdge(e.data, lf)) {
      //   lf.deleteEdge(e.data.id);
      //   message.warning('同个节点不能作为2个节点的出口');
      // }
      // 测试删除节点 // 调接口
      // if (e.data.type === 'student') {
      // lf.deleteEdge(e.data.id);
      // }
    });

    eventCenter.on('text:update', async (data: any) => {
      const _lf = drawPanelRef.current;
      // console.log(data);
      const obj = _lf.getProperties(data.id);
      const text = obj.text || '';
      const newText = data.text || '';
      if (newText.length > maxLen) {
        _lf.updateText(data.id, text);
        message.warning('修改文本超度不能超过' + maxLen + '字数');
      } else {
        _lf.setProperties(data.id, {
          text: newText,
        });
        onExtraEvent?.('text:update', data);
      }
    });
  };

  const getDeepNode: (id: any) => any = (id: any) => {
    const _lf = drawPanelRef.current;
    const edges = _lf.getNodeEdges(id) || []; // 获取所有连线
    let _edges = edges
      .filter((item: any) => item.sourceNodeId === id)
      .map((item: any) => item.targetNodeId);
    // console.log(_lf, _lf.getNodeModelById);
    if (_edges.length === 0) {
      const node = _lf.getNodeModelById(id);
      console.log(node);
      return node;
    } else if (_edges.length === 1) {
      console.log('继续走:' + _edges[0]);
      return getDeepNode(_edges[0]);
    } else {
      return null;
    }
  };

  // 添加子任务
  const addSubTask = async (node: any) => {
    const _lf = drawPanelRef.current;
    const { nodes, edges } = _lf.getGraphData();

    let reg = /^任务节点[0-9]+$/;
    let maxNew = nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(4))
      ?.sort((a: any, b: any) => b - a)?.[0];

    let newInfo: any = {
      type: 'task',
      x: node.x - 200 < 250 ? 250 : node.x - 200,
      y: node.y + 140,
      text: `任务节点${maxNew ? Number?.(maxNew) + 1 : 1}`,
    };
    // 找到所有连线
    let _edges = edges
      .filter((item: any) => item.sourceNodeId === node.id)
      .map((item: any) => item.targetNodeId);
    // 找到对应对应节点
    let _nodes = _edges.map((item: any) => _lf.getNodeModelById(item));
    if (_edges.length === 0) {
      // 添加节点 ----可能要调接口
    } else {
      let max = _nodes?.[0]?.x;
      _nodes.forEach((item: any) => {
        if (item.x > max) {
          max = item.x;
        }
      });
      newInfo.x = max + 350;
    }

    let _node = _lf.getNodeModelById(node.id);
    // 添加节点
    let newNode = _lf.addNode(newInfo);

    let aAnchor = _node.getDefaultAnchor()[2];
    let bAnchor = newNode.getDefaultAnchor()[0];
    // 添加连线
    let newLine = _lf.addEdge({
      sourceNodeId: node.id,
      targetNodeId: newNode.id,
      startPoint: {
        ...aAnchor,
      },
      endPoint: {
        ...bAnchor,
      },
      type: 'polyline',
    });
    addSubStep(newNode);
  };
  // 添加子步骤
  const addSubStep = (node: any) => {
    const _lf = drawPanelRef.current;
    const { nodes, edges } = _lf.getGraphData();
    console.log(node);
    let _edges = edges
      .filter((item: any) => item.sourceNodeId === node.id)
      .map((item: any) => item.targetNodeId);
    console.log(_edges);
    let parentNode = null;
    if (_edges.length === 0) {
      console.log('0');
      parentNode = _lf.getNodeModelById(node.id);
    } else if (_edges.length === 1) {
      console.log('1');
      parentNode = getDeepNode(_edges[0]);
    } else {
      console.log('2');
      parentNode = null;
    }
    if (node.type == 'step') {
      parentNode = _lf.getNodeModelById(node.id);
    }

    console.log('parentNode:', parentNode);

    if (!parentNode) {
      return;
    }

    let reg = /^课程名称[0-9]+$/;
    let maxNew = nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(4))
      ?.sort((a: any, b: any) => b - a)?.[0];

    let newInfo: any = {
      type: 'step',
      x: parentNode.x,
      y: parentNode.y + 140,
      text: `课程名称${maxNew ? Number?.(maxNew) + 1 : 1}`,
    };

    let newNode = _lf.addNode(newInfo);
    //连向下一级的线
    let nodeLine = edges.find((item: any) => item.sourceNodeId == node.id);
    //位移操作
    if (node.type == 'step' && nodeLine) {
      let bAnchor = newNode.getDefaultAnchor()[2];
      _lf.addEdge({
        sourceNodeId: newNode.id,
        targetNodeId: nodeLine?.targetNodeId,
        startPoint: {
          ...bAnchor,
        },
        endPoint: {
          ...nodeLine?.endPoint,
        },
        type: 'polyline',
      });
      moveNode(_lf, node);
      _lf.deleteEdge(nodeLine.id);
    }

    let aAnchor = parentNode.getDefaultAnchor()[2];
    let bAnchor = newNode.getDefaultAnchor()[0];
    // 添加连线
    let newLine = _lf.addEdge({
      sourceNodeId: parentNode.id,
      targetNodeId: newNode.id,
      startPoint: {
        ...aAnchor,
      },
      endPoint: {
        ...bAnchor,
      },
      type: 'polyline',
    });
  };

  const moveNode = (lf: any, node: any) => {
    const { nodes, edges } = lf.graphModel;
    //连向下一级的线
    let nodeLine = edges.find((item: any) => item.sourceNodeId == node.id);
    if (!nodeLine) {
      return;
    }
    //连向下一级的节点
    let nextNode = nodes.find((item: any) => item.id == nodeLine?.targetNodeId);
    lf?.graphModel.moveNode?.(nextNode?.id, 0, 140, true);
    moveNode(lf, nextNode);
  };

  //初始化
  const init = () => {
    const lf: any = new LogicFlow({
      container: drawDomRef.current,
      plugins: [DndPanel, SelectionSelect, Menu, Control],
      grid: true,
      edgeType: 'polyline',
      hideAnchors: true,
      isSilentMode,
      edgeTextEdit: false,
      adjustEdge: false,
    });
    // 节点注册
    registerNode(lf, {
      addSubTask,
      addSubStep,
      isSilentMode,
    });
    console.log('节点注册');
    // 赋值到curLf
    setLf(lf);
    setControlConfig(lf);
    // 设置菜单
    // setMenuConfig(lf, {
    //   deleteNode,
    //   isSilentMode,
    // });
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
      // 初始化画布
      init();
      if (drawPanelRef.current) {
        console.log(drawPanelRef.current);
        drawPanelRef.current?.render(data || {});
      }
    },
    getLf: () => {
      return curLf;
    },
  }));

  return (
    <div className={style['draw-box_bg']}>
      <div className={style['menu-box']}>
        <div className={style['content_left']}>{preMenu}</div>
        <div className={style['content_right']}>
          <Condition r-if={!isSilentMode}>
            <Button className={style['bt-item']} type="primary" onClick={_save}>
              保存
            </Button>
          </Condition>

          {extraMenu}
        </div>
      </div>
      {/* ------ 拖动面板 ------ */}
      {/* <DndDiyPanel lf={curLf}></DndDiyPanel> */}
      <div id="draw-box" ref={drawDomRef} className={style['draw-box']}></div>
    </div>
  );
};

export default DrawPanel;
