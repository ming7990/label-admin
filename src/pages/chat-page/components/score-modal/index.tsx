import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Button, Modal, Progress, Tag, Table, Spin, message } from 'antd';
import * as echarts from 'echarts';
import { useChatModel } from '../../model';
import { getConfig, columns } from './config';
import ChatRecord from '@/pages/student-web/learn-record/components/chatRecord';
import style from './style.less';
import { useTaskVerify } from '../../../student-web/student-home/model'
import { history } from 'umi';

const wait = (second: any) => {
  return new Promise((reslove: any, reject: any) => {
    setTimeout(() => {
      reslove();
    }, second * 1000);
  });
};

export function formateNum(val: number): any {
  if (isNaN(val) || !val) {
    return '0';
  }
  let str1 = Number(val.toFixed(0));
  let str2 = Number(val.toFixed(2));
  let str = Number(str1) === Number(str2) ? str1 : str2;
  return str;
}

const ScoreModal: any = (props: any) => {
  const { cref, loading, confirm, cancel } = props;
  const query: any = history.location.query || {};
  const taskId: any = query?.taskId;
  const { getStepResult, setResultLoading, resultLoading } = useChatModel();
  const { taskVerify, taskRetake } = useTaskVerify();
  const pieRef: any = useRef<any>(null);
  const pieDomRef: any = useRef<any>(null);

  const [studyId, setStudyId] = useState<any>('');
  const [courseId, setCourseId] = useState<any>('');
  // const [taskId, setTaskId] = useState<any>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [score, setScore] = useState<any>(0);

  const [pass, setPass] = useState<any>(false);
  const [passScore, setPassScore] = useState<any>(0);

  const [percent, setPercent] = useState<any>(100);

  const [tableData, setTableData] = useState<any[]>([]);

  const chatRecordRef = useRef<any>();

  const open = async (data?: any) => {
    if (resultLoading) {
      return;
    }
    let _studyId = data?.studyId;
    if (_studyId !== studyId) {
      setStudyId(_studyId);
      setCourseId(data?.courseId);
      setResultLoading(true);
      await wait(1);
    }
    let res: any = await getStepResult(data);

    if (res) {
      console.log(res, '获取成绩');
      let { scoreDetail = [], deductPoints = [], score, studyPass, fullScore, passScore } = res;
      initOptions(scoreDetail || []);
      setIsModalOpen(true);
      setScore(score);
      let val = Number(((score / (fullScore || 100)) * 100).toFixed(2));
      setPercent(val);
      setPass(studyPass);
      setPassScore(passScore);
      setTableData(deductPoints);
    } else {
      message.warning('获取成绩失败');
    }
  };

  const initOptions = (data: any) => {
    const options: any = getConfig(data);
    console.log(pieRef.current);
    pieRef.current?.setOption?.(options);
  };

  const handleOk = () => {
    console.log('handleOk');
    const fn = () => {
      setIsModalOpen(false);
      confirm?.();
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

  const handleClose = () => {
    console.log('handleClose');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log('handleCancel');
    setIsModalOpen(false);
    cancel?.();
  };

  useImperativeHandle(cref, () => ({
    open,
  }));

  const checkOk = () => {
    chatRecordRef?.current?.open({ id: studyId, courseId });
  };

  useEffect(() => {
    const chartDom = document.getElementById('pie-box');
    pieRef.current = echarts.init(chartDom as any);
  }, []);

  return (
    <Modal
      title="得分结果"
      forceRender={true}
      visible={isModalOpen}
      className={style['model-bg']}
      maskClosable={false}
      width={'920px'}
      onOk={handleOk}
      okText={'再次拨打'}
      cancelText={'返回课程详情'}
      onCancel={handleClose}
      footer={
        <div className={style['zy-row_end']}>
          <Button type="default" onClick={handleClose}>
            关闭
          </Button>
          <Button key="submit" onClick={checkOk}>
            查看详情
          </Button>,
          <Button type="default" onClick={handleCancel}>
            返回课程详情
          </Button>
          <Button type="primary" onClick={handleOk}>
            再次拨打
          </Button>
        </div>
      }
    >
      <Spin spinning={loading}>
        <div className={style['zy-row']}>
          <div id="pie-box" ref={pieDomRef} className={`${style['pie-box']}`}></div>

          <div className={style['score-box']}>
            <Progress
              strokeLinecap="butt"
              type="circle"
              width={180}
              percent={percent}
              format={(per: any) => {
                return (
                  <div className={style['score-box']}>
                    <span style={{ fontSize: '40px' }}>{formateNum(score)}</span>
                    <div>
                      {pass ? <Tag color="success">合格</Tag> : <Tag color="error">不合格</Tag>}
                    </div>
                    <p style={{ color: "#00000073", fontSize: 12, marginTop: 10 }}>合格分数：{passScore}</p>
                  </div>
                );
              }}
            ></Progress>

            {tableData.length > 0 && (
              <Table
                rowKey="id"
                size="small"
                columns={columns}
                dataSource={tableData}
                style={{ marginTop: '16px', width: '320px' }}
                pagination={false}
                scroll={{ y: 140 }}
              ></Table>
            )}
          </div>
        </div>
      </Spin>
      <ChatRecord cref={chatRecordRef} />
    </Modal>
  );
};

export default ScoreModal;
