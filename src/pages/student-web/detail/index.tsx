import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import { Button, message, Input, Tag, Spin, Tooltip, Modal } from 'antd';
import DrawPanel from '@/pages/draw-panel/student';
import { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';
import { useDrawModel } from './model';
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import config from '@/config';
import style from './style.less';
import { formateTaskType, formateTaskModel } from '@/utils/formate-str';

const { basePath } = config;

const StudentDrawPanel: any = (props: any) => {
  const drawLf: any = useRef<any>(null);

  const curNodeRef: any = useRef<any>({});

  const query: any = history.location.query || {};

  const taskId: any = query?.taskId;
  const tab: any = query?.tab;

  //
  const [taskName, setTaskName] = useState<any>('');
  const [taskType, setTaskType] = useState<any>(0);
  const [taskModel, setTaskModel] = useState<any>(0);
  const taskType2 = useRef(null);
  // -------

  // 获取画布
  const { getDrawPanel, saveDrawPanel, addNode, deleteNode, loading, taskVerify, taskRetake } =
    useDrawModel();

  // 事件监听

  //初始化
  const init = async () => {
    if (!taskId) {
      message.warning('获取不到课程ID');
      return;
    }

    let res = await getDrawPanel({ taskId });
    if (res) {
      setTaskName(res.taskName || '');
      setTaskType(res.taskType || 0);
      setTaskModel(res.taskModel || 0);
      taskType2.current = res.taskType;
      drawLf.current?.initPanel(res);
    } else {
      drawLf.current?.initPanel({});
    }
  };

  // 保存画布
  const onSave = (data: any) => {
    const { nodes, edges } = data;
    saveDrawPanel({ nodes, edges });
  };

  // 监听节点添加  return true / false

  const _addNode = async (data: any) => {
    return addNode(data);
  };

  // 删除节点删除 return true / false
  const _deleteNode = async (data: any) => {
    return deleteNode(data);
  };

  // 双击连线
  const onEdgeDbClick = async (data: any) => {
    console.log(data);
  };

  const onExtraEvent = (name: any, data: any) => {
    console.log(name, data);
    let courseId = data.properties.courseId;
    let text = data.properties.value;
    let courseType = data.properties.courseType;
    if (name === 'step-tips:button-click') {
      if (!courseId) {
        message.warning('获取不到课程ID');
        return;
      }
      const fn = () => {
        let url = `/front/student/chat?taskId=${taskId}&courseId=${courseId}&nodeId=${data.id}`;
        if (courseType == 2) {
          url = `/front/student/course/question-list?name=${text}&taskId=${taskId}&courseId=${courseId}&nodeId=${data.id}`;
        } else if (courseType == 3) {
          // 视频课程
          url = `/front/student/video-list?taskId=${taskId}&courseId=${courseId}&nodeId=${data.id}&name=${text}`;
        } else if (courseType === 4) {
          // 大模型课程
          url = `/front/student/model?taskId=${taskId}&courseId=${courseId}&nodeId=${data.id}`;
        } else {
          url = `/front/student/chat?taskId=${taskId}&courseId=${courseId}&nodeId=${data.id}`;
        }
        // location.href = url;
        history.push(url);
      };
      if (taskType2.current == '2') {
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
      } else {
        fn();
      }
    }
  };

  const goBack = () => {
    if (!taskId) {
      console.log('获取不到task_id');
      return;
    }
    // 回到画布页面
    history.replace(`/front/student/course?tab=${tab}`);
  };

  const [statusNum, setStatusNum] = useState<any>(0);

  const statusList = ['doing', 'wait', 'finish'];

  const changeStatus = async (data: any) => {
    if (!curNodeRef.current.id) {
      message.warning('请先双击选中节点');
      return null;
    }

    let status = null;
    if (statusNum < 2) {
      status = statusList[statusNum + 1];
      setStatusNum(statusNum + 1);
    } else {
      status = statusList[0];
      setStatusNum(0);
    }

    let lf = drawLf.current.getLf();
    lf.setProperties(curNodeRef.current.id, {
      status,
    });
  };

  useEffect(() => {
    //初始化画布
    init();
  }, []);

  const _taskType = formateTaskType(taskType);

  return (
    <PageContainer
      header={{
        title: '',
        ghost: true,
      }}
      content={
        <div className={style['page-header']}>
          <div>
            <div className={style['title']}>
              <ArrowLeftOutlined onClick={goBack} style={{ marginRight: '8px' }} />
              <span style={{ marginRight: '8px' }}>{taskName}</span>
              {_taskType == '培训' && <Tag color="blue">{_taskType + '课程'}</Tag>}
              {_taskType == '考试' && <Tag color="orange">{_taskType + '课程'}</Tag>}
              {taskModel != 0 && (
                <Tooltip
                  title={
                    formateTaskModel(taskModel) === '闯关模式'
                      ? '闯关模式需完成上一个训练才可解锁下一个训练'
                      : '可任意选择训练'
                  }
                >
                  <Tag color="default">
                    {formateTaskModel(taskModel)} <QuestionCircleOutlined />
                  </Tag>
                </Tooltip>
              )}
            </div>
          </div>
          <div className={style['header-right']}>
            <Button type="default" onClick={init} loading={loading} style={{ marginRight: '16px' }}>
              刷新
            </Button>
          </div>
        </div>
      }
    >
      <Spin spinning={loading} size="large">
        <div className={style['detail-page']}>
          <DrawPanel
            cref={drawLf}
            isSilentMode={true}
            onSave={onSave} // 保存
            onExtraEvent={onExtraEvent}
          />
        </div>
      </Spin>
    </PageContainer>
  );
};

export default StudentDrawPanel;
