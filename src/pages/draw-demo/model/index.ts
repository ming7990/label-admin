import React, { useState } from 'react';

import { message } from 'antd';
import { postDrawPanel_API, getDrawPanel_API, addNode_API, deleteNode_API } from './api';
import config from '@/config';

const { successCode } = config;

export const useDrawModel = () => {
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
    let res: any = await getDrawPanel_API(data);
    // 画布
    if (res.code === successCode) {
      return res.data;
    } else {
      message.warning('获取画布失败');
      return false;
    }
  };

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

  return {
    saveDrawPanel, // 保存画布
    getDrawPanel, // 获取画布
    addNode,
    deleteNode,
  };
};
