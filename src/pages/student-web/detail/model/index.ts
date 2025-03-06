import React, { useState } from 'react';

import { message } from 'antd';
import { postDrawPanel_API, getDrawPanel_API, addNode_API, deleteNode_API, taskVerify_API, taskRetake_API } from './api';
import { formateTaskType } from '@/utils/formate-str';
import config from '@/config';

const { successCode } = config;

const travelNodes = (nodes: any[], options: any) => {
  nodes.forEach((item: any) => {
    if (item.type === 'step') {
      item.type = 'step-html';
      if (typeof item.text === 'object') {
        item.text.x = -250;
        item.text.y = -250;
      }
      item.properties.taskType = formateTaskType(options.taskType);
      if (options.taskModel == 2 && item.properties.status === 'wait') {
        // 任意模式
        item.properties.status = 'doing';
      }
    }
  });
};

export const useDrawModel = () => {
  const [loading, setLoadng] = useState<boolean>(false);
  // 保存画布接口
  const saveDrawPanel = async (data: any) => {
    let res: any = await postDrawPanel_API(data);
    // 画布
    if (res.code === successCode) {
      message.success('保存成功');
    } else {
      message.warning('保存失败');
    }
  };

  const getDrawPanel = async (data: any) => {
    setLoadng(true);
    let res: any = await getDrawPanel_API(data);
    setLoadng(false);
    // 画布
    if (res.resultCode === successCode) {
      let data: any = res.data || {};

      const { nodes = [], edges = [], taskType, taskModel } = data;
      travelNodes(nodes, { taskType, taskModel });

      console.log(nodes);
      return data;
    } else {
      message.warning('获取画布失败');
      return false;
    }
  };

  // -------------用不上
  const addNode = async (data: any) => {
    let res: any = await addNode_API(data);
    if (res.code === successCode) {
      return true;
    } else {
      message.warning('节点添加失败');
      return false;
    }
  };

  const deleteNode = async (data: any) => {
    let res: any = await deleteNode_API(data);
    if (res.code === successCode) {
      return true;
    } else {
      message.warning('节点添加失败');
      return false;
    }
  };

  // 检验
  const taskVerify = async (data: any) => {
    let res: any = await taskVerify_API(data);
    if (res.resultCode === successCode) {
      const data = res?.data;
      return {needRetake: data.needRetake, allowRetake: data.allowRetake, msg: data.desc};
    } else {
      message.warning(res.resultDesc);
      // return {success: false,  msg: res.resultDesc};
    }
  };

  const taskRetake = async (data: any) => {
    let res: any = await taskRetake_API(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.warning(res.resultDesc);
      return false;
    }
  };

  return {
    loading,
    saveDrawPanel, // 保存画布
    getDrawPanel, // 获取画布
    addNode,
    deleteNode,
    taskVerify,
    taskRetake,
  };
};
