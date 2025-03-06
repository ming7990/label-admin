import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;

const gen = (num: number) => {
  return new Array(num).fill(0);
};

const getList = (req: any, res: any) => {
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
const getFileList = (req: any, res: any) => {
  let data: any = gen(2).map((item: any, index: number) => {
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

const getDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      title: 'test',
    },
  });
};

const classAll = (req: any, res: any) => {
  let data: any = gen(5).map((item: any, index: number) => {
    return {
      className: '任务' + index,
      type: 'test',
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};
const classList = (req: any, res: any) => {
  let data: any = gen(5).map((item: any, index: number) => {
    return {
      className: '任务' + index,
      type: 'test',
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      totalPage: 11,
      list: data,
    },
  });
};

const fileRecordAll = (req: any, res: any) => {
  let data: any = gen(5).map((item: any, index: number) => {
    return {
      name: '任务' + index,
      classId: 'test_' + index,
      type: 'test',
      id: index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      list: data,
    },
  });
};

export default {
  [`GET ${baseUrl}/services/course/video/detail`]: getDetail,
  [`GET ${baseUrl}/services/course/video/list`]: getList,
  [`GET ${baseUrl}/services/course/video/fileList`]: getFileList,
  [`GET ${baseUrl}/services/common/class/all`]: classAll,
  [`GET ${baseUrl}/services/common/class/page`]: classList,
  [`GET ${baseUrl}/services/share/fileRecord/all`]: fileRecordAll,
};
