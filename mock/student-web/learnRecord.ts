import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const learn = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      taskId: index,
      taskName: '课程名称' + index,
      courseId: index, //练习技巧id
      taskNodeName: '练习技巧名称' + index,
      taskNodeId: index,
      taskType: '1',
      score: '分数' + index,
      studyPass: '1',
      sourcePath: '录音路径',
      createTime: '2022-12-12',
      courseType: index / 2 === 0 ? 4 : 1
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      pageSize: 20,
      totalPage: 11,
      list: data,
    },
  });
};

const courseList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      taskId: index,
      taskName: '课程名称' + index,
      courseId: index, //练习技巧id
      taskNodeName: '练习技巧名称' + index,
      taskNodeId: index,
      taskType: '1',
      score: '分数' + index,
      studyPass: '1',
      sourcePath: '录音路径',
      createTime: '2022-12-12',
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: data,
  });
};

const score = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      deductModel: '扣分项目' + index,
      deductPoint: '扣分点' + index,
      deductScore: 5,
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      deductScore: 25,
      pointsDeductionList: data,
    },
  });
};

const dialogue = (req: any, res: any) =>
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      dialogueList: [
        {
          id: 1,
          studyId: 1,
          text: '喂，你好吗，我叫梁山伯，是个高中生侦探',
          nodeId: 1,
          nodeName: '节点名称' + 1,
          role: 'customer',
          soundPath: '',
          keyPointList: [
            {
              keyPointName: '关键点' + 1,
              keyWord: '关键词' + 1,
              isPass: '0',
            },
          ],
        },
        {
          id: 2,
          studyId: 2,
          text: '您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，你是说你不是，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗',
          nodeId: 2,
          nodeName: '节点名称' + 2,
          role: 'student',
          soundPath: '',
          errorIndexList: [1, 2, 3, 4, 5],
          keyPointList: [
            {
              keyPointName: '逾期信息' + 2,
              keyWord:
                '户欠款信息您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗您好，中邮消费给你致电，请问你是梁山伯先生本人吗' +
                2,
              isPass: '0',
            },
            {
              keyPointName: '服务还款' + 2,
              keyWord: '本期还款成功,服务还款时间为2023-12-12,请及时...',
              isPass: '1',
            },
          ],
        },
        {
          id: 3,
          studyId: 3,
          text: '你的消息超过8s没有回复，臭傻逼快回复啊',
          nodeId: 3,
          nodeName: '节点名称' + 3,
          role: 'system',
          soundPath: '',
          errorIndexList: [3],
        },
        {
          id: 4,
          studyId: 4,
          text: '喂，你好吗，我叫梁山伯，是个高中生侦探',
          nodeId: 4,
          nodeName: '节点名称' + 4,
          role: 'customer',
          soundPath: '',
          keyPointList: [
            {
              keyPointName: '关键点' + 4,
              keyWord: '关键词' + 4,
              isPass: '0',
            },
          ],
        },
        {
          id: 4,
          studyId: 4,
          text: '您好，中邮消费给你致电，请问你是梁山伯先生本人吗',
          nodeId: 4,
          nodeName: '节点名称' + 4,
          role: 'student',
          soundPath: '',
          actionAccess: '0',
          keyPointList: [
            {
              keyPointName: '关键点' + 4,
              keyWord: '关键词' + 4,
              isPass: '1',
            },
          ],
        },
      ],
    },
  });

export default {
  [`POST ${baseUrl}/services/stu/history/learn`]: learn,
  [`POST ${baseUrl}/services/stu/history/courseList`]: courseList,
  //  [`POST ${baseUrl}/services/stu/course/score`]: score,
  [`POST ${baseUrl}/services/stu/course/dialogue`]: dialogue,
};
