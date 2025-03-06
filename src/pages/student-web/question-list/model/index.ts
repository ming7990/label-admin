import config from '@/config';
import { message } from 'antd';
import { useState } from 'react';
import { QuestionType } from '@/type/question';

const { successCode } = config;

import {
  getPaper, submitPaper, getPaperScore,
  getHistoryAnswer, getuserAnswer,
} from './api';

export const usePaperModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pref, setPref] = useState<string>('');
  // 分数表格;
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [scoreDetail, setScoreDetail] = useState<any>({});

  const [questionTypeList, setQuestionTypeList] = useState<[]>([]);
  const [paperInfor, setPaperInfor] = useState<{studyId?: string, answerTime?: number}>({answerTime: 0});
  const getPaperInfor = async (data: any) => {
    setLoading(true);
    const res: any = await getPaper(data);
    setLoading(false);
    if (res?.resultCode != successCode) return message.warn('获取试卷失败');
    setPref('questionId_'+String(Math.random()).slice(-6)); // 随机数;
    const { studyId, answerTime } = res?.data || {};
    // answerTime单位分钟;
    setPaperInfor({studyId, answerTime: answerTime*60*1000});
    setQuestionTypeList(res?.data?.questionTypeList || []);
  }

  // 获取分数;
  const getScore = async (data: any) => {
    setTableLoading(true);
    const res: any = await getPaperScore(data);
    setTableLoading(false);
    setScoreDetail(res?.data);
  }

  const onSubmitPaper = async (data: any) => {
    const res: any = await submitPaper(data);
    if (res?.resultCode == successCode) {
      message.success(res?.resultDesc);
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }

  return {
    loading,
    getPaperInfor,
    setQuestionTypeList,
    questionTypeList,
    paperInfor,
    submitPaper: onSubmitPaper,
    prefix: pref,
    // 分数结果表格
    tableLoading,
    getScore, // 获取分数
    scoreDetail,
  }
}

// 分数详情
export const usePaperDetailModel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pref, setPref] = useState<string>('detailId_'+String(Math.random()).slice(-6));
  const [questionTypeList, setQuestionTypeList] = useState<[]>([]);

  const geQuestionTypeList = (params: any) => {
    setLoading(true);
    getHistoryAnswer(params).then(async res => {
      const questionTypeList = res?.data?.questionTypeList || [];
      const res2 = await getuserAnswer(params);
      setLoading(false);
      if (res2?.resultCode != successCode) {
        message.error(res2?.resultDesc);
        return false;
      }
      const userAnswerList = res2?.data?.questionList || []; // 用户选择的答案;

      questionTypeList.forEach((typeItem: any) => {
        const soloScore = typeItem.soloScore; // 单题满分分数;
        if ([QuestionType.Radio, QuestionType.Multi, QuestionType.Judge].includes(typeItem.questionType)) {
          typeItem.questionList.forEach((questionItem: any) => {
            const userQuestionItem = userAnswerList.find((item: any) => item.questionId === questionItem.questionId); // 用户题目
            if (userQuestionItem?.studyPass == '1') {
              questionItem.finish = true; // 答案满分;
            }
            const userOption = userQuestionItem?.optionList || [];
            questionItem.optionList.forEach((rItem: any) => {
              const order = rItem.order;
              if (rItem.answer) {
                rItem.checked = true; // 正确的选项;
                if (userOption.find((item:any) => item.order == order)) rItem.right = true; // 选对了;
              } else {
                if (userOption.find((item:any) => item.order == order)) rItem.error = true; // 选错了;
              }
            });
          });
        } else if ([QuestionType.Fill, QuestionType.Essay, QuestionType.ShortAnswer].includes(typeItem.questionType)) {
          typeItem.questionList.forEach((questionItem: any) => {
            const userQuestionItem = userAnswerList.find((item: any) => item.questionId === questionItem.questionId); // 用户题目
            if (userQuestionItem?.studyPass == '1') {
              questionItem.finish = true; // 答案满分;
            }
            questionItem.score = userQuestionItem?.score;
            const ulist: any = userQuestionItem?.optionList || [];
            if (QuestionType.Fill == typeItem.questionType) {
              questionItem.optionList.forEach((oItem:any, i: number) => {
                const index = ulist.findIndex((item: any) => item.order == oItem.order);
                if (index === -1) {
                  // 用户不填次order的答案;
                  ulist[i] = {order: oItem.order, option: '', error: true};
                } else {
                  if (ulist[index].option == oItem.option) {
                    ulist[index].right = true;
                  } else {
                    ulist[index].error = true;
                  }
                }
              });
              questionItem.userOptionList = ulist;
            } else {
              ulist.forEach((item: any)=> {
                item.right = questionItem.finish;
                item.error = !questionItem.finish;
              });
              questionItem.userOptionList = ulist;
            }
          });
        }
      });
      console.log(questionTypeList,'questionTypeList');
      setQuestionTypeList(questionTypeList);
    });
  };
  const getScore = async (data: any) => {
    const res: any = await getPaperScore(data);
    if (res?.resultCode == successCode) {
      return res;
    } else {
      message.error(res?.resultDesc);
      return false;
    }
  }
  return {
    prefix: pref,
    loading,
    geQuestionTypeList,
    questionTypeList,
    getScore, // 获取分数;
  }
};
