import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
import {
  addNode_API,
  allVoiceNames_API,
  courseCallConfigSave_API,
  courseCallConfig_API,
  courseCheck_API,
  courseCustomInfoSave_API,
  courseCustomInfo_API,
  courseEndConfigSave_API,
  courseEndConfig_API,
  courseLineInfo_API,
  courseLineSave_API,
  courseNodeInfo_API,
  courseNodeSave_API,
  courseSoundConfigSave_API,
  courseSoundConfig_API,
  deleteNode_API,
  getAllCourseList,
  getCourseList,
  getDrawPanel_API,
  postDrawPanel_API,
  _courseAdd,
  _courseCopy,
  _courseDelete,
  _courseDetail,
  _courseDown,
  _courseEdit,
  _coursePublish,
  _dialogueBegin,
  _dialogueFinish,
  _dialoguePublish,
  _dialogueSend,
  courseEditTimbre,
} from './api';

const { successCode } = config;

//课程管理
export const useTableModel = () => {
  const [allTableList, setAllTableList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  //课程分页
  const getTableList = async (params?: any) => {
    setTableLoading(true);
    let res: any = await getCourseList(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      return { data: res?.data?.list, total: res?.data?.totalPage };
    } else {
      message.error(res?.resultDesc);
      return { data: [], total: 0 };
    }
  };
  //课程所有
  const getAllTablelist = async (params?: any, cb?: any) => {
    setTableLoading(true);
    let res: any = await getAllCourseList(params || {});
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      setAllTableList(res?.data);
    } else {
      setAllTableList([]);
    }
    typeof cb === 'function' && cb(res?.data || []);
  };
  //新增
  const courseAdd = async (params?: any) => {
    setFormLoading(true);
    let res: any = await _courseAdd(params);
    setFormLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  //详情
  const courseDetail = async (params?: any) => {
    setFormLoading(true);
    let res: any = await _courseDetail(params);
    setFormLoading(false);
    if (res?.resultCode == successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  //编辑
  const courseEdit = async (params?: any) => {
    setFormLoading(true);
    let res: any = await _courseEdit(params);
    setFormLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  //删除
  const courseDelete = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _courseDelete(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  //发布
  const coursePublish = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _coursePublish(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  //下线
  const courseDown = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _courseDown(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  //复制
  const courseCopy = async (params?: any) => {
    setTableLoading(true);
    let res: any = await _courseCopy(params);
    setTableLoading(false);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    allTableList,
    tableLoading,
    formLoading,
    getAllTablelist,
    getTableList, // 获取表格数据
    courseAdd,
    courseDetail,
    courseEdit,
    courseDelete,
    coursePublish,
    courseDown,
    courseCopy
  };
};
// 画布
export const useDrawModel = () => {
  const [flowTestLoading, setFlowTestLoading] = useState<boolean>(false);
  const [flowBtnLoading, setFlowBtnLoading] = useState<boolean>(false);
  const [soundList, setSoundList] = useState<any>([]);
  // 保存画布接口
  const saveDrawPanel = async (data: any, hideMsg?: any) => {
    setFlowBtnLoading(true);
    let res: any = await postDrawPanel_API(data);
    setFlowBtnLoading(false);
    if (res.resultCode === successCode) {
      if (!hideMsg) {
        message.success('保存成功');
      }
      return true;
    } else {
      message.error(res?.resultDesc || '保存失败');
      return false;
    }
  };
  //获取画布
  const getDrawPanel = async (data: any) => {
    let res: any = await getDrawPanel_API(data);
    if (res.resultCode === successCode) {
      return res.data;
    } else {
      message.error(res?.resultDesc || '获取画布失败');
      return false;
    }
  };

  const addNode = async (data: any) => {
    let res: any = await addNode_API(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res?.resultDesc || '节点添加失败');
      return false;
    }
  };

  const deleteNode = async (data: any) => {
    let res: any = await deleteNode_API(data);
    if (res.resultCode === successCode) {
      return true;
    } else {
      message.error(res?.resultDesc || '节点添加失败');
      return false;
    }
  };

  const courseCheck = async (data: any) => {
    setFlowBtnLoading(true);
    let res: any = await courseCheck_API(data);
    setFlowBtnLoading(false);
    if (res.resultCode === successCode) {
      message.success('校验通过');
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  const courseNodeInfo = async (data: any) => {
    let res: any = await courseNodeInfo_API(data);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseLineInfo = async (data: any) => {
    let res: any = await courseLineInfo_API(data);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseNodeSave = async (data: any) => {
    let res: any = await courseNodeSave_API(data);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseLineSave = async (data: any) => {
    let res: any = await courseLineSave_API(data);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  //流程测试 _dialoguePublish
  const dialoguePublish = async (data: any) => {
    setFlowTestLoading(true);
    let res: any = await _dialoguePublish(data);
    setFlowTestLoading(false);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const dialogueBegin = async (data: any) => {
    setFlowTestLoading(true);
    let res: any = await _dialogueBegin(data);
    setFlowTestLoading(false);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const dialogueSend = async (data: any) => {
    setFlowTestLoading(true);
    let res: any = await _dialogueSend(data);
    setFlowTestLoading(false);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const dialogueFinish = async (data: any) => {
    setFlowTestLoading(true);
    let res: any = await _dialogueFinish(data);
    setFlowTestLoading(false);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  //客户信息---
  const courseCustomInfo = async (data: any) => {
    let res: any = await courseCustomInfo_API(data);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseCustomInfoSave = async (data: any) => {
    let res: any = await courseCustomInfoSave_API(data);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  //通话设置---
  const courseCallConfig = async (data: any) => {
    let res: any = await courseCallConfig_API(data);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseCallConfigSave = async (data: any) => {
    let res: any = await courseCallConfigSave_API(data);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  //音色设置---
  const courseSoundConfig = async (data: any) => {
    let res: any = await courseSoundConfig_API(data);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseSoundConfigSave = async (data: any) => {
    let res: any = await courseSoundConfigSave_API(data);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const getallVoiceNames = async (data: any) => {
    let res: any = await allVoiceNames_API(data);
    if (res.resultCode === successCode) {
      setSoundList(res?.data?.voiceNames);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  //结束设置---
  const courseEndConfig = async (data: any) => {
    let res: any = await courseEndConfig_API(data);
    if (res.resultCode === successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };
  const courseEndConfigSave = async (data: any) => {
    let res: any = await courseEndConfigSave_API(data);
    if (res.resultCode === successCode) {
      message.success(res?.resultDesc);
      return true;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  };

  return {
    flowTestLoading,
    flowBtnLoading,
    soundList,
    saveDrawPanel, // 保存画布
    getDrawPanel, // 获取画布
    addNode,
    deleteNode,
    courseCheck,
    courseNodeInfo, //节点线操作 4
    courseNodeSave,
    courseLineInfo,
    courseLineSave,
    dialogueBegin, //流程对话测试 4
    dialogueSend,
    dialogueFinish,
    dialoguePublish,
    courseCustomInfo, //客户信息 2
    courseCustomInfoSave,
    courseCallConfig, //通话设置 2
    courseCallConfigSave,
    courseSoundConfig, //音色 3
    courseSoundConfigSave,
    getallVoiceNames,
    courseEndConfig, //结束 2
    courseEndConfigSave,
    courseEditTimbre,
  };
};
