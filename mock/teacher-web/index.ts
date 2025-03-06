import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;
const gen = (num: number) => {
  return new Array(num).fill(0);
};

const getNormalList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      taskId: index,
      taskName: '任务名称' + index,
      progress: 0.75,
      taskModel: 1, //1-闯关模式   2-任意模式
      taskType: 1, //1-培训   2--考试
      courseName: '课程' + index,
      courseStatus: 0,
      courseType: Math.floor(Math.random() * 6),
      passMark: Math.ceil(Math.random() * 40 + 60),
      creator: 'root',
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      list: data,
      totalPage: 22,
    },
  });
};

const getNormalList2 = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      courseName: '课程' + index,
      courseStatus: 0,
      courseType: Math.floor(Math.random() * 6),
      passMark: Math.ceil(Math.random() * 40 + 60),
      creator: 'root',
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: data,
  });
};

const defaultResault = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const courseDetail = (req: any, res: any) => {
  // 创建一个数组包含可能的 courseType 值  
  const possibleTypes = [4, 0, 1];
  // 随机选择一个值  
  const randomType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '1',
      courseName: 'xxx',
      passMark: 60,
      courseType: randomType,
      minNumberSwitch: 1,
      minNumber: 1,
      courseStatus: 0,
      modelId: 'xxx',
      isEdit: true,
    },
  });
};

const getDraw = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '100', //课程id
      nodes: [
        {
          id: 'f496662d-ea19-4691-b9fe-3cf85e30a041',
          type: 'start',
          x: 460,
          y: 160,
          properties: {},
          text: { x: 460, y: 160, value: '开始' },
        },
        {
          id: 'bdbc7f12-1690-4bda-9256-5ade866ba4b8',
          type: 'student',
          x: 640,
          y: 320,
          properties: {},
          text: { x: 640, y: 320, value: '学员节点' },
        },
        {
          id: '9338b5a4-c676-491d-92c0-9361b4dc99c3',
          type: 'customer',
          x: 320,
          y: 500,
          properties: {},
          text: { x: 320, y: 500, value: '客户节点' },
        },
        {
          id: '2da32edd-175b-44b1-a132-a7b271507390',
          type: 'finish',
          x: 600,
          y: 660,
          properties: {},
          text: { x: 600, y: 660, value: '结束1' },
        },
      ],
      edges: [
        {
          id: '3a0a2f39-c8aa-4d76-b016-7461df185b3c',
          type: 'line',
          sourceNodeId: 'f496662d-ea19-4691-b9fe-3cf85e30a041',
          targetNodeId: 'bdbc7f12-1690-4bda-9256-5ade866ba4b8',
          startPoint: { x: 510, y: 160 },
          endPoint: { x: 640, y: 283 },
          properties: {},
        },
        {
          id: 'e51b6d92-7817-41e5-9be8-597ec180cb04',
          type: 'line',
          sourceNodeId: 'bdbc7f12-1690-4bda-9256-5ade866ba4b8',
          targetNodeId: '9338b5a4-c676-491d-92c0-9361b4dc99c3',
          startPoint: { x: 640, y: 357 },
          endPoint: { x: 320, y: 463 },
          properties: {},
        },
        {
          id: '536ae6c4-183b-4d64-b8b1-2e44a56fa0c3',
          type: 'line',
          sourceNodeId: '9338b5a4-c676-491d-92c0-9361b4dc99c3',
          targetNodeId: '2da32edd-175b-44b1-a132-a7b271507390',
          startPoint: { x: 320, y: 537 },
          endPoint: { x: 600, y: 610 },
          properties: {},
        },
      ],
    },
  });
};

const courseCustomInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '100', //课程id
      courseId: '100',
      customerInfo: '',
      // '客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息',
    },
  });
};

const courseCallConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '100', //课程id
      courseId: '100',
      answerWaitTime: '8',
      timeoutTip: '超时',
      stopTime: '8',
      timeoutSwitch: true,
      stopSwitch: true,
    },
  });
};

const courseSoundConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '100', //课程id
      courseId: '100',
      soundVolume: 50,
      soundName: '音色',
      soundSpeed: 5,
      soundTone: 5,
    },
  });
};

const soundList = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      voiceNames: ['ali', 'xiaomei'],
    },
  });
};

const courseEndConfig = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '101', //课程id
      courseId: '100',
      maxError: 5,
      errorTip: '异常提示',
      endText: '异常结束语',
    },
  });
};

const chatbegin = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      sessionId: '123456789',
      courseId: '100',
      list: [
        {
          type: 'customer',
          text: '喂，哪位',
          delay: '',
          status: '',
          isEnd: true,
          // keysTips: [
          //   {
          //     flag: true,
          //     desc: '关键点111',
          //   },
          // ],
        },
        {
          type: 'system',
          text: '对方已挂断',
          delay: '',
          status: '',
          isEnd: true,
          // keysTips: [
          //   {
          //     flag: true,
          //     desc: '关键点111',
          //   },
          // ],
        },
      ],
    },
  });
};

const chatsend = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      sessionId: '123456789',
      courseId: '100',
      list: [
        {
          type: 'student',
          text: req?.body?.message,
          delay: '',
          status: 'success',
          keysTips: [
            {
              flag: true,
              desc: '正在校验中的关键点',
            },
          ],
        },
        {
          type: 'customer',
          text: '6',
          delay: '',
        },

        {
          type: 'system',
          text: '对方已挂断',
          delay: '',
          status: '',
          isEnd: true,
          // keysTips: [
          //   {
          //     flag: true,
          //     desc: '关键点111',
          //   },
          // ],
        },
      ],
    },
  });
};

const nodeInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      nodeType: 1,
      nodeName: 'nodename',
      positionInfo: '1,2',
      keyPoints: [{ id: '11', nodeId: '33', keyPoint: '关键点', keyWord: '关键词' }],
      nodeAction: [{ id: '44', nodeId: '22', action: '话术', intent: '' }],
      nodeIntentAction: [{ intent: '意图名称1' }],
    },
  });
};

const lineInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      customerText: '文本文本文本文本文本文本文本', //课程id
      studentText: '节点',
      role: Math.ceil(Math.random() * 2),
      keyPoints: [{ keyPointName: '关键点', keyWord: '关键字', isPass: '' }],
    },
  });
};

export default {
  // 获取课程信息
  [`POST ${baseUrl}/services/course/coursePage`]: getNormalList,
  [`POST ${baseUrl}/services/stu/course/coursePage`]: getNormalList,
  [`POST ${baseUrl}/services/course/courseList`]: getNormalList2,
  [`POST ${baseUrl}/services/course/courseAdd`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseDetail`]: courseDetail,
  [`POST ${baseUrl}/services/course/courseEdit`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseDelete`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseDown`]: defaultResault,
  [`POST ${baseUrl}/services/course/coursePublish`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseCopy`]: defaultResault,
  //课程画布
  [`POST ${baseUrl}/services/course/courseNodeLineInfo`]: getDraw,
  [`POST ${baseUrl}/services/course/courseNodeInfoAdd`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseNodeInfoDelete`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseLineInfoSave`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseCheck`]: defaultResault, //校验

  [`POST ${baseUrl}/services/course/courseNodeInfo`]: nodeInfo,
  [`POST ${baseUrl}/services/course/courseNodeSave`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseLineInfo`]: lineInfo,
  [`POST ${baseUrl}/services/course/courseLineSave`]: defaultResault,

  [`POST ${baseUrl}/services/course/dialogueBegin`]: chatbegin, //流程测试
  [`POST ${baseUrl}/services/course/dialogueSend`]: chatsend,
  [`POST ${baseUrl}/services/course/dialogueFinish`]: defaultResault,
  [`POST ${baseUrl}/services/course/coursePublishTest`]: defaultResault,

  [`POST ${baseUrl}/services/course/courseCustomInfo`]: courseCustomInfo, //客户
  [`POST ${baseUrl}/services/course/courseCustomInfoSave`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseCallConfig`]: courseCallConfig, //通话
  [`POST ${baseUrl}/services/course/courseCallConfigSave`]: defaultResault,
  [`POST ${baseUrl}/services/course/courseSoundConfig`]: courseSoundConfig, //音色
  [`POST ${baseUrl}/services/course/courseSoundConfigSave`]: defaultResault,
  [`GET ${baseUrl}/services/course/allVoiceNames`]: soundList,
  [`POST ${baseUrl}/services/course/courseEndConfig`]: courseEndConfig, //结束
  [`POST ${baseUrl}/services/course/courseEndConfigSave`]: defaultResault,
};
