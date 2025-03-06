import React, { useEffect, useState, useCallback, memo } from "react";
import { Button, Popconfirm, Select, Input, Spin } from 'antd';
import { QuestionType, zh_index, questionTypeText, letter_index } from '@/type/question';
import style from '../style.less';

const fn = (old, newp) => {
  console.log(old, 'oo');
  if (JSON.stringify(old.optionList) == JSON.stringify(newp.optionList)) return true;
  return false;
}

// 选项;
const OptionBlock = memo((props: any) => {
  const { questionType, index, qindex, optionList, onSelect, onInput } = props;
  switch (questionType) {
    case QuestionType.Radio:
    case QuestionType.Multi:
    case QuestionType.Judge:
      return (
        <div className={style["answer-list"]}>
          {
            optionList.map((oitem, oindex: number) => (
              <div key={oindex} className={`${style["answer-btn"]} ${oitem.selected ? style["selected"] : ''}`} onClick={() => onSelect(index, qindex, oindex, questionType)}>
                <a>{`${oitem.order}.${oitem.option}`}</a>
              </div>
            ))
          }
        </div>
      )
      break;
    case QuestionType.Fill:
      // 填空;
      return (
        <div className={style["answer-list"]}>
          {
            optionList.map((oitem: any, oindex: number) => (
              <div key={oindex} className={`${style["input-area"]}`}>
                <span>({oindex + 1})：</span>
                <div style={{ flex: 1 }}><Input value={oitem.option} onChange={(e) => onInput(e.target.value, index, qindex, oindex, questionType)} placeholder="请输入" style={{ width: '100%' }} /></div>
              </div>
            ))
          }
        </div>
      )
      break;
    case QuestionType.ShortAnswer: // 简答;
    case QuestionType.Essay: // 论述;
      return (
        <div className={style["answer-list"]}>
          {
            optionList.map((oitem, oindex: number) => (
              <div key={oindex} className={`${style["input-area"]}`}>
                <Input.TextArea value={oitem.option} onChange={(e) => onInput(e.target.value, index, qindex, oindex, questionType)} rows={5} placeholder="请输入内容" style={{ width: '100%' }} />
              </div>
            ))
          }
        </div>
      )
      break;
    default:
      return null;
  }
})
// 题目;
const QuestionBlock = memo((props: any) => {
  const { prefix, index, questionList, questionType, soloScore, score, onSelect, onInput } = props;
  return (
    <div className={style["question-block"]}>
      <p className={style["qtle"]}>{`${zh_index[index]}、${questionTypeText[questionType]}`} <span>{`（每题${soloScore}分，共计${score}分）`}</span></p>
      <section className={style["question-detail"]}>
        {
          questionList.map((qitem: any, qindex: number) => (
            <div className={style["answer-index"]} key={qitem.questionId}>
              <div className={style["name"]} id={`${prefix}_${index}_${qindex}`}>{`${qindex + 1}. ${qitem.question}`}</div>
              <OptionBlock
                key={qindex}
                {...qitem}
                qindex={qindex}
                index={index}
                questionType={questionType}
                onSelect={onSelect}
                onInput={onInput}
              />
            </div>
          ))
        }
      </section>
    </div>
  )
})

const Question: React.FC<any> = (props) => {
  const { courseId, prefix, loading, questionTypeList, setQuestionTypeList } = props;

  console.log(questionTypeList, 'questionTypeList');

  const onSelect = useCallback(
    (typeIndex: number, parentIndex: number, index: number, questionType: QuestionType) => {
      console.log(typeIndex, parentIndex);
      const newData = [...questionTypeList];
      console.log(newData);
      const questionList = newData[typeIndex].questionList;
      const optionList = questionList[parentIndex].optionList;
      if ([QuestionType.Radio, QuestionType.Judge].includes(questionType)) {
        if (optionList[index].selected) {
          optionList[index].selected = false;
        } else {
          optionList.forEach((item: any) => item.selected = false); // 重置;
          optionList[index].selected = true;
        }
        if (optionList.find((item: any) => item.selected === true)) {
          questionList[parentIndex].finish = true; // 是否完成;
        } else {
          questionList[parentIndex].finish = false;
        }
      } else if ([QuestionType.Multi].includes(questionType)) {
        optionList[index].selected = !optionList[index].selected;
        if (optionList.filter((item: any) => item.selected === true).length > 1) {
          questionList[parentIndex].finish = true; // 是否完成;
        } else {
          questionList[parentIndex].finish = false;
        }
      }
      setQuestionTypeList(newData);
    }, [questionTypeList]);
  const onInput = (val: string | undefined, typeIndex: number, parentIndex: number, index: number, questionType: QuestionType) => {
    const newData = [...questionTypeList];
    const questionList = newData[typeIndex].questionList;
    const optionList = questionList[parentIndex].optionList;
    optionList[index] = { ...optionList[index], option: val };
    if (optionList.find((item: any) => (item.option == '' || item.option == undefined))) {
      // 是否完成;
      questionList[parentIndex] = { ...questionList[parentIndex], finish: false };
    } else {
      questionList[parentIndex] = { ...questionList[parentIndex], finish: true };
    }
    setQuestionTypeList(newData);
  }

  return (
    <div className={style["question-container"]}>
      <Spin spinning={loading}>
        <div className={style["question-box"]}>
          {
            questionTypeList.map((item: any, index: number) => (
              <QuestionBlock
                key={index}
                {...item}
                onSelect={onSelect}
                onInput={onInput}
                prefix={prefix}
                index={index}
              />
            ))
          }
        </div>
      </Spin>
    </div>
  );
};
export default Question;
