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
      courseId: index,
      questionId: index+1,
      question: '任务名称' + index,
      questionType: index%5,
      questionNumber: index, //1-闯关模式   2-任意模式
      accuracy: 100, //1-培训   2--考试
      answerNum: index,
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

const getQuestionTypeList = (req: any, res: any) => {
  let data: any = gen(6).map((item: any, index: number) => {
    return {
      num: Math.ceil((Math.random()*10)),
      questionType: index%5,
    };
  });

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data,
  });
};

const getPaper = (req: any, res: any) => {
  const questionTypeList: any = gen(6).map((item: any, index: number) => {
    return {
        questionType: index, score: 50, soloScore: 10,
        questionList: [
          {
            question: '题目名称', questionId: 'q-id'+Math.random(),
            optionList: [
              {order: 0, option: '文本选项1'},
              {order: 1, option: '文本选项2'}
            ]
          },
          {
            question: '题目名称2', questionId: 'q-id-2'+Math.random(),
            optionList: [
              {order: 0, option: '文本选项1'},
              {order: 1, option: '文本选项2'}
            ]
          }
        ]
      }
  })

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      studyId: '123',
      answerTime: 60, // 分钟
      questionTypeList,
    },
  });
};

const getPaper2 = (req: any, res: any) => {
  const questionTypeList: any = [{
    questionType: 0, score: 50, soloScore: 10,
    questionList: [{
        question: '题目名称', questionId: 'q-id'+0,
        optionList: [
          {order: 0, option: '文本选项1'},
          {order: 1, option: '文本选项2'},
          {order: 1, option: '文本选项2', answer: true}
        ]
      }, {
        question: '题目名称2', questionId: 'q-id'+1,
        optionList: [
          {order: 0, option: '文本选项1'},
          {order: 1, option: '文本选项21', answer: true},
          {order: 2, option: '文本选项2'}
        ]
      }
    ]
  },
  {
    questionType: 1, score: 50, soloScore: 10,
    questionList: [{
        question: '题目名称', questionId: 'q-id1'+0,
        optionList: [
          {order: 0, option: '文本选项1'},
          {order: 1, option: '文本选项2'},
          {order: 2, option: '文本选项2', answer: true},
          {order: 3, option: '文本选项2', answer: true}
        ]
      }, {
        question: '题目名称2', questionId: 'q-id1'+1,
        optionList: [
          {order: 0, option: '文本选项1'},
          {order: 1, option: '文本选项21', answer: true},
          {order: 2, option: '文本选项2'}
        ]
      }
    ]
  },
  {
    questionType: 3, score: 50, soloScore: 10,
    questionList: [{
        question: '题目名称', questionId: 'q-id3'+0,
        optionList: [
          {order: 0, option: '文本选项1'},
          {order: 1, option: '文本选项2'},
          {order: 2, option: '文本选项2', answer: true},
          {order: 3, option: '文本选项2', answer: true}
        ]
      }, {
        question: '题目名称2', questionId: 'q-id3'+1,
        optionList: [
          {order: 0, option: '文本选项1'},
          {order: 1, option: '文本选项21', answer: true},
          {order: 2, option: '文本选项2'}
        ]
      }
    ]
  },
  {
    questionType: 4, score: 50, soloScore: 10,
    questionList: [{
        question: '题目名称', questionId: 'q-id4'+0,
        optionList: [
          {order: 0, option: '文本选项1'},
        ],
        keyPointList: [
          {order: 0, keyPoint: '关键点1'},
        ]
      }, {
        question: '题目名称2', questionId: 'q-id4'+1,
        optionList: [
          {order: 0, option: '文本选项1'},
        ],
        keyPointList: [
          {order: 0, keyPoint: '关键点1'},
        ]
      }
    ]
  }
]

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      studyId: '123',
      answerTime: 60, // 分钟
      questionTypeList,
    },
  });
};

const getuserAnswer = (req: any, res: any) => {
  const questionList: any = [
    {
      question: '题目名称', questionId: 'q-id'+0, questionType: 0, score: 0,
      optionList: [
        {order: 0, option: '文本选项1'},
      ]
    },
    {
      question: '题目名称', questionId: 'q-id'+1, questionType: 0, score: 10,
      optionList: [
        {order: 1, option: '文本选项2'}
      ]
    },
    {
      question: '题目名称', questionId: 'q-id'+2, questionType: 1, score: 10,
      optionList: [
        {order: 0, option: '文本选项1'},
        {order: 1, option: '文本选项2'},
        {order: 2, option: '文本选项2'}
      ]
    },
    {
      question: '题目名称', questionId: 'q-id4'+1, questionType: 4, score: 10,
      optionList: [
        {order: 0, option: '文本选项1'},
        {order: 1, option: '文本选项2'},
        {order: 2, option: '文本选项2'}
      ]
    }
  ]

  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      studyId: '123',
      answerTime: 60, // 分钟
      questionList,
    },
  });
};

const submitPaper = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {

    },
  });
}

const getScore = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      score: 90, passScore: 80,
      scoreList: [
        {
          questionType: 0, fullScore: 50, score: 48, key: 1
        },
        {
          questionType: 1, fullScore: 20, score: 48, key: 2
        },
        {
          questionType: 2, fullScore: 40, score: 48, key: 3
        }
      ]
    },
  });
}

const getQuestionDetail = (req: any, res: any) => {
  res.json({
    resultCode: successCode,
    resultDesc: '成功',
    data: {
      question: '题目名称',
      questionType: 1, questionNumber: '001',
      optionList: [
        {option: '选项1', order: 'A', answer: false},
        {option: '选项2', order: 'B', answer: true},
        {option: '选项3', order: 'C', answer: false},
        {option: '选项4', order: 'D', answer: true},
      ],
      similarity: '',
      keyPointList: [
        {keyPoint: '关键点'}
      ]
    },
  });
}

export default {
  // 获取课程信息
  [`GET ${baseUrl}/services/course/text/question/search`]: getNormalList,
  // 题型列表
  [`GET ${baseUrl}/services/course/text/questionType/search`]: getQuestionTypeList,
  // 考试试卷
  [`GET ${baseUrl}/services/course/text/paper/obtain`]: getPaper,
  [`GET ${baseUrl}/services/course/text/history/answer`]: getPaper2,
  [`GET ${baseUrl}/services/course/text/history/userAnswer`]: getuserAnswer,
  [`POST ${baseUrl}/services/course/text/paper/submit`]: submitPaper,
  // 获取分数;
  [`GET ${baseUrl}/services/course/text/score/obtain`]: getScore,
  // 题目详情;
  [`GET ${baseUrl}/services/course/text/question/detail`]: getQuestionDetail,
}