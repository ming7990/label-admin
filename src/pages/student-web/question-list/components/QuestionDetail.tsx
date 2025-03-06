import React, { useEffect, useState, useCallback, memo } from "react";
import { Button, Popconfirm, Select, Input, Spin } from 'antd';
import { QuestionType, zh_index, questionTypeText, letter_index } from '@/type/question';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from '../style.less';

// 选项;
const OptionBlock = memo((props: any) => {
  const { questionType, index, qindex, optionList, userOptionList = [], keyPointList = [] } = props;
  switch (questionType) {
    case QuestionType.Radio:
    case QuestionType.Multi:
    case QuestionType.Judge:
      return (
        <div className={style["answer-list"]}>
          {
            optionList.map((oitem, oindex: number) => (
              <div key={oindex} className={`${style["answer-btn"]} ${oitem.right && style["selected"]} ${oitem.error && style["error"]}`}>
                <div className={style.optionItem}>{`${oitem.order}.${oitem.option}`}
                  {
                    oitem.checked && <CheckCircleOutlined className={style.checked} />
                  }
                  {
                    oitem.error && <CloseCircleOutlined className={style.errorIcon} />
                  }
                </div>
              </div>
            ))
          }
        </div>
      )
      break;
    case QuestionType.Fill:
      // 填空;
      return (
        <div className={style["answer-list-detail"]}>
          <div className={style["answer-list"]}>
            {
              userOptionList.map((oitem: any, oindex: number) => (
                <div key={oindex} className={`${style["input-area"]}`}>
                  <span>({oindex + 1})：</span>
                  <div style={{ flex: 1 }}>
                    <Input readOnly value={oitem.option} style={{ width: '100%' }} />
                  </div>
                  {
                    oitem.right && <CheckCircleOutlined style={{ margin: '8px 4px 0 4px' }} className={style.checked} />
                  }
                  {
                    oitem.error && <CloseCircleOutlined style={{ margin: '8px 4px 0 4px' }} className={style.errorIcon} />
                  }
                </div>
              ))
            }
          </div>
          <div className={style["cankao-detail"]}>
            <div className={style["cankao-list"]}>参考答案：</div>
            {
              optionList.map((oitem: any, oindex: number) => (
                <div key={oindex} className={style["cankao"]}>
                  <span>({oindex + 1})：</span><div style={{ flex: 1 }}>{oitem.option}</div>
                </div>
              ))
            }
          </div>
        </div>
      )
      break;
    case QuestionType.ShortAnswer: // 简答;
    case QuestionType.Essay: // 论述;
      return (
        <div className={style["answer-list-detail"]}>
          <div className={style["answer-list"]}>
            {
              userOptionList.map((oitem, oindex: number) => (
                <div key={oindex} className={`${style["input-area"]}`}>
                  <div style={{ flex: 1 }}>
                    <Input.TextArea value={oitem.option} readOnly rows={5} style={{ width: '100%' }} />
                  </div>
                  {
                    oitem.right && <CheckCircleOutlined style={{ margin: '50px 4px 0 4px' }} className={style.checked} />
                  }
                  {
                    oitem.error && <CloseCircleOutlined style={{ margin: '50px 4px 0 4px' }} className={style.errorIcon} />
                  }
                </div>
              ))
            }
          </div>
          <div className={style["cankao-detail"]}>
            {
              optionList.map((oitem: any, oindex: number) => (
                <div key={oindex} className={style["cankao2"]}>
                  <div className={style["cankao-tle"]}>参考答案{oindex + 1}：</div>
                  <div className={style["cankao-txt"]}>{oitem.option}</div>
                </div>
              ))
            }
          </div>
          <div className={style["cankao-detail"]} style={{ paddingTop: 0 }}>
            {
              keyPointList.map((oitem: any, oindex: number) => (
                <div key={oindex} className={style["cankao2"]}>
                  <div className={style["cankao-tle"]}>关键点{oindex + 1}：</div>
                  <div className={style["cankao-txt"]}>{oitem.keyPoint}</div>
                </div>
              ))
            }
          </div>
        </div >
      )
      break;
    default:
      return null;
  }
})
// 题目;
const QuestionBlock = memo((props: any) => {
  const { prefix, index, questionList, questionType, soloScore, score } = props;
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
              />
            </div>
          ))
        }
      </section>
    </div>
  )
})

const QuestionDetail: React.FC<any> = (props) => {
  const { courseId, prefix, loading, questionTypeList, setQuestionTypeList } = props;

  return (
    <div className={`${style["question-container"]}`}>
      <Spin spinning={loading}>
        <div className={`${style["question-box"]} ${style.answerDetail}`}>
          {
            questionTypeList.map((item: any, index: number) => (
              <QuestionBlock
                key={index}
                {...item}
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
export default QuestionDetail;
