import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;
const gen = (num: number) => {
  return new Array(num).fill(0);
};

const defaultResault = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getTaskList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      taskName: '任务' + index,
      taskModel: Math.ceil(Math.random() * 2),
      taskType: Math.ceil(Math.random() * 2),
      passScore: Math.ceil(Math.random() * 40 + 60),
      progress: Math.floor(Math.random() * 3),
      taskStatus: Math.floor(Math.random() * 2),
      creator: 'root',
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      list: data,
      totalPage: 11,
    },
  });
};

const getTaskList2 = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      taskName: '任务' + index,
      taskModel: Math.ceil(Math.random() * 2),
      taskType: Math.ceil(Math.random() * 2),
      passScore: Math.ceil(Math.random() * 40 + 60),
      progress: Math.floor(Math.random() * 3),
      taskStatus: Math.floor(Math.random() * 2),
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

const taskDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      taskName: '任务',
      taskModel: Math.ceil(Math.random() * 2),
      taskType: Math.ceil(Math.random() * 2),
      passScore: Math.ceil(Math.random() * 40 + 60),
      progress: Math.floor(Math.random() * 3),
      taskStatus: 0,
      creator: 'root',
      id: 1,
    },
  });
};

const getDraw = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      nodes: [
        {
          id: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5',
          type: 'course',
          x: 520,
          y: 100,
          properties: {},
          text: {
            x: 520,
            y: 100,
            value: '课程节点',
          },
        },
        {
          id: 'd3443638-f6b3-41ae-a0b6-0199d5c6ed95',
          type: 'task',
          x: 320,
          y: 240,
          properties: {},
          text: {
            x: 320,
            y: 240,
            value: '任务节点1',
          },
        },
        {
          id: '688d60af-4eb4-473c-aa0e-3680918a626e',
          type: 'task',
          x: 620,
          y: 240,
          properties: {},
          text: {
            x: 620,
            y: 240,
            value: '任务节点2',
          },
        },
        {
          id: '73f3897e-27a0-48b5-b230-0ac2f035b761',
          type: 'step',
          x: 320,
          y: 380,
          properties: {},
          text: {
            x: 320,
            y: 380,
            value: '课程名称1',
          },
        },
        {
          id: '1f716d7a-0724-4c70-9691-b5be4a4d9b8f',
          type: 'step',
          x: 320,
          y: 520,
          properties: {},
          text: {
            x: 320,
            y: 520,
            value: '课程名称2',
          },
        },
        {
          id: 'c7aae8d8-3c2c-4bfc-b1d0-7086529ca7c7',
          type: 'step',
          x: 620,
          y: 380,
          properties: {},
          text: {
            x: 620,
            y: 380,
            value: '课程名称3',
          },
        },
      ],
      edges: [
        {
          id: 'a57eabca-53fb-4aaf-b3cc-1138d3942a6d',
          type: 'polyline',
          sourceNodeId: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5',
          targetNodeId: 'd3443638-f6b3-41ae-a0b6-0199d5c6ed95',
          startPoint: {
            x: 520,
            y: 129,
            id: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5_2',
          },
          endPoint: {
            x: 320,
            y: 211,
            id: 'd3443638-f6b3-41ae-a0b6-0199d5c6ed95_0',
          },
          properties: {},
          pointsList: [
            {
              x: 520,
              y: 129,
            },
            {
              x: 520,
              y: 181,
            },
            {
              x: 320,
              y: 181,
            },
            {
              x: 320,
              y: 211,
            },
          ],
        },
        {
          id: 'c2983feb-2f0b-42b0-bdc5-d32e9f39a9b6',
          type: 'polyline',
          sourceNodeId: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5',
          targetNodeId: '688d60af-4eb4-473c-aa0e-3680918a626e',
          startPoint: {
            x: 520,
            y: 129,
            id: 'bd84a36e-6da2-4c18-8052-2f3a49b28fe5_2',
          },
          endPoint: {
            x: 620,
            y: 211,
            id: '688d60af-4eb4-473c-aa0e-3680918a626e_0',
          },
          properties: {},
          pointsList: [
            {
              x: 520,
              y: 129,
            },
            {
              x: 520,
              y: 170,
            },
            {
              x: 620,
              y: 170,
            },
            {
              x: 620,
              y: 211,
            },
          ],
        },
        {
          id: 'f21a6e8b-821c-4faf-82c1-ecfc94a8cced',
          type: 'polyline',
          sourceNodeId: 'd3443638-f6b3-41ae-a0b6-0199d5c6ed95',
          targetNodeId: '73f3897e-27a0-48b5-b230-0ac2f035b761',
          startPoint: {
            x: 320,
            y: 269,
            id: 'd3443638-f6b3-41ae-a0b6-0199d5c6ed95_2',
          },
          endPoint: {
            x: 320,
            y: 343,
            id: '73f3897e-27a0-48b5-b230-0ac2f035b761_0',
          },
          properties: {},
          pointsList: [
            {
              x: 320,
              y: 269,
            },
            {
              x: 320,
              y: 343,
            },
          ],
        },
        {
          id: '54c48a1b-c3b0-4e39-8e55-945866284014',
          type: 'polyline',
          sourceNodeId: '73f3897e-27a0-48b5-b230-0ac2f035b761',
          targetNodeId: '1f716d7a-0724-4c70-9691-b5be4a4d9b8f',
          startPoint: {
            x: 320,
            y: 417,
            id: '73f3897e-27a0-48b5-b230-0ac2f035b761_2',
          },
          endPoint: {
            x: 320,
            y: 483,
            id: '1f716d7a-0724-4c70-9691-b5be4a4d9b8f_0',
          },
          properties: {},
          pointsList: [
            {
              x: 320,
              y: 417,
            },
            {
              x: 320,
              y: 483,
            },
          ],
        },
        {
          id: '627b4924-3c56-497d-86e7-e1f33b748472',
          type: 'polyline',
          sourceNodeId: '688d60af-4eb4-473c-aa0e-3680918a626e',
          targetNodeId: 'c7aae8d8-3c2c-4bfc-b1d0-7086529ca7c7',
          startPoint: {
            x: 620,
            y: 269,
            id: '688d60af-4eb4-473c-aa0e-3680918a626e_2',
          },
          endPoint: {
            x: 620,
            y: 343,
            id: 'c7aae8d8-3c2c-4bfc-b1d0-7086529ca7c7_0',
          },
          properties: {},
          pointsList: [
            {
              x: 620,
              y: 269,
            },
            {
              x: 620,
              y: 343,
            },
          ],
        },
      ],
      id: '0',
    },
  });
};

export default {
  //任务
  [`POST ${baseUrl}/services/task/taskPage`]: getTaskList,
  [`POST ${baseUrl}/services/task/taskList`]: getTaskList2,
  [`POST ${baseUrl}/services/task/taskAdd`]: defaultResault,
  [`POST ${baseUrl}/services/task/taskDetail`]: taskDetail,
  [`POST ${baseUrl}/services/task/taskEdit`]: defaultResault,
  [`POST ${baseUrl}/services/task/taskDelete`]: defaultResault,
  [`POST ${baseUrl}/services/task/taskOpen`]: defaultResault,
  [`POST ${baseUrl}/services/task/taskClose`]: defaultResault,

  [`POST ${baseUrl}/services/task/taskNodeLineInfo`]: getDraw,
  [`POST ${baseUrl}/services/task/taskLineInfoSave`]: defaultResault,
};
