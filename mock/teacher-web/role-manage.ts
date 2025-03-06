import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const rolePage = (req: any, res: any) => {
  const { page, pageSize } = req.body;
  let list: any = gen(22).map((item: any, index: number) => {
    return {
      id: '角色编码' + index,
      roleName: '角色名称' + index,
      creator: '创建人' + index,
      updateTime: '2023年05月22日 - ' + index,
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
const roleList = (req: any, res: any) => {
  const items: any = gen(22).map((item: any, index: number) => {
    return {
      id: '角色编码' + index,
      roleName: '角色名称' + index,
      creator: '创建人' + index,
      updateTime: '2023年05月22日 - ' + index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: items,
  });
};

const roleSynch = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '角色同步成功',
  });
};

const getPermission = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      menuCodes: ['teacher_course_add_btn', 'teacher_course_copy_btn'],
      codes: ['/front/teacher/course'],
    },
  });
};

const savePermission = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '保存成功',
  });
};

export default {
  [`POST ${baseUrl}/services/role/rolePage`]: rolePage,
  [`POST ${baseUrl}/services/role/roleList`]: roleList,
  [`POST ${baseUrl}/services/role/getPermission`]: getPermission,
  [`POST ${baseUrl}/services/role/savePermission`]: savePermission,
  [`POST ${baseUrl}/services/role/roleSynch`]: roleSynch,
};
