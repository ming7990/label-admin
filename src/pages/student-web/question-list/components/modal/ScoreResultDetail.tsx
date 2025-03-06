import React, { useState, useEffect, useImperativeHandle } from "react";
import { Button, Modal, Spin, Progress, Tag, Table } from 'antd';
import { usePaperDetailModel } from '../../model';
import { QuestionType, zh_index, questionTypeText } from '@/type/question';
import style from '../../style.less';
import Question from "../QuestionDetail";
import Sidebar from "../SidebarDetail";
import { history } from 'umi';

const ScoreResulDetailtModal = (props: any) => {
  const { goBack } = props;
  const [isOpen, setOpen] = useState(false);
  const [passScore, setPassScore] = useState(0);
  const [courseId, setCourseId] = useState('');
  const [studyId, setStudyId] = useState('');
  const [score, setScore] = useState(0);

  const { geQuestionTypeList, loading, questionTypeList, prefix, getScore } = usePaperDetailModel();

  const handleCancel = () => {
    setOpen(false);
    goBack && goBack();
  }
  const open = async ({ courseId, studyId }: any) => {
    geQuestionTypeList({ studyId });
    setStudyId(studyId);
    setCourseId(courseId);
    const res = await getScore({ studyId, courseId });
    if (res) {
      setScore(res?.data?.score);
      setPassScore(res?.data?.passScore);
    }
    setOpen(true);
  }
  useImperativeHandle(props.cref, () => ({
    open
  }))
  return (
    <Modal
      width="100%"
      visible={isOpen}
      className={style['model-bg']}
      title="详情"
      onCancel={handleCancel}
      footer={null}
      style={{ top: 0, height: '100vh' }}
    >
      <div className={style['exam-container']}>
        <Question
          courseId={courseId}
          prefix={prefix}
          loading={loading}
          questionTypeList={questionTypeList}
        />
        <Sidebar
          courseId={courseId}
          prefix={prefix}
          score={score}
          passScore={passScore}
          questionTypeList={questionTypeList}
        />
      </div>
    </Modal>
  )
}
export default ScoreResulDetailtModal;
