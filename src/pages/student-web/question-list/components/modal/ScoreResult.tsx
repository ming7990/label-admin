import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
import { Button, Modal, Spin, Progress, Tag, Table, message } from 'antd';
import { usePaperModel } from '../../model';
import { QuestionType, zh_index, questionTypeText } from '@/type/question';
import style from './style.less';
import PieProgress from "../PieProgress";
import { history } from 'umi';
import { useTaskVerify } from '../../../student-home/model';

const ScoreResultModal = (props: any) => {
  const { courseId, studyId, openDetail, removeEvt, taskId, goBack } = props;
  const [isOpen, setOpen] = useState(false);

  const { tableLoading, getScore, scoreDetail } = usePaperModel();
  const { score, passScore, scoreList = [] } = scoreDetail || {};
  const { taskVerify, taskRetake } = useTaskVerify();

  const columns = [
    {
      title: '题型', dataIndex: 'questionType',
      render: (val: any, row: any, index: number) => {
        return questionTypeText[val]
      },
    },
    { title: '总分', dataIndex: 'fullScore' },
    { title: '我的得分', dataIndex: 'score' },
  ];

  const handleOk = () => {
    setOpen(false);
    openDetail({ score, passScore });
  }
  const handleCancel = () => {
    setOpen(false);
    goBack();
  }
  const open = () => {
    getScore({ courseId, studyId });
    setOpen(true);
  }
  useImperativeHandle(props.cref, () => ({
    open
  }))

  const onAgain = () => {
    const fn = () => {
      removeEvt();
      window.location.reload();
    }
    taskVerify({ taskId, courseId }).then((res: any) => {
      const { needRetake, allowRetake } = res;
      if (!needRetake && !allowRetake) return message.warning(res.msg);
      if (needRetake && allowRetake) {
        Modal.confirm({
          title: res.msg,
          okText: '是',
          cancelText: '否',
          onOk: () => {
            taskRetake({ taskId, courseId }).then((res: boolean) => {
              if (res) {
                fn();
              }
            });
          },
          onCancel: () => { },
        });
      } else {
        fn();
      }
    });
  };
  return (
    <Modal
      width={410}
      visible={isOpen}
      className={style['model-bg']}
      title="得分结果"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          返回课程详情
        </Button>,
        <Button key="submit" onClick={handleOk}>
          答题详情
        </Button>,
        <Button
          key="link"
          type="primary"
          // loading={loading}
          // onClick={() => {
          //   removeEvt();
          //   window.location.reload();
          // }}
          onClick={onAgain}
        >
          再次考试
        </Button>,
      ]}
    >
      <Spin spinning={tableLoading}>
        <div className={style['score-box']}>
          <PieProgress percent={score} score={passScore}></PieProgress>
          <div style={{ fontSize: 14, marginTop: 10 }}>最终得分</div>
          {scoreList.length > 0 && (
            <Table
              rowKey="id"
              size="small"
              columns={columns}
              dataSource={scoreList}
              style={{ marginTop: '16px', width: '360px' }}
              pagination={false}
              scroll={{ y: 200 }}
              summary={(data) => {
                // let score = 0;
                // data.forEach(item => {
                //   score += item.score;
                // })
                return (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>100</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>{score}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )
              }}
            ></Table>
          )}
        </div>
      </Spin>
    </Modal>
  )
}
export default ScoreResultModal;
