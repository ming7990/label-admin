import React, { useState, useEffect, useRef, useImperativeHandle, useCallback } from "react";
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from '../style.less';
import CountDown from "./CountDown";
import ScoreResult from './modal/ScoreResult';
import { QuestionType, zh_index, questionTypeText, letter_index } from '@/type/question';
import PieProgress from "./PieProgress";
import ScoreResulDetailtModal from "./modal/ScoreResultDetail";
import BtnAuth from '@/components/BtnAuth';

const Sidebar: React.FC<any> = (props: any) => {
  const { taskId, nodeId, courseId, prefix, paperInfor, questionTypeList, submitPaper, removeEvt, setIsSubmit, goBack } = props;
  console.log(paperInfor, 'paperInfor', questionTypeList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finish, setFinish] = useState(false);
  const [done, setDone] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [end, setEnd] = useState(false);

  const scoreRef = useRef(null);
  const detailRef = useRef(null);
  const countdownRef = useRef(null);
  const answerRef = useRef([]);
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
            order: opt.order,
            // order: selectType.includes(questionType) ? (opt.selected ? opt.order : '') : opt.order,
            option: opt.option || '',
            answer: selectType.includes(questionType) ? (opt.selected ? true : false) : true,
          });
        });
        answers.push({
          questionId: item.questionId,
          question: item.question,
          soloScore: question.soloScore,
          optionList,
          questionType
        })
      });
    });
    return { isFinish, answers };
  };
  const onSubmit = () => {
    const { isFinish, answers } = getAnswer();
    answerRef.current = answers;
    setFinish(isFinish);
    setIsModalOpen(true);
  }

  // isAuto 倒计时结束自动提交;
  const handleOk = async (isAuto: boolean = false) => {
    setIsModalOpen(false);
    setBtnLoading(true);
    // 提交
    const res = await submitPaper({
      courseId,
      taskId,
      taskNodeId: nodeId,
      studyId: paperInfor.studyId,
      questionList: isAuto ? getAnswer().answers : answerRef.current
    });
    setBtnLoading(false);
    if (res) {
      setDone(true);
      removeEvt && removeEvt();
      setIsSubmit && setIsSubmit(true);
      scoreRef.current?.open();
      countdownRef.current?.clear(); // 清除倒计时
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  }

  useImperativeHandle(props.cref, () => ({
    onSubmit
  }));

  const onScrollTo = (index: number, qindex: number) => {
    const id = `${prefix}_${index}_${qindex}`;
    // 锚点;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const onTimeEnd = () => {
    removeEvt && removeEvt();
    setIsSubmit && setIsSubmit(true);
    setEnd(true); // 自动提交;
  };

  useEffect(() => {
    end && handleOk(true);
  }, [end]);

  return (
    <div className={style["sidebar-container"]}>
      <CountDown
        cref={countdownRef}
        totalTime={paperInfor.answerTime}
        onTerminate={onTimeEnd}
      ></CountDown>
      <div className={style["answer-box"]}>
        <h3 className={style.tle}>答题卡</h3>
        <div className={style["answer-wrap"]}>
          {
            questionTypeList.map((item: any, index: number) => (
              <div key={index} className={style["answer-list"]}>
                <p className={style.atle}>{`${zh_index[index]}、${questionTypeText[item.questionType]}`}</p>
                <div className={style["select-list"]}>
                  {
                    item.questionList.map((qitem: any, qindex: number) => (
                      <span key={qindex} onClick={() => onScrollTo(index, qindex)} className={`${style.index} ${qitem.finish ? style.done : ''}`}>{qindex + 1}</span>
                    ))
                  }
                </div>
              </div>
            ))
          }
          <div className={style["opt-box"]}>
            <div className={style['status-box']}>
              <span className={`${style.status} ${style.done}`}>已答</span>
              <span className={style.status}>未答</span>
            </div>
            <BtnAuth authKey={'submit_answer_btn'}>
              <Button disabled={done} loading={btnLoading} style={{ width: '100%' }} type="primary" onClick={onSubmit}>交卷</Button>
            </BtnAuth>
          </div>
        </div>
      </div>
      {/* 二次确认弹窗 */}
      <Modal title="" visible={isModalOpen} onOk={() => handleOk()} onCancel={handleCancel}>
        <div style={{ "fontSize": "16px" }}><ExclamationCircleOutlined style={{ color: "#FFC53D", marginRight: "10px" }} />
          {
            finish ? '交卷后无法作答，确定要交卷吗?' : '当前存在题目未完成作答，确定要交卷吗?'
          }
        </div>
      </Modal>
      {/* 得分结果 */}
      <ScoreResult
        studyId={paperInfor.studyId}
        courseId={courseId}
        cref={scoreRef}
        openDetail={(o: any) => detailRef.current?.open({ studyId: paperInfor.studyId, courseId: courseId })}
        removeEvt={removeEvt}
        taskId={taskId}
        goBack={goBack}
      ></ScoreResult>
      <ScoreResulDetailtModal studyId={paperInfor.studyId} cref={detailRef} taskId={taskId} goBack={goBack} />
    </div >
  );
};
export default Sidebar;
