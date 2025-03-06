import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const studentGroup = (req: Request, res: Response) => {
  let data = {
    id: '410',
    groupName: 'M1 4-10',
  };
  res.json({
    resultCode: successCode,
    desc: '成功',
    data,
  });
};

const scoreSort = (req: any, res: any) => {
  const myRank = {
    rank: 10,
    userName: '本人名称',
    groupName: '本人-部门名称',
    score: 99,
  };

  const rankList: any = gen(10).map((item: any, index: number) => {
    const rank = index + 1;
    // if (index === 4) { // 本人排名在列表中
    //   return myRank;
    // }
    return {
      rank,
      userName: `${rank}-用户名`,
      groupName: `${rank}-部门名称`,
      score: rank * 10,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      rankList,
      myRank,
    },
  });
};

const getTips = (req: Request, res: Response) => {
  const data: any = gen(10).map((item: any, index: number) => {
    return {
      id: '410',
      title: '我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题'+index,
      content: '详细内容嘻嘻嘻详细内容嘻嘻嘻详细内容嘻嘻嘻详细内容嘻嘻嘻详细内容嘻嘻嘻详细内容嘻嘻嘻详细内容嘻嘻嘻',
      createTime: '2024-01-18'
    };
  });

  res.json({
    resultCode: successCode,
    desc: '成功',
    data,
  });
};

export default {
  [`POST ${baseUrl}/services/stu/index/studentGroup`]: studentGroup,
  [`POST ${baseUrl}/services/stu/index/scoreSort`]: scoreSort,
  [`GET ${baseUrl}/services/tips/all`]: getTips,
};
