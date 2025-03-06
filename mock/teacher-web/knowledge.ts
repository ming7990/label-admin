import config from '../../src/config';

const successCode = config.successCode;

const baseUrl = config.basePath;
const gen = (num: number) => {
  return new Array(num).fill(0);
};

const getKnoledgeList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,
      knowledgeId: Math.random(),
      knowledgeName: '任务名称' + index,
      knowledgeType: index,
      createTime: '2022',
      readNum: 100,
      likeNum: 100,
      creator: 'admin',
      viewAccess: 0,
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

const getCreatorList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      account: 'xx' + index,
      userName: '名称' + index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};

const getDirectory = (req: any, res: any) => {
  let data: any = gen(2).map((item: any, index: number) => {
    return {
      id: `${index}_` + Math.random(),
      className: '目录名称' + String(Math.random()).slice(5),
      // isDirectory: Math.random() > .5 ? true : false,
      isDirectory: true,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};

const upload = (req: any, res: any) => {
  let data: any = gen(5).map((item: any, index: number) => {
    return {
      id: Math.random(),
      className: '目录名称' + Math.random(),
      isDirectory: Math.random() > 0.5 ? true : false,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: { url: 'https://www.test.com/' },
  });
};
const message = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: { url: 'https://www.test.com/' },
  });
};

const getCommentList = (req: any, res: any) => {
  let data: any = gen(11).map((item: any, index: number) => {
    return {
      id: index,

      readNum: 100,
      likeNum: 100,
      isLike: Math.random() > 0.5,
      isTop: Math.random() > 0.5,
      ableComment: Math.random() > 0.5,
      comments: '评论内人' + index,
      creator: '用户',
      createTime: '2023',
      replyList: [
        {
          id: Math.random(),
          creator: '用户',
          likeNum: 100,
          commentedUser: '张三',
        },
      ],
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

const getDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      id: 'id_11',
      knowledgeId: 12345,
      knowledgeType: 2,
      knowledgeName: '标题-test',
      knowledge: '的萨芬大师傅地方大师傅士大夫地方大师傅',
      creator: '创建人-xx',
      createTime: '2023',
      likeNum: 123,
      isLike: true,
      viewAccess: 0,
    },
  });
};

const getFiles = (req: any, res: any) => {
  let data: any = gen(5).map((item: any, index: number) => {
    return {
      id: index,
      fileName: '文件名称' + index,
      storage: 12345, // kb
      url: 'https://static.youcash.com/group1/M01/03/64/C28G7WFfpsaAIp1EAAGlvgPhUcA012.png',
      urlList: [
        'https://static.youcash.com/group1/M01/03/64/C28G7WFfpsaAIp1EAAGlvgPhUcA012.png',
        '/output.flv',
      ],
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};

const like = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
  });
};

const getListAll = (req: any, res: any) => {
  let data: any = gen(5).map((item: any, index: number) => {
    return {
      id: index,
      knowledgeId: index,
      knowledgeName: 'test' + index,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};

// 品质列表查询  
const qualityList = (req: any, res: any) => {
  const { page = 1, name, typeList, creatorList } = req.body;

  let data = gen(10).map((_, index) => ({
    id: `QL${String(index).padStart(4, '0')}`,
    knowledgeName: `${['前端性能优化', 'UI组件设计', '后端架构', '数据结构'][index % 4]}-${index + 1}`,
    knowledgeType: index % 4,
    createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    creator: ['系统管理员', '质量专家', '技术主管'][index % 3],
    content: `这是第${index + 1}份质量文档的详细说明...`,
    type: index % 4, // 对应前端type字段  
    name: `${['前端性能优化', 'UI组件设计', '后端架构', '数据结构'][index % 4]}-${index + 1}`, // 对应前端name字段  
  }));

  // 搜索过滤  
  if (name) {
    data = data.filter(item => item.name.includes(name));
  }
  if (typeList?.length) {
    data = data.filter(item => typeList.includes(item.type));
  }
  if (creatorList?.length) {
    data = data.filter(item => creatorList.includes(item.creator));
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

// 题库列表查询  
const qualityQuestionList = (req: any, res: any) => {
  const { page = 1, question, knowledgePoints, questionType, status } = req.body;

  let data = gen(10).map((_, index) => ({
    id: `QQ${String(index).padStart(4, '0')}`,
    question: `以下关于${['React Hooks', 'TypeScript', 'Node.js', 'WebPack'][index % 4]}的说法，哪些是正确的？`,
    knowledgePoints: `${['前端框架', '编程语言', '后端技术', '构建工具'][index % 4]}-知识点${index + 1}`,
    questionType: index % 4, // 0: 单选, 1: 多选, 2: 判断, 3: 简答  
    status: index % 3, // 0: 待发布, 1: 已发布, 2: 已下线  
    difficultyLevel: index % 3 + 1, // 1: 简单, 2: 中等, 3: 困难  
    options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
    answer: ['A', 'B'],
    analysis: `解析：这道题目主要考察${['React Hooks', 'TypeScript', 'Node.js', 'WebPack'][index % 4]}的基本概念...`
  }));

  // 搜索过滤  
  if (question) {
    data = data.filter(item => item.question.includes(question));
  }
  if (knowledgePoints) {
    data = data.filter(item => item.knowledgePoints.includes(knowledgePoints));
  }
  if (questionType?.length) {
    data = data.filter(item => questionType.includes(item.questionType));
  }
  if (status?.length) {
    data = data.filter(item => status.includes(item.status));
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

// 添加/编辑/删除操作的通用响应  
const commonResponse = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '操作成功',
  });
};

// 生成试题  
const qualityGenQuestion = (req: any, res: any) => {
  const { knowledgeId, count = 5 } = req.body;

  const questions = gen(count).map((_, index) => ({
    id: `GQ${String(index).padStart(4, '0')}`,
    question: `基于知识点自动生成的第${index + 1}道试题...`,
    questionType: index % 4,
    status: 0, // 默认待发布  
    difficultyLevel: Math.floor(Math.random() * 3) + 1,
  }));

  res.json({
    resultCode: successCode,
    resultDesc: '试题生成成功',
    data: questions
  });
};

// 生成试题  
const getId = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '试题生成成功',
    data: {
      id: 'cdafdsafadswaefawefwaefea'
    }
  });
};

export default {
  // 获取知识库列表
  [`POST ${baseUrl}/services/knowledge/list`]: getKnoledgeList,
  // 文件目录
  [`GET ${baseUrl}/services/knowledge/file/directory`]: getDirectory,
  // // 考试试卷
  [`GET ${baseUrl}/services/knowledge/creator`]: getCreatorList,
  [`POST ${baseUrl}/services/knowledge/file/upload`]: upload,
  [`POST ${baseUrl}/services/knowledge/video/message`]: message,
  // // 获取评论;
  [`GET ${baseUrl}/services/knowledge/comment/list`]: getCommentList,
  // // 知识库详情;
  [`GET ${baseUrl}/services/knowledge/detail`]: getDetail,
  [`GET ${baseUrl}/services/knowledge/file`]: getFiles,
  [`POST ${baseUrl}/services/knowledge/comment/like`]: like,
  [`GET ${baseUrl}/services/knowledge/list/all`]: getListAll,
  // 品质知识库
  [`POST ${baseUrl}/services/knowledge/qualityList`]: qualityList,
  [`POST ${baseUrl}/services/knowledge/addQuality`]: commonResponse,
  [`POST ${baseUrl}/services/knowledge/editQuality`]: commonResponse,
  [`POST ${baseUrl}/services/knowledge/deleteQuality`]: commonResponse,
  [`POST ${baseUrl}/services/knowledge/qualityGenQuestion`]: qualityGenQuestion,
  [`POST ${baseUrl}/services/knowledge/qualityQuestionLis`]: qualityQuestionList,
  [`POST ${baseUrl}/services/knowledge/editQualityQuestion`]: commonResponse,
  [`POST ${baseUrl}/services/knowledge/qualityQuestionStatus`]: commonResponse,
  [`POST ${baseUrl}/services/knowledge/deleteQualityQuestion`]: commonResponse,
  [`GET ${baseUrl}/services/knowledge/getId`]: getId,
}
