import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from '../style.less';

import { QuestionType, zh_index, questionTypeText, letter_index } from '@/type/question';
import PieProgress from "./PieProgress";

const Sidebar: React.FC<any> = (props: any) => {
  const { courseId, prefix, questionTypeList, passScore, score } = props;


  const [finish, setFinish] = useState(false);

  // 选择类型的题目;
  const selectType = [QuestionType.Radio, QuestionType.Multi, QuestionType.Judge];

  const getAnswer = () => {
    let isFinish = true;
    const answers: any = [];
    questionTypeList.forEach((question: any) => {
      const { questionType } = question;
      question.questionList.forEach((item: any) => {
        if (!item.finish) isFinish = false;
        const optionList: any = [];
        item.optionList.forEach((opt: any, index: number) => {
          optionList.push({
            order: selectType.includes(questionType) ? (opt.selected ? opt.order : '') : opt.order,
            option: opt.option
          })
        });

        answers.push({
          questionId: item.questionId,
          question: item.question,
          soloScore: question.soloScore,
          optionList,
        })
      });
    });
    return { isFinish, answers };
  }

  const onScrollTo = (index: number, qindex: number) => {
    const id = `${prefix}_${index}_${qindex}`;
    // 锚点;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className={`${style["sidebar-container"]} ${style.answerDetail}`}>
      <div className={style["score-box"]}>
        <h3 className={style.tle}>合计得分</h3>
        <div className={style["pie-box"]}>
          <PieProgress percent={score} score={passScore}></PieProgress>
        </div>
      </div>
      <div className={style["answer-box"]}>
        <h3 className={style.tle}>答题卡</h3>
        <div className={style["answer-wrap"]}>
          {
            questionTypeList.map((item: any, index: number) => (
              <div key={index} className={style["answer-list"]}>
                <p className={style.atle}>{`${zh_index[index]}、${questionTypeText[item.questionType]}`}</p>
                <div className={style["select-list"]}>
                  {
                    [QuestionType.Radio, QuestionType.Multi, QuestionType.Judge, QuestionType.Fill].includes(item.questionType) &&
                    item.questionList.map((qitem: any, qindex: number) => (
                      <span key={qindex} onClick={() => onScrollTo(index, qindex)} className={`${style.index} ${qitem.finish ? style.done : style.error}`}>{qindex + 1}</span>
                    ))
                  }
                  {
                    [QuestionType.ShortAnswer, QuestionType.Essay].includes(item.questionType) &&
                    item.questionList.map((qitem: any, qindex: number) => (
                      <div className={`${style["scoreBox"]} ${qitem.finish ? style.done : style.error}`}>
                        <span key={qindex} onClick={() => onScrollTo(index, qindex)} className={`${style.index} ${qitem.finish ? style.done : style.error}`}>{qindex + 1}</span>
                        <span className={style["score"]}>得分{qitem.score}分</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
          <div className={style["opt-box"]}>
            <div className={style['status-box']}>
              <span className={`${style.status} ${style.done}`}>满分</span>
              <span className={`${style.status} ${style.error}`}>未满分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// 答题详情;
export default Sidebar;
