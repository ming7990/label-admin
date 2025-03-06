import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const modelPage = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      modelName: '模型名称' + index,
      modelAddress: '模型地址' + index,
      updateTime: '2023-12-12',
      creator: '创建人' + index,
      createTime: '2023-12-12',
      modifiedBy: '更新人',
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

const modelList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      modelName: '模型名称' + index,
      modelAddress: '模型地址' + index,
      updateTime: '2023-12-12',
      creator: '创建人' + index,
      createTime: '2023-12-12',
      modifiedBy: '更新人',
    };
  });
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: data,
  });
};

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '是备案表改',
  });
};

export default {
  [`POST ${baseUrl}/services/model/modelPage`]: modelPage,
  [`POST ${baseUrl}/services/model/modelList`]: modelList,
  [`POST ${baseUrl}/services/model/modelDelete`]: normalDeal,
  [`POST ${baseUrl}/services/model/modelAdd`]: normalDeal,
  [`POST ${baseUrl}/services/model/modelEdit`]: normalDeal,
};
