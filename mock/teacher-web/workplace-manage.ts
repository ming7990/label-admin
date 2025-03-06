import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const workPlacePage = (req: any, res: any) => {
  const { page, pageSize } = req.body;
  let list: any = gen(22).map((item: any, index: number) => {
    return {
      id: index,
      name: '职场名' + index,
      creator: '创建人' + index,
      createTime: '2023年05月22日 - ' + index,
    };
  });

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
const workPlaceList = (req: any, res: any) => {
  const items: any = gen(5).map((item: any, index: number) => {
    return {
      id: index,
      name: '职场名' + index,
      creator: '创建人' + index,
      createTime: '2023年05月22日 - ' + index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: items,
  });
};

const workPlaceAdd = (req: any, res: any) => {
  const { name } = req.body;
  let code = successCode;
  let msg = '成功';
  if (name === '111') {
    code = '400';
    msg = '失败';
  }
  setTimeout(() => {
    res.json({
      resultCode: code,
      resultDesc: msg,
    });
  }, 2000);
};

const workPlaceDelete = (req: any, res: any) => {
  const { id } = req.body;
  let code = successCode;
  let msg = '成功';
  if (id === 1) {
    code = '400';
    msg = '该职场存在用户，无法删除，请先移除该职场下的用户。';
  }
  setTimeout(() => {
    res.json({
      resultCode: code,
      resultDesc: msg,
    });
  }, 2000);
};

const workPlaceEdit = (req: any, res: any) => {
  const { id, name } = req.body;
  let code = successCode;
  let msg = '成功';
  if (id === 1) {
    code = '400';
    msg = `修改 ${name} 失败`;
  }
  setTimeout(() => {
    res.json({
      resultCode: code,
      resultDesc: msg,
    });
  }, 2000);
};

export default {
  [`POST ${baseUrl}/services/workPlace/workPlacePage`]: workPlacePage,
  [`POST ${baseUrl}/services/workPlace/workPlaceList`]: workPlaceList,
  [`POST ${baseUrl}/services/workPlace/workPlaceAdd`]: workPlaceAdd,
  [`POST ${baseUrl}/services/workPlace/workPlaceDelete`]: workPlaceDelete,
  [`POST ${baseUrl}/services/workPlace/workPlaceEdit`]: workPlaceEdit,
};
