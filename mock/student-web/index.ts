import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;
const gen = (num: number) => {
  return new Array(num).fill(0);
};

const getNormalList = (req: any, res: any) => {
  const pageSize = Number(req.query.pageSize || 12);

  let data: any = gen(pageSize).map((item: any, index: number) => {
    return {
      taskName: '培训机器人' + index,
      taskType: Math.random() > 0.5 ? 2 : 1,
      taskId: 123,
      progress: 0.75,
      finished: index % 2 === 1,
    };
  });

  res.json({
    resultCode: successCode,
    desc: '成功',
    data: {
      total: 24,
      list: data,
    },
  });
};

const getCourseInfo = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    desc: '成功',
    data: {
      courseName: '新世纪-GPX-高智能方程式',
      courseType: 4,
      taskType: Math.random() > 0.5 ? 2 : 1,
      customerInfo:
        '客户姓名: 张三，逾期2期，逾期金额200元，客户信息客户信息客户信息客户信息客户信息客户信息客户姓名：张三，逾期2期，逾期金额200元,客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息客户信息',
      standardMsg:
        '您当前逾期2期，逾期金额2000元，为了不影响您在我行的信用，今天能还清么您当前逾期2期，逾期金额2000元，为了不影响您在我行的信用，今天能还清么您当前逾期2期，逾期金额2000元，为了不影响您在我行的信用，今天能还',
      keyPoint: '客户逾期信息、客户欠款信息、提醒还款、客户逾期信息、客户欠款信息、提醒还款',
      duration: 300,
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
          text: { x: 320, y: 500, value: '客服节点' },
        },
        {
          id: '2da32edd-175b-44b1-a132-a7b271507390',
          type: 'finish',
          x: 600,
          y: 660,
          properties: {},
          text: { x: 600, y: 660, value: '结束' },
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

const getStepResult = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      "fullScore": 100,
      "score": 24,
      "deductScore": 6,
      "plusScore": 10,
      "studyPass": 0,
      "summarize": "提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决\n方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解\n决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决方案提供解决\n方案提供解决方案提供解决方案",
      "pointScoreList": [
        {
          "score": 0,
          "deductModel": "核实信息"
        },
        {
          "score": 0,
          "deductModel": "施压点"
        },
        {
          "score": 0,
          "deductModel": "提供解决方案"
        }
      ],
      "pointsDeductionList": [
        {
          "deductModel": "回答词语和拼写扣分",
          "deductPoint": "超出范围",
          "deductScore": -3
        },
        {
          "deductModel": "逻辑合理性扣分",
          "deductPoint": "回答不合理",
          "deductScore": -3
        }
      ]
    },
  });
};

const postCall = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    desc: '成功',
    data: {
      sessionId: 'fate grand order',
    },
  });
};

// 获取学员课程（任务）的画布
const getTaskPanelDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    data: {
      taskName: 'Super Asurada',
      taskType: Math.random() > 0.5 ? 1 : 2,
      taskModel: Math.random() > 0.5 ? 1 : 2,
      nodes: [
        {
          id: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5',
          type: 'course',
          x: 520,
          y: 100,
          properties: {},
          text: { x: 520, y: 100, value: '课程节点' },
        },
        {
          id: 'abbfb89c-7bb3-4174-9430-ecc467259dcb',
          type: 'task',
          x: 360,
          y: 240,
          properties: {},
          text: { x: 360, y: 240, value: '任务节点' },
        },
        {
          id: '7da1f738-cae1-4550-8bef-c669f068d8a9',
          type: 'task',
          x: 620,
          y: 240,
          properties: {},
          text: { x: 620, y: 240, value: '任务节点' },
        },
        {
          id: 'd1782302-fb90-415d-b080-a4f07d95cc1f',
          type: 'step',
          x: 360,
          y: 380,
          properties: {
            status: 'finish',
            completeNum: 1,
            totalNum: 10,
            courseId: '123',
            courseType: 4,
          },
          text: { x: 360, y: 380, value: '步骤节点1步骤节点1步骤节点1步骤节点1' },
        },
        {
          id: 'e1782302-fb90-415d-b080-a4f07d95kk2d',
          type: 'step',
          x: 360,
          y: 520,
          properties: {
            status: 'doing',
            completeNum: 1,
            totalNum: 10,
            courseId: '123',
            courseType: 4,
          },
          text: { x: 360, y: 520, value: '步骤节点2' },
        },
        {
          id: 'fk782302-fb90-415d-b080-a4f07d95kk2d',
          type: 'step',
          x: 360,
          y: 700,
          properties: { status: 'wait', courseId: '123' },
          text: { x: 360, y: 700, value: '步骤节点3' },
        },
      ],
      edges: [
        {
          id: '29c5c2d6-b5c7-424b-967b-22289a5ff239',
          type: 'polyline',
          sourceNodeId: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5',
          targetNodeId: 'abbfb89c-7bb3-4174-9430-ecc467259dcb',
          startPoint: { x: 520, y: 137 },
          endPoint: { x: 360, y: 203 },
          properties: {},
          pointsList: [
            { x: 520, y: 137 },
            { x: 520, y: 173 },
            { x: 360, y: 173 },
            { x: 360, y: 203 },
          ],
        },
        {
          id: '300e1a19-587d-44a1-b2ed-3dad6a4690d4',
          type: 'polyline',
          sourceNodeId: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5',
          targetNodeId: '7da1f738-cae1-4550-8bef-c669f068d8a9',
          startPoint: { x: 520, y: 137 },
          endPoint: { x: 620, y: 203 },
          properties: {},
          pointsList: [
            { x: 520, y: 137 },
            { x: 520, y: 170 },
            { x: 620, y: 170 },
            { x: 620, y: 203 },
          ],
        },
        {
          id: 'dff9b7f6-57e5-486f-8b40-e9e3b55efa3e',
          type: 'line',
          sourceNodeId: 'abbfb89c-7bb3-4174-9430-ecc467259dcb',
          targetNodeId: 'd1782302-fb90-415d-b080-a4f07d95cc1f',
          startPoint: { x: 360, y: 269 },
          endPoint: { x: 360, y: 343 },
          properties: {},
        },
        {
          id: 'd0a93310-137e-4401-9412-e20381d81304',
          type: 'line',
          sourceNodeId: 'd1782302-fb90-415d-b080-a4f07d95cc1f',
          targetNodeId: 'e1782302-fb90-415d-b080-a4f07d95kk2d',
          startPoint: { x: 360, y: 417 },
          endPoint: { x: 360, y: 483 },
          properties: {},
        },
        {
          id: 'fa4aa2fc-ff42-4079-97a7-9ff5704886ad',
          type: 'line',
          sourceNodeId: 'e1782302-fb90-415d-b080-a4f07d95kk2d',
          targetNodeId: 'fk782302-fb90-415d-b080-a4f07d95kk2d',
          startPoint: { x: 360, y: 557 },
          endPoint: { x: 360, y: 663 },
          properties: {},
        },
      ],
    },
  });
};

const courseCount = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    desc: '成功',
    data: {
      unTotalNum: 55,
      totalNum: 99,
    },
  });
};

const getJSSIP = (req: any, res: any) => {
  res.json({
    resultCode: '100',
    resultDesc: '成功',
    data: {
      wsUrl: '11.111.17.218:7443',
      wssUrl: '11.111.17.218:7443',
      registerUrl: '@11.111.17.218:5060',
      linkUrl: '11.111.17.218:7443',
      stun: '11.111.17.218:7654',
      fsPassword: 'youcash',
      sysPhone: '1010',
      oursNumber: '1009',
    },
    success: true,
  });
};

export default {
  // 获取课程信息
  [`GET ${baseUrl}/student/course/list`]: getNormalList,

  [`POST ${baseUrl}/services/stu/course/call`]: postCall,
  [`GET ${baseUrl}/services/stu/course/callConfig`]: getJSSIP,
  // 获取具体课程的信息、画布、客户信息
  [`POST ${baseUrl}/services/stu/course/courseNodeLineInfo`]: getCourseInfo,
  [`POST ${baseUrl}/services/stu/course/taskNodeLineInfo`]: getTaskPanelDetail,
  // 获取成绩
  [`POST ${baseUrl}/services/stu/course/score`]: getStepResult,

  [`POST ${baseUrl}/services/stu/course/courseCount`]: courseCount,
};
