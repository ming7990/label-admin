import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect, Menu, Control, MiniMap } from '@logicflow/extension';
// 样式
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import { useModel } from 'umi';
import { Button, Dropdown, Menu as AntdMenu, message } from 'antd';
import style from './style.less';
import DndDiyPanel from './components/dnd-panel';
import PlotDndDiyPanel from './components/dnd-panel/plot';
import { registerNode } from './components/node';

import { setMenuConfig, setControlConfig, checkEdge } from './config';
import { EllipsisOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';

// 首页
const DrawPanel: React.FC<any> = (props: any) => {
  const {
    cref,
    maxLen = 16, //修改文本最大字数
    extra,
    onCheck,
    onSave,
    onNodeDbClick,
    onEdgeDbClick,
    addNode = () => true,
    deleteNode = () => true,
    openCustomer,
    openCall,
    openSound,
    openEnd,
    openFlowTest,
    loading = false,
    isSilentMode = false,
    courseType = 0,
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
      let res = checkEdge(e.data, lf, courseType);
      if (res) {
        lf.deleteEdge(e.data.id);
        message.warning(res);
      }
      // 测试删除节点 // 调接口
      // if (e.data.type === 'student') {
      //   // lf.deleteEdge(e.data.id);
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
      } else {
        _lf.setProperties(data.id, {
          text: newText,
        });
      }
    });
  };

  //初始化
  const init = () => {
    const lf: any = new LogicFlow({
      container: drawDomRef.current,
      plugins: [DndPanel, SelectionSelect, Menu, Control, MiniMap],
      grid: true,
      edgeType: 'polyline',
      isSilentMode,
      edgeTextEdit: false,
    });
    // 节点注册
    registerNode(lf);
    console.log('节点注册');
    // 赋值到curLf
    setLf(lf);
    setControlConfig(lf);
    // 设置菜单
    setMenuConfig(lf, {
      deleteNode,
      isSilentMode,
    });
    // 添加监听事件
    addEvent(lf);
    // ----
    drawPanelRef.current = lf;
  };

  //对话前保存
  const _openFlowTest = async () => {
    let res;
    if (!isSilentMode) {
      res = await _save(true);
    } else {
      res = true;
    }

    if (res) {
      await openFlowTest();
    }
  };

  // 保存
  const _save = (hideMsg: any) => {
    const { nodes, edges } = curLf.getGraphData();
    // console.log('信息保存');
    // console.log(nodes, edges);
    let res = onSave?.({ nodes, edges }, hideMsg);
    return res;
  };

  //校验
  const _check = async () => {
    let res = await _save(true);
    if (!res) {
      return;
    }
    //
    onCheck?.();
  };

  useImperativeHandle(cref, () => ({
    initPanel: (data: any) => {
      if (drawPanelRef?.current) {
        // console.log(curLf);
        drawPanelRef?.current?.render(data);
      }
    },
    getLf: () => {
      return curLf;
    },
  }));

  useEffect(() => {
    // 初始化画布
    init();
  }, [isSilentMode]);

  useEffect(() => {
    console.log(isSilentMode);
  }, [isSilentMode]);

  const menuHeaderDropdown = (
    <AntdMenu selectedKeys={[]}>
      <AntdMenu.Item key="customer" onClick={openCustomer}>
        客户信息
      </AntdMenu.Item>
      <AntdMenu.Item key="call" onClick={openCall}>
        通话设置
      </AntdMenu.Item>
      <AntdMenu.Item key="sound" onClick={openSound}>
        音色设置
      </AntdMenu.Item>
      <AntdMenu.Item key="end" onClick={openEnd}>
        结束设置
      </AntdMenu.Item>
    </AntdMenu>
  );

  return (
    <div className={style['draw-box_bg']}>
      <div className={style['menu-box']}>
        <div className={style['content_left']}>{extra}</div>

        <div className={style['content_right']}>
          <Button className={style['bt-item']} onClick={_openFlowTest} loading={loading}>
            流程测试
          </Button>
          <Condition r-if={!isSilentMode}>
            <Button className={style['bt-item']} onClick={_check} loading={loading}>
              校验
            </Button>
            <Button
              className={style['bt-item']}
              type="primary"
              onClick={() => {
                _save(false);
              }}
              loading={loading}
            >
              保存
            </Button>
          </Condition>
          <Dropdown overlay={menuHeaderDropdown} placement="bottomLeft" trigger={['click']}>
            <Button icon={<EllipsisOutlined />}></Button>
          </Dropdown>
        </div>
      </div>
      {/* ------ 拖动面板 ------ */}
      <Condition r-if={!isSilentMode}>
        {courseType === 1 ? (
          <PlotDndDiyPanel lf={curLf}></PlotDndDiyPanel>
        ) : (
          <DndDiyPanel lf={curLf}></DndDiyPanel>
        )}
      </Condition>

      <div id="draw-box" ref={drawDomRef} className={style['draw-box']}></div>
    </div>
  );
};

export default DrawPanel;
