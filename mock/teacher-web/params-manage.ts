import { Request, Response } from 'express';
import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const userPage = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      account: '账号' + index,
      userName: '用户名称' + index,
      roleName: '角色名称' + index,
      roleCode: ['student', 'teacher'],
      phoneNumber: 17680765678,
      groupId: '组别' + index,
      groupName: '组别名称' + index,
      organizationId: '1',
      updateTime: '2023-12-12',
      createTime: '2023-12-12',
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

const userList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      account: '账号' + index,
      userName: '用户名称' + index,
      phoneNumber: 17680765678,
      groupId: '组别' + index,
      groupName: '组别名称' + index,
      updateTime: '2023-12-12',
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: data,
  });
};

const groupList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      groupName: '组别名称' + index,
      updateTime: '2023-12-12',
      creator: '创建人' + index,
      createTime: '2022-12-12',
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: data,
  });
};

const organizationList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      organizationName: '机构名称' + index,
      updateTime: '2023-12-12',
      creator: '创建人' + index,
      createTime: '2022-12-12',
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

const groupPage = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      groupName: '组别名称' + index,
      updateTime: '2023-12-12',
      creator: '创建人' + index,
      createTime: '2022-12-12',
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

const organizationPage = (req: any, res: any) => {
  const data = [
    {
      id: 1,
      organizationName: '机构名称' + 1,
      updateTime: '2023-12-12',
      creator: '创建人' + 1,
      createTime: '2022-12-12',
    },
  ];
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

const tipsList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      title: '标题' + index,
      content: '任务名称' + index,
      creator: 'admin',
      createTime: '20240101',
      updateTime: '20240101',
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

// 生成随机时间  
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// 客户画像分页查询  
const profilePage = (req: any, res: any) => {
  const { page = 1, name } = req.query;

  let data = gen(10).map((_, index) => ({
    id: `CP${String(index).padStart(4, '0')}`,
    name: `客户画像${index + 1}-${['高价值客户', '潜在客户', '流失预警客户', '普通客户'][index % 4]}`,
    creator: ['张三', '李四', '王五'][index % 3],
    createTime: getRandomDate(new Date('2023-01-01'), new Date()),
    updateBy: ['系统管理员', '市场专员', '数据分析师'][index % 3],
    updateTime: getRandomDate(new Date('2024-01-01'), new Date()),
    description: `这是第${index + 1}个客户画像的详细描述...`,
    status: index % 2, // 0: 启用, 1: 禁用  
    tags: ['高消费', '信用良好', '活跃用户'].slice(0, index % 3 + 1)
  }));

  // 名称搜索过滤  
  if (name) {
    data = data.filter(item => item.name.includes(name));
  }

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      list: data,
      totalPage: 100,
    },
  });
};

// 客户画像详情  
const profileDetail = (req: any, res: any) => {
  const { customerProfileId } = req.query;

  const detail = {
    id: customerProfileId,
    name: `客户画像-${customerProfileId}`,
    creator: '张三',
    createTime: '2024-01-15',
    updateBy: '李四',
    updateTime: '2024-02-20',
    description: '这是客户画像的详细描述...',
    status: 0,
    tags: ['高消费', '信用良好', '活跃用户'],
    rules: [
      {
        id: 'R001',
        name: '消费金额',
        condition: '大于',
        value: 10000
      },
      {
        id: 'R002',
        name: '活跃度',
        condition: '等于',
        value: '高'
      }
    ]
  };

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: detail
  });
};

// 客户画像列表  
const profileList = (req: any, res: any) => {
  const data = gen(5).map((_, index) => ({
    id: `CP${String(index).padStart(4, '0')}`,
    name: `客户画像${index + 1}`,
    status: index % 2,
    createTime: getRandomDate(new Date('2024-01-01'), new Date())
  }));

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data
  });
};

// 通用操作响应  
const commonResponse = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '操作成功',
  });
};

// 音色类型数据  
const timbreTypes = ['主持人', '播音员', '配音演员', '明星音色'];
const genderTypes = ['男', '女'];

// 音色分页查询  
const getTimbreList = (req: any, res: any) => {
  const { page = 1, name } = req.query;

  let data = gen(10).map((_, index) => ({
    id: `TC${String(index).padStart(4, '0')}`,
    name: `${timbreTypes[index % 4]}音色${index + 1}`,
    sex: genderTypes[index % 2],
    type: timbreTypes[index % 4],
    creator: ['张三', '李四', '王五'][index % 3],
    createTime: getRandomDate(new Date('2023-01-01'), new Date()),
    updateBy: ['系统管理员', '音频专员', '配音导演'][index % 3],
    updateTime: getRandomDate(new Date('2024-01-01'), new Date()),
    description: `这是第${index + 1}个音色的详细描述...`,
    status: index % 2, // 0: 启用, 1: 禁用  
    pitch: Math.floor(Math.random() * 100), // 音调  
    speed: Math.floor(Math.random() * 100), // 语速  
    volume: Math.floor(Math.random() * 100), // 音量  
    sampleUrl: `https://example.com/audio/sample${index}.mp3` // 示例音频  
  }));

  // 名称搜索过滤  
  if (name) {
    data = data.filter(item => item.name.includes(name));
  }

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      list: data,
      totalPage: 100,
    },
  });
};

export default {
  [`POST ${baseUrl}/services/user/userPage`]: userPage,
  [`POST ${baseUrl}/services/user/userList`]: userList,
  [`POST ${baseUrl}/services/group/groupList`]: groupList,
  [`POST ${baseUrl}/services/user/userSynch`]: normalDeal,
  [`POST ${baseUrl}/services/user/userEdit`]: normalDeal,

  [`POST ${baseUrl}/services/group/groupPage`]: groupPage,
  [`POST ${baseUrl}/services/group/groupAdd`]: normalDeal,
  [`POST ${baseUrl}/services/group/groupEdit`]: normalDeal,
  [`POST ${baseUrl}/services/group/groupDelete`]: normalDeal,
  [`GET ${baseUrl}/services/organization/list`]: organizationList,
  [`GET ${baseUrl}/services/organization/page`]: organizationPage,
  [`POST ${baseUrl}/services/organization/add`]: normalDeal,
  [`POST ${baseUrl}/services/organization/edit`]: normalDeal,
  [`POST ${baseUrl}/services/organization/delete`]: normalDeal,
  [`POST ${baseUrl}/services/tips/list`]: tipsList,
  [`GET ${baseUrl}/services/user/groupUserList`]: userList,
  [`GET ${baseUrl}/services/user/groupList`]: groupList,

  // 客户画像管理
  [`GET ${baseUrl}/services/profile/page`]: profilePage,
  [`POST ${baseUrl}/services/profile/add`]: commonResponse,
  [`POST ${baseUrl}/services/profile/edit`]: commonResponse,
  [`POST ${baseUrl}/services/profile/delete`]: commonResponse,
  [`GET ${baseUrl}/services/profile/list`]: profileList,
  [`GET ${baseUrl}/services/profile/detail`]: profileDetail,

  // 音色配置管理
  [`GET ${baseUrl}/services/timbre/list`]: getTimbreList,
  [`POST ${baseUrl}/services/timbre/add`]: commonResponse,
  [`POST ${baseUrl}/services/timbre/edit`]: commonResponse,
  [`POST ${baseUrl}/services/timbre/delete`]: commonResponse,
};
