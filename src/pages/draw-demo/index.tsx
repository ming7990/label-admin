import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Button, message } from 'antd';
import DrawPanel from '../draw-panel';
import style from './style.less';
import { useDrawModel } from './model';


// 首页
const DrawDemo: React.FC<any> = (props: any) => {

  const drawLf: any = useRef<any>(null);
  // -------
  // 获取画布
  const { getDrawPanel, saveDrawPanel, addNode, deleteNode } = useDrawModel();

  // 事件监听

  //初始化
  const init = async () => {

    let res = await getDrawPanel({});
    if (res) {
      drawLf.current?.initPanel(res);
    }
  }

  // 保存画布
  const onSave = (data: any) => {
    const { nodes, edges } = data;
    saveDrawPanel({ nodes, edges })
  }

  // 监听节点添加  return true / false

  const _addNode = async (data: any) => {
    return addNode(data);
  }

  // 删除节点删除 return true / false
  const _deleteNode = async (data: any) => {
    return deleteNode(data);
  }

  // 双击节点
  const onNodeDbClick = async (data: any) => {
    console.log(data);
  }

  // 双击连线
  const onEdgeDbClick = async (data: any) => {
    console.log(data);
  }


  useEffect(() => {
    //初始化画布
    init();
  }, []);

  return (
    <>
      <DrawPanel
        cref={drawLf}
        onSave={onSave}
        addNode={_addNode} // 添加
        deleteNode={_deleteNode} // 删除
        onNodeDbClick={onNodeDbClick} // 双击点击节点
        onEdgeDbClick={onEdgeDbClick} // 双击连线
      />
    </>
  );
};

export default DrawDemo;
