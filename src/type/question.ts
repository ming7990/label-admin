// 题目类型
export enum QuestionType {
  Radio = 0, // 单选
  Multi = 1, // 多选题
  Judge = 2, // 判断题
  Fill = 3, // 填空题
  ShortAnswer = 4, // 简答题
  Essay  = 5, //论述题
}

// 下拉单选，选项为：单选题，多选题，判断题，填空题，简答题，论述题；
export const QuestionTypeList = [
  {label: '单选题', value: QuestionType.Radio},
  {label: '多选题', value: QuestionType.Multi},
  {label: '判断题', value: QuestionType.Judge},
  {label: '填空题', value: QuestionType.Fill},
  {label: '简答题', value: QuestionType.ShortAnswer},
  {label: '论述题', value: QuestionType.Essay},
]

const o = {};
QuestionTypeList.forEach(({ label, value }) => {
  o[value] = label
});
export const questionTypeText = o;

export const QuestionIndex = {
  [QuestionType.Radio]: 'A',
  [QuestionType.Multi]: 'B',
  [QuestionType.Judge]: 'C',
  [QuestionType.Fill]: 'D',
  [QuestionType.ShortAnswer]: 'E',
  [QuestionType.Essay]: 'F',
}

export const zh_index = {
  0: '一',
  1: '二',
  2: '三',
  3: '四',
  4: '五',
  5: '六',
  6: '七',
  7: '八',
}

export const letter_index = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  12: 'L',
  13: 'M',
  14: 'N',
  15: 'O',
}
