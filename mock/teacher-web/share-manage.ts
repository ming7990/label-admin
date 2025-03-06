import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;
const gen = (num: number) => {
  return new Array(num).fill(0);
};

const getNormalList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      classId: index,
      name: '共享名称' + index,
      type: Math.floor(Math.random() * 4),
      creator: '创建人' + index,
      createTime: '2024年02月18日 - ' + index,
      updateTime: '2024年02月18日 - ' + index,
      userName: '用户' + index,
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

const normalDeal = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      name: 'test',
    },
  });
};

const getFileList = (req: any, res: any) => {
  let data: any = gen(1).map((item: any, index: number) => {
    return {
      fileName: '任务' + index,
      urlList: [],
      fileNumber: index,
      id: index,
      storage: 12345,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};

const getCreateId = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: '9527',
    },
  });
};

export default {
  [`GET ${baseUrl}/services/share/fileRecord/page`]: getNormalList,
  [`POST ${baseUrl}/services/share/fileRecord/delete`]: normalDeal,
  [`GET ${baseUrl}/services/share/fileRecord/detail`]: getDetail,
  [`GET ${baseUrl}/services/share/file/videoList`]: getFileList,
  [`GET ${baseUrl}/services/common/createId`]: getCreateId,
  [`POST ${baseUrl}/services/share/video/upload`]: normalDeal,
  [`POST ${baseUrl}/services/share/fileRecord/add`]: normalDeal,
  [`POST ${baseUrl}/services/share/fileRecord/edit`]: normalDeal,
  [`POST ${baseUrl}/services/common/class/add`]: normalDeal,
  [`POST ${baseUrl}/services/common/class/edit`]: normalDeal,
};
