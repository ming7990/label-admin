import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const taskCount = (req: Request, res: Response) => {
  const { taskType } = req.body;
  let data = {
    totalCount: 101,
    completeCount: 102,
    processingCount: 103,
    upPublishCount: 104,
  };
  if (!taskType) {
    data = {
      totalCount: 201,
      completeCount: 202,
      processingCount: 203,
      upPublishCount: 204,
    };
  }
  res.json({
    resultCode: successCode,
    desc: '成功',
    data,
  });
};

const teachTaskDataPage = (req: any, res: any) => {
  const { page, pageSize, queryTaskName } = req.body;
  let list: any = gen(12).map((item: any, index: number) => {
    return {
      id: index,
      taskName: '任务名' + index,
      trainUser: index * 2,
      trainTimes: index * 3,
      completeCount: index * 4,
      scoreAvg: index * 5,
      timesAvg: index * 6,
      completeRate: 0.75,
      taskType: 2,
    };
  });

  if (queryTaskName === '111') list = [];

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      page,
      pageSize,
      totalPage: 22,
      list,
    },
  });
};

export default {
  [`POST ${baseUrl}/services/home/taskCount`]: taskCount,
  [`POST ${baseUrl}/services/home/teachTaskDataPage`]: teachTaskDataPage,
};
