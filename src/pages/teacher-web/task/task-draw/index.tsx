import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { Button, message, Input, Space, Tag, Tooltip, Popconfirm } from 'antd';
import DrawPanel from '@/pages/draw-panel/task';
import style from '../style.less';
import { useDrawModel } from '@/pages/student-web/detail/model';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useTaskDrawModel, useTaskModel } from '../model';
import FlowDrawer from '../components/flowDrawer';
import { formateTaskModel, formateTaskType } from '@/utils/formate-str';

const TaskDrawPanel: any = (props: any) => {
  const drawLf: any = useRef<any>(null);

  const curNodeRef: any = useRef<any>({});
  const flowNodeFormRef: any = useRef<any>({});

  const [taskInfo, setTaskInfo] = useState<any>({});

  // 输入框
  const [nameVal, setNameVal] = useState<any>('');

  const [inputVal, setInputVal] = useState<any>('');
  const onChangeInput = (e: any) => {
    setInputVal(e.target.value);
  };
  const onBtClick = () => {
    let lf = drawLf.current.getLf();
    lf.updateText(curNodeRef.current.id, inputVal);
    // curNodeRef.current.text.value = inputVal
  };

  //获取任务详情
  const { taskDetail } = useTaskModel();

  // -------
  // 获取画布
  const { getDrawPanel, saveDrawPanel } = useTaskDrawModel();

  // 事件监听

  //初始化
  const init = async () => {
    let res = await getDrawPanel({ id: history?.location?.query?.id });
    drawLf.current?.initPanel({});
    if (res) {
      drawLf.current?.initPanel(res);
    }
  };

  // 保存画布
  const onSave = (data: any) => {
    const { nodes, edges } = data;
    console.log(nodes, edges);

    let reqData = { nodes: nodes, edges: edges, id: history?.location?.query?.id };
    saveDrawPanel(reqData);
  };

  // 监听节点添加  return true / false

  const _addNode = async (data: any) => {
    console.log('addNode:');
    console.log(data);
    return true;
  };

  // 删除节点删除 return true / false
  const _deleteNode = async (data: any) => {
    return true;
  };

  // 双击节点
  const onNodeDbClick = async (data: any) => {
    console.log(data);
    curNodeRef.current = data;
    if (data.type == 'step') {
      flowNodeFormRef?.current?.open(data, 'step');
    } else {
      flowNodeFormRef?.current?.open(data, 'other');
    }

    if (data.type === 'step-html') {
      setStatusNum(2);
    }
    setNameVal(data?.text?.value);
  };

  // 双击连线
  const onEdgeDbClick = async (data: any) => {
    console.log(data);
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

  //改名字
  const changeNodeName = async (id: any, obj: any, type: any) => {
    let lf = drawLf?.current?.getLf?.();
    lf.updateText(id, obj.value);
    if (type == 'step') {
      lf.setProperties(id, obj);
    }
  };

  const getDetail = async () => {
    await taskDetail({ id: history?.location?.query?.id }).then((res: any) => {
      setTaskInfo(res?.data || {});
      setTimeout(() => {
        init();
      }, 100);
    });
  };

  useEffect(() => {
    getDetail();
    //初始化画布
  }, []);

  return (
    <>
      <DrawPanel
        cref={drawLf}
        preMenu={
          // <Space align="baseline">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Popconfirm
              placement="bottomLeft"
              title="如有修改画布内容请确定已保存"
              onConfirm={() => {
                history.push('/front/teacher/task');
              }}
            >
              <ArrowLeftOutlined style={{ fontSize: '22px', marginRight: '8px' }} />
            </Popconfirm>

            <Tooltip title={history?.location?.query?.name || '-'}>
              <span
                className={style['drawTitle']}
                style={{ fontSize: '20px', fontWeight: '500', marginRight: '8px' }}
              >
                {history?.location?.query?.name || '-'}
              </span>
            </Tooltip>

            {taskInfo?.taskType != 0 && (
              <Tag color="blue">{formateTaskType(taskInfo?.taskType) + '课程'}</Tag>
            )}
            {taskInfo?.taskModel != 0 && (
              <Tag color="orange">{formateTaskModel(taskInfo?.taskModel)}</Tag>
            )}
          </div>

          // </Space>
        }
        onSave={onSave} // 保存
        addNode={_addNode} // 添加
        deleteNode={_deleteNode} // 删除
        onNodeDbClick={onNodeDbClick} // 双击点击节点
        onEdgeDbClick={onEdgeDbClick} // 双击连线
        isSilentMode={taskInfo?.taskStatus}
      />
      <FlowDrawer cref={flowNodeFormRef} changeNodeName={changeNodeName}></FlowDrawer>
    </>
  );
};

export default TaskDrawPanel;
